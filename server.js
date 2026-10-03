const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;

// ==========================================
// ENVIRONMENT CONFIGURATION
// ==========================================
// Load .env if present
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...rest] = line.split('=');
      if (key && key.trim() && !key.startsWith('#')) {
        process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });
  }
} catch (e) {}

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_API_KEY = process.env.TWILIO_API_KEY || '';
const TWILIO_API_KEY_SECRET = process.env.TWILIO_API_KEY_SECRET || '';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

const twilioConfigured = !!(TWILIO_ACCOUNT_SID && TWILIO_API_KEY && TWILIO_API_KEY_SECRET && TWILIO_PHONE_NUMBER);
const razorpayConfigured = !!(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);

// ==========================================
// IN-MEMORY STORES (localStorage is browser-side; server keeps notification + bill history)
// ==========================================
const notifications = [];
const bills = [];
let notifIdCounter = 1;
let billIdCounter = 1;

// ==========================================
// TWILIO SMS SERVICE
// ==========================================
async function sendTwilioSMS(to, body) {
  if (!twilioConfigured) {
    return { demo: true, message: 'Twilio is not configured. This is a demo notification.' };
  }

  const https = require('https');
  const credentials = Buffer.from(`${TWILIO_API_KEY}:${TWILIO_API_KEY_SECRET}`).toString('base64');
  const postData = new URLSearchParams({
    To: to,
    From: TWILIO_PHONE_NUMBER,
    Body: body
  }).toString();

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.twilio.com',
      path: `/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ sid: parsed.sid, status: parsed.status });
          } else {
            reject(new Error(parsed.message || 'Twilio error'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ==========================================
// RAZORPAY ORDER SERVICE
// ==========================================
async function createRazorpayOrder(amountInPaise, receipt) {
  if (!razorpayConfigured) {
    return { demo: true, orderId: `demo_order_${Date.now()}` };
  }

  const https = require('https');
  const credentials = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
  const postData = JSON.stringify({
    amount: amountInPaise,
    currency: 'INR',
    receipt: receipt,
    payment_capture: 1
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.razorpay.com',
      path: '/v1/orders',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ orderId: parsed.id, amount: parsed.amount });
          } else {
            reject(new Error(parsed.error?.description || 'Razorpay error'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function verifyRazorpaySignature(orderId, paymentId, signature) {
  if (!razorpayConfigured) return true; // demo mode
  const text = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(text).digest('hex');
  return expected === signature;
}

// ==========================================
// BILLING CHARGE RATES (INR per resource)
// ==========================================
const BED_RATES = { ICU: 2000, Emergency: 1200, General: 800 };
const DOCTOR_CHARGE = 500;
const EQUIPMENT_CHARGES = { Ventilator: 1500, Monitor: 500, Oxygen: 300 };

function calculateBillCharges(patient) {
  const bedType = patient.requiredBedType || 'General';
  const eqType = patient.requiredEquipment || 'None';
  const bedCharge = BED_RATES[bedType] || 800;
  const doctorCharge = DOCTOR_CHARGE;
  const equipmentCharge = eqType !== 'None' ? (EQUIPMENT_CHARGES[eqType] || 0) : 0;
  const totalAmount = bedCharge + doctorCharge + equipmentCharge;
  return { bedCharge, doctorCharge, equipmentCharge, totalAmount, bedType, eqType };
}

// ==========================================
// HTTP UTILITIES
// ==========================================
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (e) { resolve({}); }
    });
    req.on('error', reject);
  });
}

function jsonRes(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

// ==========================================
// ENGINE LOADER (Greedy Algorithm)
// ==========================================
let engineData = null;
try {
  const code = fs.readFileSync(path.join(PUBLIC_DIR, 'app.js'), 'utf8');
  const engineCode = code.substring(0, code.indexOf('class App {'));
  const fn = new Function(engineCode + `
    return { INITIAL_PATIENTS, INITIAL_RESOURCES, GreedyAllocationEngine };
  `);
  engineData = fn();
} catch (err) {
  console.warn('Could not load backend engine from app.js:', err.message);
}

// ==========================================
// HTTP SERVER
// ==========================================
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const parsedUrl = req.url.split('?')[0];

  // ==========================================
  // API ROUTES
  // ==========================================
  if (parsedUrl.startsWith('/api/')) {

    // --- HEALTH ---
    if (parsedUrl === '/api/health') {
      return jsonRes(res, 200, {
        status: 'ok', name: 'MediAlloc API', version: '3.0.0',
        twilio: twilioConfigured ? 'configured' : 'demo-mode',
        razorpay: razorpayConfigured ? 'configured' : 'demo-mode',
        timestamp: new Date().toISOString()
      });
    }

    // --- EXISTING ENDPOINTS ---
    if (parsedUrl === '/api/patients') {
      return jsonRes(res, 200, {
        success: true,
        count: engineData ? engineData.INITIAL_PATIENTS.length : 0,
        data: engineData ? engineData.INITIAL_PATIENTS : []
      });
    }

    if (parsedUrl === '/api/resources') {
      return jsonRes(res, 200, { success: true, data: engineData ? engineData.INITIAL_RESOURCES : {} });
    }

    if (parsedUrl === '/api/allocate') {
      if (engineData) {
        const pCopy = JSON.parse(JSON.stringify(engineData.INITIAL_PATIENTS));
        const rCopy = JSON.parse(JSON.stringify(engineData.INITIAL_RESOURCES));
        const result = engineData.GreedyAllocationEngine.runAllocation(pCopy, rCopy);
        return jsonRes(res, 200, {
          success: true,
          total: result.updatedPatients.length,
          allocated: result.updatedPatients.filter(p => p.status === 'Allocated').length,
          waiting: result.updatedPatients.filter(p => p.status === 'Waiting').length,
          data: result
        });
      }
      return jsonRes(res, 500, { success: false, error: 'Engine unavailable' });
    }

    // ==========================================
    // NOTIFICATIONS API
    // ==========================================

    // GET /api/notifications — list all
    if (parsedUrl === '/api/notifications' && req.method === 'GET') {
      return jsonRes(res, 200, { success: true, total: notifications.length, data: notifications });
    }

    // GET /api/notifications/config — check Twilio status
    if (parsedUrl === '/api/notifications/config' && req.method === 'GET') {
      return jsonRes(res, 200, {
        success: true,
        twilioConfigured,
        mode: twilioConfigured ? 'live' : 'demo',
        message: twilioConfigured
          ? 'Twilio is configured. Real SMS will be sent.'
          : 'Twilio credentials not configured. Notifications will be saved as Demo.'
      });
    }

    // POST /api/notifications/send — send SMS
    if (parsedUrl === '/api/notifications/send' && req.method === 'POST') {
      const body = await readBody(req);
      const { patientId, patientName, phoneNumber, message } = body;

      if (!message) {
        return jsonRes(res, 400, { success: false, error: 'message is required' });
      }

      const notifId = `NOTIF-${String(notifIdCounter++).padStart(4, '0')}`;
      const notif = {
        id: notifId,
        patientId: patientId || 'UNKNOWN',
        patientName: patientName || 'Unknown Patient',
        phoneNumber: phoneNumber || '+000000000000',
        message,
        provider: 'Twilio',
        status: 'Pending',
        twilioSid: null,
        error: null,
        createdAt: new Date().toISOString(),
        sentAt: null
      };

      try {
        const result = await sendTwilioSMS(phoneNumber || '+000000000000', message);
        if (result.demo) {
          notif.status = 'Demo';
          notif.error = result.message;
        } else {
          notif.status = 'Sent';
          notif.twilioSid = result.sid;
          notif.sentAt = new Date().toISOString();
        }
      } catch (err) {
        notif.status = 'Failed';
        notif.error = err.message || 'SMS delivery failed';
      }

      notifications.unshift(notif);
      return jsonRes(res, 200, {
        success: true,
        notification: notif,
        message: notif.status === 'Demo'
          ? 'Demo notification saved (Twilio not configured)'
          : notif.status === 'Sent'
            ? 'SMS sent successfully via Twilio'
            : `SMS failed: ${notif.error}`
      });
    }

    // POST /api/notifications/send-bulk — notify all waiting patients
    if (parsedUrl === '/api/notifications/send-bulk' && req.method === 'POST') {
      const body = await readBody(req);
      const { patients, message } = body;
      if (!Array.isArray(patients)) {
        return jsonRes(res, 400, { success: false, error: 'patients array required' });
      }
      const results = [];
      for (const pt of patients) {
        if (!pt.phoneNumber) continue;
        const notifId = `NOTIF-${String(notifIdCounter++).padStart(4, '0')}`;
        const notif = {
          id: notifId,
          patientId: pt.patientId || pt.id || 'UNKNOWN',
          patientName: pt.patientName || pt.name || 'Unknown',
          phoneNumber: pt.phoneNumber,
          message: message || `Hospital Resource Allocation: A resource is now available. Please contact the emergency department.`,
          provider: 'Twilio',
          status: 'Pending',
          twilioSid: null,
          error: null,
          createdAt: new Date().toISOString(),
          sentAt: null
        };
        try {
          const result = await sendTwilioSMS(pt.phoneNumber, notif.message);
          if (result.demo) { notif.status = 'Demo'; notif.error = result.message; }
          else { notif.status = 'Sent'; notif.twilioSid = result.sid; notif.sentAt = new Date().toISOString(); }
        } catch (err) {
          notif.status = 'Failed'; notif.error = err.message;
        }
        notifications.unshift(notif);
        results.push(notif);
      }
      return jsonRes(res, 200, { success: true, sent: results.length, data: results });
    }

    // ==========================================
    // BILLING API
    // ==========================================

    // GET /api/bills — list all bills
    if (parsedUrl === '/api/bills' && req.method === 'GET') {
      const totalRevenue = bills.filter(b => b.paymentStatus === 'Paid')
        .reduce((sum, b) => sum + b.totalAmount, 0);
      const pendingAmount = bills.filter(b => b.paymentStatus === 'Pending')
        .reduce((sum, b) => sum + b.totalAmount, 0);
      return jsonRes(res, 200, {
        success: true,
        total: bills.length,
        paid: bills.filter(b => b.paymentStatus === 'Paid').length,
        pending: bills.filter(b => b.paymentStatus === 'Pending').length,
        totalRevenue, pendingAmount,
        data: bills
      });
    }

    // GET /api/bills/config — check Razorpay status
    if (parsedUrl === '/api/bills/config' && req.method === 'GET') {
      return jsonRes(res, 200, {
        success: true,
        razorpayConfigured,
        razorpayKeyId: razorpayConfigured ? RAZORPAY_KEY_ID : null,
        mode: razorpayConfigured ? 'live' : 'demo',
        message: razorpayConfigured
          ? 'Razorpay is configured. Real payments enabled.'
          : 'Razorpay credentials not configured. Demo payment mode active.'
      });
    }

    // GET /api/bills/:id
    const billByIdMatch = parsedUrl.match(/^\/api\/bills\/([^/]+)$/);
    if (billByIdMatch && req.method === 'GET') {
      const bill = bills.find(b => b.id === billByIdMatch[1]);
      if (!bill) return jsonRes(res, 404, { success: false, error: 'Bill not found' });
      return jsonRes(res, 200, { success: true, data: bill });
    }

    // POST /api/bills/generate — generate a bill from patient data
    if (parsedUrl === '/api/bills/generate' && req.method === 'POST') {
      const body = await readBody(req);
      const patient = body.patient;
      if (!patient) return jsonRes(res, 400, { success: false, error: 'patient data required' });

      // Check if bill already exists
      const existing = bills.find(b => b.patientId === (patient.id || patient.patientId));
      if (existing) {
        return jsonRes(res, 200, { success: true, data: existing, message: 'Existing bill returned' });
      }

      const charges = calculateBillCharges(patient);
      const billId = `BILL-${String(billIdCounter++).padStart(4, '0')}`;
      const bill = {
        id: billId,
        patientId: patient.id || patient.patientId,
        patientName: patient.name || patient.patientName,
        age: patient.age,
        emergencyLevel: patient.emergencyLevel,
        bedType: charges.bedType,
        doctorSpec: patient.requiredDoctorSpec,
        equipmentType: charges.eqType,
        bedCharge: charges.bedCharge,
        doctorCharge: charges.doctorCharge,
        equipmentCharge: charges.equipmentCharge,
        totalAmount: charges.totalAmount,
        paymentStatus: 'Pending',
        paymentMethod: null,
        transactionId: null,
        razorpayOrderId: null,
        createdAt: new Date().toISOString(),
        paidAt: null
      };
      bills.unshift(bill);
      return jsonRes(res, 200, { success: true, data: bill, message: 'Bill generated successfully' });
    }

    // POST /api/payments/create-order — create Razorpay order
    if (parsedUrl === '/api/payments/create-order' && req.method === 'POST') {
      const body = await readBody(req);
      const { billId } = body;
      const bill = bills.find(b => b.id === billId);
      if (!bill) return jsonRes(res, 404, { success: false, error: 'Bill not found' });
      if (bill.paymentStatus === 'Paid') return jsonRes(res, 400, { success: false, error: 'Bill already paid' });

      try {
        const amountInPaise = bill.totalAmount * 100;
        const order = await createRazorpayOrder(amountInPaise, billId);
        bill.razorpayOrderId = order.orderId;
        return jsonRes(res, 200, {
          success: true,
          orderId: order.orderId,
          amount: bill.totalAmount,
          amountInPaise,
          currency: 'INR',
          demo: !!order.demo,
          razorpayKeyId: razorpayConfigured ? RAZORPAY_KEY_ID : null,
          bill,
          message: order.demo ? 'Demo order created (Razorpay not configured)' : 'Razorpay order created'
        });
      } catch (err) {
        return jsonRes(res, 500, { success: false, error: err.message });
      }
    }

    // POST /api/payments/verify — verify signature and mark bill paid
    if (parsedUrl === '/api/payments/verify' && req.method === 'POST') {
      const body = await readBody(req);
      const { billId, razorpayOrderId, razorpayPaymentId, razorpaySignature, demo, paymentMethod } = body;
      const bill = bills.find(b => b.id === billId);
      if (!bill) return jsonRes(res, 404, { success: false, error: 'Bill not found' });

      if (demo) {
        // Demo/manual payment
        bill.paymentStatus = 'Paid';
        bill.paymentMethod = paymentMethod || 'Cash / Demo';
        bill.transactionId = `DEMO-${Date.now()}`;
        bill.paidAt = new Date().toISOString();
        return jsonRes(res, 200, { success: true, data: bill, message: 'Demo payment recorded successfully' });
      }

      // Verify Razorpay signature
      const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
      if (!isValid) {
        return jsonRes(res, 400, { success: false, error: 'Payment signature verification failed' });
      }

      bill.paymentStatus = 'Paid';
      bill.paymentMethod = 'Razorpay';
      bill.transactionId = razorpayPaymentId;
      bill.razorpayOrderId = razorpayOrderId;
      bill.paidAt = new Date().toISOString();
      return jsonRes(res, 200, { success: true, data: bill, message: 'Payment verified and bill marked as Paid' });
    }

    // POST /api/payments/mark-paid — manual cash payment
    if (parsedUrl === '/api/payments/mark-paid' && req.method === 'POST') {
      const body = await readBody(req);
      const { billId, paymentMethod } = body;
      const bill = bills.find(b => b.id === billId);
      if (!bill) return jsonRes(res, 404, { success: false, error: 'Bill not found' });
      bill.paymentStatus = 'Paid';
      bill.paymentMethod = paymentMethod || 'Cash';
      bill.transactionId = `CASH-${Date.now()}`;
      bill.paidAt = new Date().toISOString();
      return jsonRes(res, 200, { success: true, data: bill, message: 'Bill marked as paid' });
    }

    // 404 for unknown API routes
    return jsonRes(res, 404, { success: false, error: 'API endpoint not found' });
  }

  // ==========================================
  // STATIC FILE SERVING
  // ==========================================
  let reqPath = parsedUrl;
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\\/])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('404 Not Found'); }
      else { res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end('500 Server Error: ' + err.code); }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🏥 MediAlloc Server running at http://localhost:${PORT}/`);
  console.log(`   Twilio SMS: ${twilioConfigured ? '✅ Configured (Live Mode)' : '⚠️  Demo Mode (no credentials)'}`);
  console.log(`   Razorpay:   ${razorpayConfigured ? '✅ Configured (Live Mode)' : '⚠️  Demo Mode (no credentials)'}`);
  console.log(`\nAPI endpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  POST /api/notifications/send`);
  console.log(`  GET  /api/notifications`);
  console.log(`  POST /api/bills/generate`);
  console.log(`  GET  /api/bills`);
  console.log(`  POST /api/payments/create-order`);
  console.log(`  POST /api/payments/verify`);
  console.log(`  POST /api/payments/mark-paid\n`);
});

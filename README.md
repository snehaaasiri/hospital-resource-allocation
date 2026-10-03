# 🏥 MediAlloc — Hospital Resource AI & Management Platform

A clinical decision support & hospital resource management system that automates the allocation of scarce hospital resources (ICU/Emergency/General beds, specialized doctors, and critical medical equipment) to incoming patients based on emergency triage priority using a **Greedy Algorithm**.

Now upgraded with **SMS Notifications via Twilio** and **Automated Billing & Payments via Razorpay**.

---

## 🌟 Key Features

1. **📊 Executive Clinical Command Dashboard (v0 Design)**
   - 8 live metrics: Total Patients, Critical Patients, Available Beds, Available Doctors, Available Equipment, Allocated Patients, Waiting Patients, and Efficiency.
   - Interactive SVG Emergency Priority Donut Chart & Resource Capacity bars.
   - Live intake queue table with fast search, filtering, and instant action buttons.

2. **👥 Patient Intake & Admission**
   - Form fields: Name, Patient ID, Age (1–120), Emergency Level, Phone Number (for SMS), Required Bed, Doctor Specialization, Equipment, and Arrival Timestamp.
   - Dynamic Emergency Priority Scoring:
     - **Critical** = 4 (Immediate resuscitation / life-saving)
     - **Serious** = 3 (Acute clinical instability)
     - **Moderate** = 2 (Urgent attention)
     - **Normal** = 1 (Standard non-critical care)
   - FIFO tie-breaker within identical priority scores.

3. **🏥 Hospital Resource Inventory**
   - Categorized tabs: **Beds** (ICU, Emergency, General), **Specialized Doctors** (Cardiologist, General Physician, Pulmonologist, Neurologist, Orthopedic), and **Equipment** (Ventilators, Monitors, Oxygen).
   - Real-time availability toggles (online/offline maintenance) and capacity tracking.

4. **⚡ Greedy Allocation Engine**
   - Sorts queue: Priority Score DESC (`4 > 3 > 2 > 1`), Arrival Time ASC (`FIFO`).
   - Atomic evaluation: Requires matching Bed + Doctor + Equipment simultaneously.
   - Detailed bottleneck explanations for waiting patients (e.g., *"Waiting: ICU Bed unavailable"*).

5. **📱 SMS Notifications (Twilio)**
   - Notify waiting patients when matching resources become available.
   - Notify allocated patients with arrival instructions.
   - Dedicated **Notifications** page with delivery stats and history table.
   - Dual mode: Real SMS via Twilio or graceful fallback to Demo Mode.

6. **💳 Automated Billing & Payments (Razorpay)**
   - Auto-generates itemized hospital bill as soon as an allocated patient is marked as **Treated**.
   - Resource pricing rules (INR):
     - ICU Bed: ₹2,000/day | Emergency Bed: ₹1,200/day | General Bed: ₹800/day
     - Doctor Consultation: ₹500
     - Ventilator: ₹1,500 | Monitor: ₹500 | Oxygen: ₹300
   - Dedicated **Billing** page with revenue metrics, pending balance, and filters.
   - Pay via Razorpay Checkout, Cash (Manual), or Demo Payment with instant invoice download.

7. **🧪 What-If Simulation Sandbox**
   - Stress-test hospital capacity under disruption scenarios without modifying active data.
   - Side-by-side comparison tables, delta pills, and bottleneck diagnosis.

8. **📈 Operations & Analytics Reporting**
   - Live hospital operations metrics: Resource utilization percentages, average wait time, most requested resource, and critical fulfillment rate.

---

## 📱 Twilio SMS Integration

### How to Create a Twilio Account & Get Credentials
1. Sign up for a free trial at [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio).
2. Go to the [Twilio Console](https://console.twilio.com/).
3. Locate your **Account SID** on the dashboard.
4. Go to **Account > API Keys & Tokens** to create an API Key (or use your Auth Token):
   - `TWILIO_API_KEY`
   - `TWILIO_API_KEY_SECRET`
5. Get a Twilio phone number under **Phone Numbers > Manage > Buy a number** (or use your trial number):
   - `TWILIO_PHONE_NUMBER` (in E.164 format, e.g. `+1234567890`)

### Where to Add Credentials
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Populate the Twilio credentials:
   ```env
   TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   TWILIO_API_KEY=SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   TWILIO_API_KEY_SECRET=your_api_key_secret_here
   TWILIO_PHONE_NUMBER=+12015550123
   ```
3. Restart the server (`node server.js`).

### How Demo Mode Works
- If Twilio environment variables are omitted or blank, **the application never crashes**.
- The server automatically switches to **Demo Mode**.
- Outgoing SMS notifications are recorded with status `Demo` and message:  
  *“Twilio is not configured. This is a demo notification.”*
- The Notifications dashboard displays a live badge: `⚠️ Twilio: Demo Mode`.
- You can test full user workflows, view notification history, and demonstrate the feature without entering API credentials.

---

## 💳 Razorpay Billing Integration

### How to Create Razorpay Test Keys
1. Create a free account at [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/).
2. Toggle the dashboard to **Test Mode** (top-right switch).
3. Navigate to **Settings > API Keys**.
4. Click **Generate Key** to receive:
   - `Key ID` (starts with `rzp_test_...`)
   - `Key Secret`

### Where to Add Credentials
In your backend `.env` file:
```env
RAZORPAY_KEY_ID=rzp_test_yourKeyIdHere
RAZORPAY_KEY_SECRET=yourKeySecretHere
```
Restart the server (`node server.js`).

### How Billing is Calculated
When a patient is discharged by clicking **“Treat & Discharge”**:
- Bed Charge:
  - ICU: ₹2,000
  - Emergency: ₹1,200
  - General: ₹800
- Doctor Consultation: ₹500
- Equipment Charge:
  - Ventilator: ₹1,500
  - Monitor: ₹500
  - Oxygen: ₹300
  - None: ₹0
- Total Amount = Bed Charge + Doctor Consultation + Equipment Charge.

### How Payment Verification Works
1. Staff clicks **“Pay”** on an open bill.
2. The frontend requests an order from `POST /api/payments/create-order`.
3. The server calls the Razorpay Orders API (`https://api.razorpay.com/v1/orders`) with the bill amount in paise (`totalAmount * 100`).
4. Razorpay Checkout modal opens. Upon card/UPI authorization, Razorpay returns:
   - `razorpay_order_id`
   - `razorpay_payment_id`
   - `razorpay_signature`
5. The frontend submits these to `POST /api/payments/verify`.
6. The backend verifies the HMAC SHA256 signature using `RAZORPAY_KEY_SECRET`:
   ```js
   const expected = crypto.createHmac('sha256', SECRET)
     .update(`${orderId}|${paymentId}`)
     .digest('hex');
   ```
7. Upon validation, the bill status transitions to **Paid**, stores the transaction ID, and records the timestamp.

### How Demo Payment Mode Works
- If Razorpay credentials are not provided, the UI automatically offers:
  1. **Demo Payment**: Instantly marks the bill as Paid with a simulated transaction ID (`DEMO-...`).
  2. **Cash (Manual)**: Records offline cash settlement with transaction ID (`CASH-...`).
- The bill details modal allows immediate text invoice export (`BILL-XXXX-Invoice.txt`).

---

## 🔒 Security & Safe Secrets Management
- All API secrets (`TWILIO_API_KEY_SECRET`, `RAZORPAY_KEY_SECRET`) are read **only** by the Node.js backend.
- Secret keys are **never** bundled into the client-side JavaScript or sent in API responses.
- `.env` is ignored via `.gitignore` to prevent leaking to Git.
- An `.env.example` template provides dummy placeholder names.

---

## 🚀 Complete End-to-End Demo Flow (For Judges / Jury)

Follow this 11-step sequence to demonstrate the complete MediAlloc workflow:

1. **Admit a Patient with Phone Number**:
   - Click **“Admit Patient”** in the header or dashboard.
   - Enter Name (e.g., `Rajesh Kumar`), Age `54`, Level `Critical`, Bed `ICU`, Doctor `Cardiologist`, Equipment `Ventilator`.
   - Enter Phone Number: `+91 98765 43210`.
   - Click **“Admit Patient”**.

2. **Verify Resource Status**:
   - Go to **Resources** in the sidebar. Note current available counts for ICU Beds, Cardiologists, and Ventilators.

3. **Run Greedy Allocation**:
   - Click **“Run Greedy Allocation”** in the top header.
   - Watch the allocation engine evaluate priorities. Patients with available resources turn **Allocated**; patients lacking resources turn **Waiting** with clear bottleneck reasons.

4. **Send SMS to a Waiting Patient**:
   - Navigate to **Waiting List** from the sidebar.
   - On any waiting patient, click **“Notify”**.
   - Notice the phone number and alert message are pre-filled.
   - Click **“Send SMS”**. A toast confirms delivery (or demo notification logged).
   - Go to the **Notifications** page to inspect the history entry.

5. **Bulk Notify Waiting Queue**:
   - On the **Notifications** page, click **“Notify All Waiting”**.
   - Confirms and sends batch alerts to all patients in the waiting queue with valid phone numbers.

6. **Treat & Discharge Patient**:
   - Go to **Results** in the sidebar (or find an allocated patient in the Dashboard).
   - Click **“Treat & Discharge”**.
   - Notice two things happen simultaneously:
     1. The patient's assigned bed, doctor, and equipment are immediately freed and returned to the hospital's available pool.
     2. An itemized hospital bill is automatically generated. A toast appears with the Bill ID and total amount.

7. **Review the Bill & Invoice**:
   - Click **Billing** in the sidebar.
   - Find the newly generated bill in the table with status `Pending`.
   - Click **“View”** to open the professional hospital invoice modal displaying line-item charges for bed, doctor consultation, and equipment.
   - Click **“Download Invoice”** to save a text invoice file.

8. **Process Payment (Razorpay / Demo)**:
   - Click **“Pay Now”** (or click **“Pay”** in the table).
   - Select payment method:
     - If Razorpay keys are configured: opens the real Razorpay modal.
     - In Demo mode: click **“Demo Payment”** or **“Pay via Cash”**.
   - A success toast confirms payment.

9. **Verify Real-Time Financial Settlement**:
   - The bill badge flips to **Paid** (green).
   - Revenue Collected metric increases by the bill amount.
   - Pending Amount automatically decreases.

10. **Re-run Greedy Allocation with Freed Resources**:
    - Click **“Run Greedy Allocation”** again.
    - Previously waiting patients will now claim the newly freed bed and doctor!

11. **Check Operational Reports**:
    - Navigate to **Reports** to see updated bed occupancy rates, average waiting time, and discharge statistics.

---

## 💻 How to Run Locally

### Start the Server:
```bash
# In the project directory:
node server.js
```
The server will start on port `8080`:
```
🏥 MediAlloc Server running at http://localhost:8080/
   Twilio SMS: ⚠️  Demo Mode (or ✅ Configured)
   Razorpay:   ⚠️  Demo Mode (or ✅ Configured)
```
Open **[http://localhost:8080/](http://localhost:8080/)** in any modern web browser.

---

## 📁 Project Structure

```
hospital-resource-allocation/
├── index.html        # Semantic HTML single-page command center with 10 view sections & modals
├── styles.css        # Hospital design system, responsive layout, status badges, dark mode
├── app.js            # StorageManager, GreedyAllocationEngine, Twilio/Razorpay client, UI controller
├── server.js         # Node.js HTTP server & REST API (Twilio SMS & Razorpay payment endpoints)
├── .env.example      # Environment variable template
├── .gitignore        # Ignores .env and credentials
└── README.md         # Comprehensive documentation & demo guide
```

---

*MediAlloc — Hospital Resource AI Platform*

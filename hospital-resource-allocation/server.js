const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;

// Extract core engine for API endpoints
let engineData = null;
try {
  const code = fs.readFileSync(path.join(PUBLIC_DIR, "app.js"), "utf8");
  const engineCode = code.substring(0, code.indexOf("class App {"));
  const fn = new Function(engineCode + `
    return {
      INITIAL_PATIENTS,
      INITIAL_RESOURCES,
      GreedyAllocationEngine
    };
  `);
  engineData = fn();
} catch (err) {
  console.warn("Could not load backend engine from app.js:", err.message);
}

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

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = req.url.split('?')[0];

  // API Endpoints
  if (parsedUrl.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    if (parsedUrl === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({
        status: "ok",
        name: "MediAlloc API",
        version: "2.0.0",
        timestamp: new Date().toISOString()
      }));
      return;
    }

    if (parsedUrl === '/api/patients') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        count: engineData ? engineData.INITIAL_PATIENTS.length : 0,
        data: engineData ? engineData.INITIAL_PATIENTS : []
      }));
      return;
    }

    if (parsedUrl === '/api/resources') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: engineData ? engineData.INITIAL_RESOURCES : {}
      }));
      return;
    }

    if (parsedUrl === '/api/allocate') {
      if (engineData) {
        const patientsCopy = JSON.parse(JSON.stringify(engineData.INITIAL_PATIENTS));
        const resourcesCopy = JSON.parse(JSON.stringify(engineData.INITIAL_RESOURCES));
        const result = engineData.GreedyAllocationEngine.runAllocation(patientsCopy, resourcesCopy);
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          total: result.updatedPatients.length,
          allocated: result.updatedPatients.filter(p => p.status === "Allocated").length,
          waiting: result.updatedPatients.filter(p => p.status === "Waiting").length,
          data: result
        }));
      } else {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: "Engine unavailable" }));
      }
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ success: false, error: "API endpoint not found" }));
    return;
  }

  // Static File Serving
  let reqPath = parsedUrl;
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`MediAlloc Server & API running at http://localhost:${PORT}/`);
});

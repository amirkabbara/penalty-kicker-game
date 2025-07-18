const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3002;

const server = http.createServer((req, res) => {
  // Serve index.html for root path
  if (req.url === '/' || req.url === '/index.html') {
    return fs.readFile('index.html', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    });
  }
  
  // Serve script.js
  if (req.url === '/script.js') {
    return fs.readFile('script.js', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, {'Content-Type': 'application/javascript'});
      res.end(data);
    });
  }
  
  // Handle style.css
  if (req.url === '/style.css') {
    return fs.readFile('style.css', (err, data) => {
      if (err) {
        console.error('Error reading style.css:', err);
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.end(data);
    });
  }
  
  // 404 for everything else
  res.writeHead(404);
  res.end('File not found');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
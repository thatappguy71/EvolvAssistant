const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Test server is working\n');
});

const port = 5000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Test server running on port ${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Keep process alive
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
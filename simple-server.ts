import express from 'express';
import { createServer } from 'http';

const app = express();
const port = 5000;

app.get('/api/test', (req, res) => {
  res.json({ message: 'Simple server working!', timestamp: new Date().toISOString() });
});

const httpServer = createServer(app);

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Simple server is running on http://0.0.0.0:${port}`);
});

httpServer.on('error', (error: any) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
  }
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');
  httpServer.close(() => {
    process.exit(0);
  });
});

// Prevent the process from exiting
setInterval(() => {}, 1000 * 60 * 60);
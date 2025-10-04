// Simple test script for socket server
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.get('/test', (req, res) => {
  res.json({ message: 'Socket server test', timestamp: new Date() });
});

const PORT = 3001;

const shutdown = () => {
  console.log('\nShutting down test server...');
  server.close(() => {
    console.log('Test server closed');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);

server.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Press Ctrl+C to stop');
});
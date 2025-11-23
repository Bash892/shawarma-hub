const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Shawarma Hub backend running on port ${PORT}`);
});

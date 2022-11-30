//Load HTTP Module
const http = require("http");
const hostname = "127.0.0.1";
const port = 3000;

// Create HTTP server and listen on port 3000 for requests

const server = http.createServer((req,res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type","text/html");
  res.end("<h1>Hello World</h1>");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
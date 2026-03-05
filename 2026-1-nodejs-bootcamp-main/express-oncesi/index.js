const http = require("node:http");
const fs = require("node:fs");

const loginUser = "Emin";


const server = http.createServer((request, response) => {

    if (request.url === "/") {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end("<h1>Ana Sayfa</h1>");
    } else if (request.url === "/products") {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end("<h1>Ürünler</h1>");
    } else if (request.url === "/contact") {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end("<h1>İletişim</h1>");
    } else if (request.url === "/about") {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end("<h1>Hakkımızda</h1>");
    } else {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end("<h1>404 Not Found</h1>");
    }
})

server.listen(3000, () => {
    console.log("Server started on port 3000");
})
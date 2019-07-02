const { execSync } = require("child_process");
const https = require("https")
const http = require("http")
const fs = require("fs")
const useTls = false;


function getToken() {
    try {
        const token = execSync("az account get-access-token", {
            encoding: "utf-8"
        })
        return token;
    }
    catch (err) {
        if (err.status === 1) {
            execSync("az login");
            getToken();
        }
        else {
            throw err;
        }
    }
}

let key = fs.readFileSync('local.key')
let cert = fs.readFileSync('local.crt')

let app = function (request, response) {
    try {
        const token = getToken();
        response.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        });
        response.end(token);
    }
    catch (err) {
        response.writeHead(500, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"
        });
        response.write(err.toString());
        response.write("\r\n");
        response.write(JSON.stringify(err));
        response.end();
    }
}

if(useTls){
    https.createServer({
        key: key,
        cert: cert
    }, app).listen(3001);
}else{
    http.createServer(app).listen(3001);
}

process.on("SIGINT", function () {
    console.log("Stopping Token Server");
    server.close();
    process.exit();
});

console.log("Token Server running at 127.0.0.1:3001/");

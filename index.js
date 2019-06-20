const express = require('express')
const https = require('https')
const fs = require('fs')
const app = express()
const { execSync } = require("child_process");
const port = 8080
const useTls = false;

app.get('/', (req, res) => res.send('empower every person and every organization on the planet to achieve more'))
app.use(express.static('dist'))

function getToken() {
    try {
        const token = execSync("az account get-access-token", {
            encoding: "utf-8"
        })
        return token;
    }
    catch (err) {
        return "";
    }
}

const token = getToken();

app.get('/token', (request, response) => {
    try {
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
})


if(useTls){
    https.createServer({
        key: fs.readFileSync('local.key'),
        cert: fs.readFileSync('local.crt')
    }, app).listen(port, () => console.log(`Example app listening on port ${port}!`))
}else{
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}



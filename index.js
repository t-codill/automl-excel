var express = require('express');
var bodyParser = require('body-parser');
const fetch = require("node-fetch");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { apiPortWhenDeveloping, useTls } = require("./config")
const { execSync } = require("child_process");



function getCliToken() {
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

var app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get("/api/cli_token", async (req, res, next) => {
    console.log(`Received request from ${req.connection.remoteAddress}`);
    res.status(200);
    res.send(getCliToken());
    res.end();
});

app.post('/api/token', async (req, res, next) => {
    let clientId = req.body.clientId;
    let code = req.body.code;
    let url = "https://login.microsoftonline.com/common/oauth2/token"
    let body = "grant_type=authorization_code" +
    "&client_id=" + clientId +
    "&code=" + code +
    "&redirect_uri=https%3A%2F%2Flocalhost%3A3000/taskpane/logindialog" +
    "&resource=https%3A%2F%2Fmanagement.core.windows.net%2F" +
    "&client_secret=p%2BpWrAN%3Ftt%2BmPgGXF2_Z6sOxcVYNep48";
    console.log(req);

    try{
        let response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        });
        let json = await response.json();
        res.end(JSON.stringify(json))
    }
    catch(error){
        console.log("Error:");
        console.log(error);
    }
    finally{
        next();
    }
});

app.post('/api/swagger', async (req, res, next) => {
    console.log(req.body);
    let { url } = req.body;
    let response = await fetch(url);
    let jsonObj = await response.json();
    res.status(200);
    res.end(JSON.stringify(jsonObj));
    
})

app.post('/api/tunnel', async (req, res, next) => {
    console.log(req.body);
    let { url, options } = req.body;
    let response = await fetch(url, options);
    let jsonObj = await response.json();
    console.log(jsonObj);
    res.status(200);
    res.end(JSON.stringify(jsonObj));

})

app.use(express.static('./dist'))
app.get('/taskpane/*', (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, "dist/taskpane/index.html"));
})

if(useTls){
    https.createServer({
        key: fs.readFileSync('local.key'),
        cert: fs.readFileSync('local.crt')
    }, app).listen(apiPortWhenDeveloping, () => console.log('Listening (https) on '.concat(apiPortWhenDeveloping)))
}else{
    http.createServer(app).listen(apiPortWhenDeveloping, () => console.log('Listening (http) on '.concat(apiPortWhenDeveloping)))
}


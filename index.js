const express = require('express')
const https = require('https')
const fs = require('fs')
const app = express()
const port = 8080

app.get('/', (req, res) => res.send('empower every person and every organization on the planet to achieve more'))
app.use(express.static('dist'))

/*https.createServer({
    key: fs.readFileSync('local.key'),
    cert: fs.readFileSync('local.crt')
})*/
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

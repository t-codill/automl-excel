const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => res.send('empower every person and every organization on the planet to achieve more'))
app.use(express.static('dist'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

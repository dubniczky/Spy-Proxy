const express = require('express')

const app = express()

app.get('*', (req, res) =>
{
    let out = req.url + '\n\n'

    out += JSON.stringify(req.headers, false, 3)

    res.end( out )
})

app.listen(80, () =>
{
    console.log('Listening on: 80')
})
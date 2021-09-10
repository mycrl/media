"use strict"

require('./ready')
    .ready()

const express = require('express')
const { poll } = require('./metadata')
const config = require('./config')
const fetch = require('./fetch')

const app = express()

app.get('/:book', (req, res) => {
    res.send(metadata[req.params.book])
})

app.listen(80)

async function handler() {
    await fetch()
    await poll()
}
//
//setInterval(handler, 60000 * 60 * 2)
handler() 
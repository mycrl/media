"use strict"

const express = require('express')
const { metadata, poll } = require('./metadata')
const config = require('./config')
const fetch = require('./fetch')

const app = express()

app.get('/:book', (req, res) => {
    res.send(metadata[req.params.book])
})

app.listen(80)

setInterval(async () => {
    await poll()
    
}, 60000 * 60 * 2)
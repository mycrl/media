'use strict'

const { join } = require('path')

/**
 * http proxy.
 * 
 * @readonly
 */
const proxy = {
    protocol: 'http',
    host: '192.168.3.2',
    port: 7890,
}

/**
 * ikan books.
 * 
 * @readonly
 */
const books = [
    479,
    506,
    478,
    520,
    412,
    492,
    87
]

/**
 * config.
 * 
 * @readonly
 */
module.exports = {
    port: 8090,
    host: 'https://www.ikanmh.top',
    output: join(__dirname, './output'),
    page: join(__dirname, './page/dist'),
    books,
    proxy 
}
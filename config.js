'use strict'

const { join } = require('path')

/**
 * http proxy.
 * 
 * @readonly
 */
const proxy = {
    protocol: 'http',
    host: '127.0.0.1',
    port: 7890,
}

/**
 * ikan books.
 * 
 * @readonly
 */
const ikan = [
    479,
    506,
    478,
    520,
    412,
    492,
    87,
    527
]

/**
 * jmwu books.
 * 
 * @readonly
 */
const jmwu = [
    695
]

/**
 * config.
 * 
 * @readonly
 */
module.exports = {
    port: 8090,
    loop: 60000 * 60 * 6,
    output: join(__dirname, './output'),
    page: join(__dirname, './page/dist'),
    jmwu,
    ikan,
    proxy
}

'use strict'

const ref_cell = require('ref_cell')
const { Writable } = require('stream')
const { connect, constants } = require('http2')
const config = require('./config')

/** 
 * @module http
 */

/**
 * Http2Session
 * 
 * @readonly
 */
const session = ref_cell('session', () => {
    return connect(config.host)
})

/**
 * join strean in finish.
 * 
 * @param {Readable} readable - readable stream.
 * @param {Writable} writable - writable stream.
 * @returns {Promise<void>}
 * @private
 */
function join_stream(readable, writable) {
    return new Promise((resolve, reject) => {
        readable.pipe(writable)
            .on('finish', resolve)
            .on('error', reject)
    })
}

/**
 * create request.
 * 
 * @param {string} router - router path.
 * @returns {Promise<Http2ServerResponse>}
 * @private
 */
function create_req(router) {
    return new Promise((resolve, reject) => {
        const req = session.request({
            [constants.HTTP2_HEADER_PATH]: router,
            'user-agent': config['user-agent'],
            ':path': router,
        })
        
        req.on('error', reject)
        req.on('response', () => {
            resolve(req)
        })
    })
}

/**
 * read readable stream to buffer.
 * 
 * @param {Readable} readable - readable stream.
 * @returns {Promise<Buffer>}
 * @private
 */
function read_to_buffer(readable, buf = Buffer.alloc(0)) {
    return new Promise((resolve, reject) => {
        readable.on('data', chunk => {
            buf = Buffer.concat([buf, chunk])
        })

        readable.on('end', () => {
            resolve(buf)
        })
    })
}

/**
 * get request.
 * 
 * @param {string} router - router path.
 * @param {Writable?} writable - writable stream.
 * @returns {Promise<void | Buffer>}
 * @public
 */
exports.get = async function(router, writable) {
    const res = await create_req(router)
    return writable instanceof Writable ?
        await join_stream(res, writable) :
        await read_to_buffer(res)
}
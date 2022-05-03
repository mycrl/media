'use strict'

const axios = require('axios')
const { Writable } = require('stream')
const { connect, constants } = require('http2')
const config = require('./config')

/** 
 * @module http
 */

/**
 * Http2 user agent
 * 
 * @readonly
 */
const UserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) ' +
      'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 ' +
      'Mobile/15E148 Safari/604.1'

/**
 * pipe strean in finish.
 * 
 * @param {Readable} r - readable stream.
 * @param {Writable} w - writable stream.
 * @returns {Promise<void>}
 * @private
 */
const pipe = (r, w) => new Promise((s, f) => {
    r.pipe(w).on('finish', s).on('error', f)
})

/**
 * read readable stream to buffer.
 * 
 * @param {Readable} readable - readable stream.
 * @returns {Promise<Buffer>}
 * @private
 */
const readed = (r, b = Buffer.alloc(0)) => new Promise((s, f) => {
    r.on('data', c => b = Buffer.concat([b, c]))
    r.on('end', () => s(b))
    r.on('error', f)
})

/**
 * http2
 * 
 * @class
 */
exports.Http2 = class Http2 {
    
    /**
     * @param {string} host
     * @constructor
     */
    constructor(host) {
        this._session = connect(host)
        this._host = host
        this._catch()
    }
    
    /**
     * catch session error.
     * 
     * @returns {Promise<void>}
     * @private
     */
    _catch() {
        this._session.on('error', (e) => {
            console.error(e)
            this.reconnect()
        })
    }
    
    /**
     * create request.
     * 
     * @param {string} router - router path.
     * @returns {Promise<Http2ServerRequest>}
     * @private
     */
    _request(router) {
        return this._session.request({
            [constants.HTTP2_HEADER_PATH]: router,
            'user-agent': UserAgent,
            ':path': router,
        })
    }
    
    /**
     * create request.
     * 
     * @param {string} router - router path.
     * @returns {Promise<Http2ServerResponse>}
     * @private
     */
    _from(router) {
        return new Promise((resolve, reject) => {
            const req = this._request(router)
            req.on('response', () => resolve(req))
            req.on('timeout', reject)
            req.on('error', reject)
        })
    }
    
    /**
     * get request.
     * 
     * @param {Readable} readable - readable stream.
     * @param {Writable?} writable - writable stream.
     * @returns {Promise<void | Buffer>}
     * @public
     */
    async _res(res, writable) {
        return writable instanceof Writable ?
            await pipe(res, writable) :
            await readed(res)
    }
    
    /**
     * get request.
     * 
     * @param {string} router - router path.
     * @param {Writable?} writable - writable stream.
     * @returns {Promise<void | Buffer>}
     * @public
     */
     async get(router, writable) {
        return await this._res(await Promise.retey(3, 
            () => this._from(router),
            () => this.reconnect()
        ), writable)
    }
    
    /**
     * reconnect remote server.
     * 
     * @returns {Promise<void>}
     * @public
     */
    async reconnect() {
        await this.close()
        await Date.sleep(10000)
        this._session = connect(this._host)
        this._catch()
    }
        
    /**
     * close http2 session.
     * 
     * @returns {Promise<void>}
     * @public
     */
    close() {
        return new Promise(resolve => {
            this._session.close(resolve)
        })
    }
}

/**
 * Http
 * 
 * @class
 */
exports.Http = class Http {
      
    /**
     * get request.
     * 
     * @param {Readable} readable - readable stream.
     * @param {Writable?} writable - writable stream.
     * @returns {Promise<void | Buffer>}
     * @public
     */
    async _res(res, writable) {
        return writable instanceof Writable ?
            await pipe(res, writable) :
            await readed(res)
    }
    
    /**
     * create request.
     * 
     * @param {string} url
     * @returns {Promise<Http2ServerResponse>}
     * @private
     */
    _from(url) {
        return axios.get(url, { 
            headers: { 'user-agent': UserAgent },
            responseType: 'stream',
            proxy: config.proxy
        }).then(({ data }) => data)
    }
    
    /**
     * get request.
     * 
     * @param {string} url
     * @param {Writable?} writable - writable stream.
     * @returns {Promise<void | Buffer>}
     * @public
     */
    async get(url, writable) {
        const res = await Promise.retey(3, () => this._from(url))
        return await this._res(res, writable)
    }
}

"use strict"

const express = require('express')

/** 
 * @module app
 */

/**
 * hooks router error.
 * 
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 * @private
 */
function hooks(err, _req, res, _next) {
    res.status(500).end(err.message)
    console.error(err.stack)
}

/**
 * Application
 * @class
 */
exports.Application = class Application {
    constructor() {
        this.inner = express()
        this.inner.use(express.json())
        this.inner.use(express.urlencoded({ extended: true }))
    }

    /**
    * set middleware.
    *
    * @param {any | Constructor} router - middleware
    * @returns {Application}
    * @public
    */
    use(router, app) {
        app ?
            this.inner.use(router, app) :
            this.inner.use(router)
        return this
    }
    
    /**
    * set static dir.
    *
    * @param {any | Constructor} router - middleware
    * @returns {Application}
    * @public
    */
    static(router, path) {
        path ?
            this.inner.use(router, express.static(path)) :
            this.inner.use(express.static(router))
        return this
    }

    /**
    * listen port.
    *
    * @param {number} port - port number
    * @returns {Application}
    * @public
    */
    listen(port) {
        this.inner.use(hooks)
        this.inner.listen(port)
        return this
    }
    
    /**
     * application launch!
     * 
     * @returns {Express.Application}
     * @public
     */
    launch() {
        return this.inner
    }
}
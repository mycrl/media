'use strict'

const { dorp_panic } = require('./util')
const metadata = require('./metadata')
const fetch = require('./fetch')

/** 
 * @module poll
 */

/**
 * work handler.
 * 
 * @returns {Promise<void>}
 * @private
 */
async function handler() {
    await fetch.poll()
    await metadata.poll()
}

/**
 * main poll.
 * 
 * @returns {Promise<void>}
 * @private
 */
async function poll() {
    await dorp_panic(handler())
}

/**
 * start main interval.
 * 
 * @returns {void}
 * @public
 */
exports.start = function () {
    setInterval(poll, 60000 * 60 * 24)
    poll()
}
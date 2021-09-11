'use strict'

const { dorp_panic } = require('./util')
const metadata = require('./metadata')
const fetch = require('./fetch')

/** 
 * @module poll
 */

/**
 * main poll.
 * 
 * @returns {Promise<void>}
 * @private
 */
async function poll() {
    await fetch.poll()
    await metadata.poll()
}

/**
 * start main interval.
 * 
 * @returns {void}
 * @public
 */
exports.start = () => setInterval(async () => {
    await dorp_panic(poll)
}, 60000 * 60 * 24)
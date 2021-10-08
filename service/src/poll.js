'use strict'

const { ikan } = require('./fetch')

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
    await Promise.ignore(ikan.poll())
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
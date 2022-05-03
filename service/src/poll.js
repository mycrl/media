'use strict'

/**
 * global init,
 * initialization file and environment.
 */
require('./ready')
    .ready()

const ikan = require('./adapter/ikan')
const config = require('./common/config')

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
    process.exit(0)
}

/**
 * start main interval.
 * 
 * @returns {void}
 * @public
 */
poll()

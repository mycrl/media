'use strict'

const fs = require('fs/promises')

/** 
 * @module factory/base
 */

/**
 * init directory.
 * 
 * @param {string} directory - directory name.
 * @returns {Promise<void>}
 * @private
 */
exports.mkdir = async (d) => {
    await fs.access(d).catch(() => fs.mkdir(d))
}
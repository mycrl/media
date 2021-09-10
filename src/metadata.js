'use strict'

const ref_cell = require('ref_cell')
const { writeFile } = require('fs/promises')
const { path_relove } = require('./util')
const config = require('./config')

/** 
 * @module metadata
 */

/**
 * get metadata file path.
 * 
 * @returns {string}
 * @private
 */
function get_filename() {
    return path_relove(config.output, '.metadata.json')
}

/**
 * metadata.
 * 
 * @readonly
 */
exports.metadata = metadata = ref_cell('metadata', () => {
    return require(get_filename())
})

/**
 * poll handler.
 * 
 * @returns {Promise<void>}
 * @public
 */
exports.poll = async function() {
    const body = JSON.stringify(metadata, null, 4)
    await writeFile(get_filename(), body)
}
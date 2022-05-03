'use strict'

const ref_cell = require('ref_cell')

/** 
 * @module config
 */

/**
 * @typedef {Object} Config
 * @property {number} port - listen port.
 * @property {string} host - ikan hostname.
 * @property {object} books - book router list.
 * @property {string} output - file output directory.
 * @property {string} page - web page directory.
 * @readonly
 */
module.exports = ref_cell('config', () => {
    return require('../../config.js')
})

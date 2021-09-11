'use strict'

const toml = require('toml')
const ref_cell = require('ref_cell')
const { readFileSync } = require('fs')
const { path_relove } = require('./util')

/** 
 * @module config
 */

/**
 * @typedef {Object} Config
 * @property {number} port - listen port.
 * @property {string} host - ikan hostname.
 * @property {string} user-agent - request user agent.
 * @property {object} books - book router list.
 * @property {string} output - file output directory.
 * @property {string} page - web page directory.
 * @readonly
 */
module.exports = ref_cell('config', () => {
    return toml.parse(readFileSync(path_relove('config.toml')))
})
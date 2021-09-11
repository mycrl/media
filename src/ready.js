'use strict'

const { mkdirSync, accessSync, writeFileSync } = require('fs')
const { path_relove } = require('./util')
const config = require('./config')

/** 
 * @module ready
 */

/**
 * @readonly
 */
const OUTPUT = path_relove(config.output)
const METADATA = path_relove(config.output, '.metadata.json')

/**
 * global Array last function.
 * 
 * @returns {any}
 * @global
 */
Array.prototype.last = function() { 
    return this[this.length - 1] 
}

/*
 * gloabl state ready.
 * 
 * @returns {void}
 * @public
 */
exports.ready = function() {
    try { accessSync(OUTPUT) } catch { mkdirSync(OUTPUT) }
    try { accessSync(METADATA) } catch { writeFileSync(METADATA, '{}') }
}
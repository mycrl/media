'use strict'

const { mkdirSync, accessSync, writeFileSync } = require('fs')
const { path_relove } = require('./util')
const config = require('./config')

/** 
 * @module ready
 */

/*
 * 
 */
exports.ready = function() {
    const output = path_relove(config.output)
    const metadata = path_relove(config.output, '.metadata.json')
    
    try { accessSync(output) } catch {
        mkdirSync(output)
    }
    
    try { accessSync(metadata) } catch {
        writeFileSync(metadata, '{}')
    }
}
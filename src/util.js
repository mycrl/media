'use strict'

const { join } = require('path')

/** 
 * @module util
 */

/**
 * path symbol filter.
 * 
 * @param {string} path
 * @returns {string}
 * @public
 */
exports.path_filter = function(path) {
    return path
        .replace(/\\/g, '')
        .replace(/\//g, '')
        .replace(/\:/g, '')
        .replace(/\*/g, '')
        .replace(/\?/g, '')
        .replace(/"/g,  '')
        .replace(/\</g, '')
        .replace(/\>/g, '')
        .replace(/\|/g, '')
}

/**
 * iter to array.
 * 
 * @param {Iter} iter
 * @returns {array}
 * @public
 */
exports.iter_to_array = function(iter, arrar = []) {
    for (let i = 0; i < iter.length; i ++)
        arrar.push(iter[i])
    return arrar
}

/**
 * resolve path.
 * 
 * @param {string} path
 * @returns {string}
 * @public
 */
exports.path_relove = function(...args) {
    return join(__dirname, '../', ...args)
}

/**
 * swallow error.
 * 
 * @param {Promise<any>} promise
 * @returns {Promise<any>}
 * @public
 */
exports.dorp_panic = async function(promise) {
    try { return await promise } catch(e) { 
        console.error(e) 
    }
}

/**
 * sleep.
 * 
 * @param {number} daley
 * @returns {Promise<void>}
 * @public
 */
exports.sleep = function(delay) {
    return Promise(resolve => {
        setTimeout(resolve, delay)
    })
}
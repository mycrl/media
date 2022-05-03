'use strict'

const fs = require('fs')
const { join } = require('path')
const config = require('./common/config')

/** 
 * @module ready
 */

/**
 * alias
 * 
 * @readonly
 */
const mkdir = fs.mkdirSync
const access = fs.accessSync

/**
 * global Array last function.
 * 
 * @returns {any}
 * @global
 */
Array.prototype.last = function() { 
    return this[this.length - 1] 
}

/**
 * global Array first function.
 * 
 * @returns {any}
 * @global
 */
Array.prototype.first = function() {
    return this[0]
}

/**
 * string localization process.
 * 
 * @returns {string}
 * @global
 */
String.prototype.localization = function() {
    return this.replace(/\\|\/|\:|\*|\?|"|\<|\>|\||\.|。|，|\s/g, '')
}

/**
 * iter to array.
 * 
 * @param {Iter} iter
 * @returns {array}
 * @public
 */
Array.extends = function(iter, arrar = []) {
    for (let i = 0; i < iter.length; i ++)
        arrar.push(iter[i])
    return arrar
}

/**
 * swallow error.
 * 
 * @param {Promise<any>} promise
 * @returns {Promise<any>}
 * @public
 */
Promise.ignore = async function(promise) {
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
Date.sleep = function(delay) {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    })
}

/**
 * retry handler.
 * 
 * @param {number} count - retry count.
 * @param {function} handler
 * @param {fcuntion?} catch_handler - catch handler.
 * @returns {Promise<any>}
 * @public
 */
Promise.retey = async function (
    count, 
    handler, 
    catch_handler, 
    err = null
) {
    for (let i = 0; i < count; i++) {
        try { return await handler() } catch (e) {
            catch_handler && await catch_handler()
            err = e
        }
    }
    
    throw err
}

/*
 * gloabl state ready.
 * 
 * @returns {void}
 * @public
 */
exports.ready = function() {
    process.title = 'media'
    const { output } = config
    const twosixy = join(output, '_twosixy')
    try { access(output) } catch { mkdir(output) }
    try { access(twosixy) } catch { mkdir(twosixy) }
}
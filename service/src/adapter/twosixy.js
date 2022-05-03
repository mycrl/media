'use strict'

const { join } = require('path')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const ref_cell = require('ref_cell')
const { createWriteStream } = require('fs')
const storage = require('../common/storage')
const { Http } = require('../common/http')
const config = require('../common/config')
const { mkdir } = require('./common/util')

/** 
 * @module factory/twosixy
 */

/**
 * t66y
 * 
 * @class
 */
module.exports = ref_cell('twosixy', () => new class Twosixy {
    
    /**
     * @constructor
     */
    constructor() {
        this._http = new Http()
        this._output = join(config.output, '_twosixy')
    }
    
    /**
     * get image list.
     * 
     * @param {string} directory - output directory.
     * @param {Document} document
     * @returns {Promise<number>}
     * @private
     */
    async get_images(document, directory) {
        const nodes = document('.tpc_cont img')
        
        /**
         * get image list
         * and create download task.
         */
        const tasks = Array.extends(nodes)
            .map((node, index) => {
                const href = document(node)
                    .attr('ess-data')
                    .replace('vxotu.com', 'vxotu.top')
                const writable = createWriteStream(join(directory, `${index}.jpg`))
                return this._http.get(href, writable)
            })
        
        
        /**
         * run all tasks,
         * and returns task count.
         */
        await Promise.ignore(Promise.all(tasks))
        return tasks.length
    }
    
    /**
     * download web page all image.
     * 
     * @param {string} url.
     * @returns {Promise<void>}
     * @public
     */
    async download(url) {
        const document = cheerio.load(
            await this._http.get(url)
        )
        
        /**
         * get photo name,
         * and mkdir photo dir.
         */
        const name = document('.f18')
            .text()
            .localization()
        const directory = join(this._output, name)
        await mkdir(directory)
        
        // handle all image.
        const size = await this.get_images(
            document,
            directory
        )
        
        // save photo info in storage.
        await storage.add_photo({
            create_by: new Date(),
            name,
            size,
        })
    }
})

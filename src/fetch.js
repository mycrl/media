'use strict'

const { mkdir, readdir } = require('fs/promises')
const { createWriteStream, access } = require('fs')
const { metadata } = require('./metadata')
const config = require('./config')
const { get } = require('./http')
const { join } = require('path')
const cheerio = require('cheerio')
const { URL } = require('url')
const { 
    sleep,
    dorp_panic,
    path_relove, 
    iter_to_array, 
    path_filter
} = require('./util')

/** 
 * @module fetch
 */

/**
 * init directory.
 * 
 * @param {string} directory - directory name.
 * @returns {Promise<void>}
 * @private
 */
function access_dir(directory) {
    return new Promise((resolve, reject) => {
        access(directory, err => {
            err ? mkdir(directory)
                .then(resolve)
                .catch(reject) : 
            resolve()
        })
    })
}

/**
 * @typedef {Object} Chapter
 * @property {string} title - chapter name.
 * @property {string} href - chapter herf.
 * @property {number} index - chapter index.
 * @property {string} directory - output directory.
 */

/**
 * get chapter list.
 * 
 * @param {string} directory - output directory.
 * @param {Document} document
 * @returns {Promise<Chapter[]>}
 * @private
 */
async function get_chapters(directory, document) {
    const nodes = document('#detail-list-select li a')
    const dirs = await readdir(directory)
    
    const chapters = iter_to_array(nodes)
        .map((node, index) => {
            const title = path_filter(document(node).text())
            return {
                directory: join(directory, title),
                href: document(node).attr('href'),
                index,
                title
            }
        })
        .filter(({ title }) => {
            return !dirs.includes(title)
        })

    for (const chapter of chapters)
        await mkdir(chapter.directory)
    return chapters
}

/**
 * chapter handler.
 * 
 * @param {Chapter} chapter
 * @returns {Promise<number>}
 * @private
 */
async function chapter_handler({ href, directory }) {
    const chapter_page = cheerio.load(await get(href))
    const nodes = chapter_page('#cp_img img')
    const tasks = iter_to_array(nodes)
        .map((node, index) => {
            const href = chapter_page(node).attr('data-original')
            const writable = createWriteStream(join(directory, `${index}.jpg`))
            return get(new URL(href).pathname, writable)
        })
    
    await dorp_panic(Promise.all(tasks))
    return tasks.length
}

/**
 * handler book.
 * 
 * @param {string} symbol - book symbol.
 * @param {string} router - book router.
 * @returns {Promise<void>}
 * @public
 */
module.exports = async function(symbol, router) {
    const directory = path_relove(config.output, symbol)
    await access_dir(directory)
    
    const book_page = cheerio.load(await get(router))
    const chapters = await get_chapters(
        directory, 
        book_page
    )
    
    for (const chapter of chapters) {
        if (!metadata[symbol]) {
            metadata[symbol] = []
        }
        
        await sleep(10000)
        metadata[symbol][chapter.index] = {
             size: await dorp_panic(chapter_handler(chapter)),
             name: chapter.title
         }
    }
}
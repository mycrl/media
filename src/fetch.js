'use strict'

const cheerio = require('cheerio')
const { mkdir, readdir } = require('fs/promises')
const { createWriteStream, access } = require('fs')
const { metadata } = require('./metadata')
const config = require('./config')
const { get } = require('./http')
const { join } = require('path')
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
 * get cover.
 * 
 * @param {string} directory - output directory.
 * @param {Document} document
 * @returns {Promise<void>}
 * @private
 */
async function get_cover(directory, document) {
    const filename = join(directory, 'cover.jpg')
    const nodes = document('.detail-main-cover img')
    const cover = document(nodes[0]).attr('data-original')
    
    /**
     * determine whether the file already exists,
     * download the cover image if it does not exist.
     */
    try {
        await access(filename) 
    } catch (_) {
        await get(
            new URL(cover).pathname, 
            createWriteStream(filename)
        )
    }
}

/**
 * get chapter list.
 * 
 * @param {string} symbol - book symbol.
 * @param {string} directory - output directory.
 * @param {Document} document
 * @returns {Promise<Chapter[]>}
 * @private
 */
async function get_chapters(symbol, directory, document) {
    const nodes = document('#detail-list-select li a')
    const dirs = await readdir(directory)
    
    /**
     * get book cover href
     * download and save to directory.
     */
    await get_cover(
        directory, 
        document
    )
    
    // get chapter list.
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
    
    // filter download done chapter.
    const tasks = chapters.filter(({ title }) => {
        return !dirs.includes(title)
    })

    /**
     * create chapter directory
     * and return chapter list.
     */
    for (const chapter of tasks)
        await dorp_panic(mkdir(chapter.directory))
    
    // save book info to metadata.
    for (const { title, index } of chapters) {
        const files = await readdir(join(directory, title))
        if (!metadata[symbol]) 
            metadata[symbol] = []
        metadata[symbol][index] = {
             size: files.length,
             title
        }
    }
    
    return tasks
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
    
    /**
     * get image list
     * and create download task.
     */
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
 * @private
 */
async function book_handler(symbol, router) {
    const directory = path_relove(config.output, symbol)
    await access_dir(directory)
    
    // get chapter list.
    const chapters = await get_chapters(
        symbol,
        directory, 
        cheerio.load(await get(router))
    )
    
    /**
     * loop of all chapter
     * and save chapter info to metadata  object.
     */
    for (const chapter of chapters) {
        metadata[symbol][chapter.index].size = 
            await dorp_panic(chapter_handler(chapter))
        await sleep(10000)
    }
}

/**
 * master handler.
 * 
 * @returns {Promise<void>}
 * @public
 */
exports.poll = async function() {
    for (const key in config.books) {
        await book_handler(key, config.books[key].path)
    }
}
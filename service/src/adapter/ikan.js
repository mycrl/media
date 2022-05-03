'use strict'

const { URL } = require('url')
const { join } = require('path')
const fs = require('fs/promises')
const cheerio = require('cheerio')
const ref_cell = require('ref_cell')
const { createWriteStream } = require('fs')
const { Http2 } = require('../common/http')
const storage = require('../common/storage')
const config = require('../common/config')
const { mkdir } = require('../common/util')

/** 
 * @module factory/ikan
 */

/**
 * ikan fetch
 * 
 * @class
 */
module.exports = ref_cell('ikan', () => new class Ikan {
    
    /**
     * @constructor
     */
    constructor() {
        this._http = new Http2('https://www.ikanmh.top')
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
    async get_cover(directory, document) {
        const filename = join(directory, 'cover.jpg')
        const nodes = document('.detail-main-cover img')
        const cover = document(nodes[0]).attr('data-original')

        /**
         * determine whether the file already exists,
         * download the cover image if it does not exist.
         */
        try {
            await fs.access(filename) 
        } catch (_) {
            await this._http.get(
                new URL(cover).pathname, 
                createWriteStream(filename)
            )
        }
    }

    /**
     * get chapter list.
     * 
     * @param {string} book - book uid.
     * @param {string} directory - output directory.
     * @param {Document} document
     * @returns {Promise<Chapter[]>}
     * @private
     */
    async get_chapters(book, directory, document) {
        const nodes = document('#detail-list-select li a')
        const dirs = await fs.readdir(directory)

        // get chapter list.
        const chapters = Array.extends(nodes)
            .map((node, index) => {
                const title = document(node)
                    .text()
                    .localization()
                return {
                    directory: join(directory, title),
                    href: document(node).attr('href'),
                    index,
                    title
                }
            })

        // filter chapters that have been downloaded.
        let tasks = []
        for (const chapter of chapters) {
            const { title } = chapter
            if ((await storage.get_chapter(book, title)) == null) {
                tasks.push(chapter)
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
    async h_chapter({ href, directory }) {
        const chapter_page = cheerio.load(await this._http.get(href))
        const nodes = chapter_page('#cp_img img')

        /**
         * create chapter directory
         * and return chapter list.
         */
        await Promise.ignore(
            mkdir(directory)
        )

        /**
         * get image list
         * and create download task.
         */
        const tasks = Array.extends(nodes)
            .map((node, index) => {
                const href = chapter_page(node).attr('data-original')
                const writable = createWriteStream(join(directory, `${index}.jpg`))
                return this._http.get(new URL(href).pathname, writable)
            })

        /**
         * run all tasks,
         * and returns task count.
         */
        await Promise.ignore(Promise.all(tasks))
        await Date.sleep(10000)
        return tasks.length
    }

    /**
     * handler book.
     * 
     * @param {number} id - book id.
     * @returns {Promise<void>}
     * @private
     */
    async h_book(id) {
        const document = cheerio.load(await this._http.get('/book/' + id))

        // get book info.
        const { uid } = await storage.add_book({
            name: document('.detail-main-info-title').text(),
            summary: document('.detail-desc').text(),
            id,
        })

        // initialization directory.
        const directory = join(config.output, uid)
        await mkdir(directory)

        /**
         * get book cover href
         * download and save to directory.
         */
        await this.get_cover(
            directory, 
            document
        )

        // get chapter list.
        const chapters = await this.get_chapters(
            uid,
            directory, 
            document
        )

        /**
         * loop of all chapter
         * and save chapter info to metadata  object.
         */
        for (const chapter of chapters) {
            await storage.add_chapter({
                book: uid,
                name: chapter.title,
                create_by: new Date(),
                size: await Promise.ignore(
                    this.h_chapter(chapter)
                )
            })
        }
    }

    /**
     * master handler.
     * 
     * @returns {Promise<void>}
     * @public
     */
     async poll() {
        for (const symbol of config.ikan)
            await this.h_book(symbol)
        await this._http.close()
    }
})
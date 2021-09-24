'use strict'

// set process title.
process.title = 'ikan_reptile'

/**
 * global init,
 * initialization file and environment.
 */
require('./ready')
    .ready()

/**
 * start main poll.
 */
require('./poll')
    .start()

const { metadata } = require('./metadata')
const { path_relove } = require('./util')
const { Application } = require('./app')
const config = require('./config')
const path = require('path')

/**
 * create application,
 * and set assets and page directory.
 */
const app = new Application()
    .static(path_relove(config.page))
    .static('/assets', path_relove(config.output))
    .listen(config.port)
    .launch()

/**
 * get book info,
 * contains basic information.
 */
app.get('/api/book/:book', ({ params }) => { 
    return { 
        chapters: metadata[params.book], 
        ...config.books[params.book] 
    }
})

/**
 * get book list,
 * only basic information.
 */
app.get('/api/books', () => {
    return Object
        .entries(config.books)
        .map(([key, value]) => ({
            update: metadata[key].last(),
            ...value,
            key
        }))
})

/**
 * web page routing processing,
 * all routes point to index.html.
 */
app.get('/*', (_, res) => {
    const index = path.join(config.page, 'index.html')
    const resolve = path_relove(index)
    res.sendFile(resolve)
})
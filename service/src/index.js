'use strict'

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

const { Application } = require('./app')
const { twosixy } = require('./fetch')
const config = require('./config')
const storage = require('./storage')
const path = require('path')

function filter(_, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Methods', '*')
    next()
}

/**
 * create application,
 * and set assets and page directory.
 */
const app = new Application()
    .static(config.page)
    .static('/assets', config.output)
    .use('*', filter)
    .listen(config.port)
    .launch()

/**
 * get book info,
 * contains basic information.
 */
app.get('/api/book/:book', ({ params }) => { 
    return storage.get_chapters_from_book(params.book)
})

/**
 * get book list,
 * only basic information.
 */
app.get('/api/books', () => {
    return storage.get_books()
})

/**
 * get photo list,
 * need page info.
 */
app.get('/api/photos', ({ query }) => {
    const limit = Number(query.limit || '200')
    const skip = Number(query.skip || '0')
    return storage.get_photos(limit, skip)
})

/**
 * get photo,
 * download web page all image.
 */
app.post('/api/photos', ({ body }) => {
    twosixy.download(body.url)
    return true
})

/**
 * web page routing processing,
 * all routes point to index.html.
 */
app.get('/*', (_, res) => {
    res.sendFile(path.join(
        config.page, 
        'index.html'
    ))
})
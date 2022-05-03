'use strict'

const path = require('path')
const express = require('express')
const config = require('./common/config')
const twosixy = require('./adapter/twosixy')
const storage = require('./common/storage')
const router = express.Router()

exports.filter = (req, res, next) => {
    req.cookies.token != 'panda-mycrl-1198' ?
        res.status(404).end() :
        next()
}

/**
 * get book info,
 * contains basic information.
 */
router.get('/api/book/:book', ({ params }) => { 
    return storage.get_chapters_from_book(params.book)
})

/**
 * get book list,
 * only basic information.
 */
router.get('/api/books', () => {
    return storage.get_books()
})

/**
 * get photo list,
 * need page info.
 */
router.get('/api/photos', ({ query }) => {
    const limit = Number(query.limit || '200')
    const skip = Number(query.skip || '0')
    return storage.get_photos(limit, skip)
})

/**
 * get photo,
 * download web page all image.
 */
router.post('/api/photos', ({ body }) => {
    twosixy.download(body.url)
    return true
})

/**
 * web page routing processing,
 * all routes point to index.html.
 */
router.get('/*', (_, res) => {
    res.sendFile(path.join(
        config.page, 
        'index.html'
    ))
})

module.exports = router
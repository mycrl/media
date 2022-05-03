'use strict'

/**
 * global init,
 * initialization file and environment.
 */
require('./ready')
    .ready()

const { Application } = require('./common/app')
const config = require('./common/config')
const router = require('./router')

/**
 * create application,
 * and set assets and page directory.
 */
const app = new Application()
    .use(require('cookie-parser')())
    .use('*', router.filter)
    .static(config.page)
    .static('/assets', config.output)
    .use('*', router)
    .listen(config.port)
    .launch()

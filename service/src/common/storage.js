'use strict'

const { Sequelize, DataTypes } = require('sequelize')
const ref_cell = require('ref_cell')
const { join } = require('path')
const config = require('./config')

/** 
 * @module metadata
 */

/**
 * get books sql.
 * 
 * @readonly
 */
const GET_BOOKS_SQL = `SELECT 
    books.uid,
    books.name, 
    books.summary,
    chapter.name AS chapter_name,
    strftime('%s', chapter.create_by) * 1000 AS chapter_create_by,
    chapter.size AS chapter_size
FROM books 
LEFT OUTER JOIN (
    SELECT * FROM chapters
    GROUP BY book
    HAVING max(create_by)
) AS chapter 
    ON chapter.book = books.uid
`

/**
 * Sequelize sync status.
 * 
 * @readonly
 */
let readyState = ref_cell(
    'sequelize_ready', 
    () => false
)

/**
 * Sequelize
 * 
 * @readonly
 */
const sequelize = ref_cell('sequelize', () => new Sequelize({
    storage: join(config.output, 'metadata.sqlite'),
    logging: () => undefined,
    dialect: 'sqlite',
}))

/**
 * Model unique.
 * 
 * @readonly
 */
const Uid = { 
    type: DataTypes.UUID, 
    defaultValue: Sequelize.UUIDV4, 
    primaryKey: true,
    unique: true,
}

/**
 * Books model.
 * 
 * @readonly
 */
const Books = ref_cell('sequelize_books', () => sequelize.define('books', {
    uid: Uid,
    id: DataTypes.INTEGER,
    name: DataTypes.TEXT,
    summary: DataTypes.TEXT,
}, { timestamps: false }))

/**
 * Chapter model.
 * 
 * @readonly
 */
const Chapters = ref_cell('sequelize_chapters', () => sequelize.define('chapters', {
    uid: Uid,
    book: DataTypes.STRING,
    name: DataTypes.TEXT,
    create_by: DataTypes.DATE,
    size: DataTypes.INTEGER,
}, { timestamps: false }))

/**
 * Photos model.
 * 
 * @readonly
 */
const Photos = ref_cell('sequelize_photos', () => sequelize.define('photos', {
    uid: Uid,
    name: DataTypes.TEXT,
    create_by: DataTypes.DATE,
    size: DataTypes.INTEGER,
}, { timestamps: false }))

/**
 * sync database.
 * 
 * @returns {promise<void>}
 * @private
 */
async function ready() {
    if (readyState) return
    await sequelize.sync()
    readyState = true
}

/**
 * get books and last chapter.
 * 
 * @returns {promise<book[]>}
 * @public
 */
exports.get_books = async function() {
    await ready()
    const res = await sequelize.query(GET_BOOKS_SQL)
    return res.first()
}

/**
 * get chapters where book uid.
 * 
 * @param {string} uid
 * @returns {promise<chapter[]>}
 * @public
 */
exports.get_chapters_from_book = async function(uid) {
    await ready()
    const chapters = await Chapters.findAll({ where: { book: uid }})
    const book = await Books.findOne({ where: { uid }})
    return { chapters, book }
}

/**
 * get chapter in database.
 * 
 * @param {string} book
 * @param {string} name
 * @returns {promise<chapter>}
 * @public
 */
exports.get_chapter = async function(book, name) {
    await ready()
    return await Chapters.findOne({ where: { book, name }})
}

/**
 * get photos in database.
 * 
 * @param {number?} limit
 * @param {mumber?} offset
 * @returns {promise<photo>}
 * @public
 */
exports.get_photos = async function(limit = 50, offset = 0) {
    await ready()
    return await Photos.findAll({ limit, offset })
}

/**
 * add book in database.
 * 
 * @param {book} defaults
 * @returns {promise<book>}
 * @public
 */
exports.add_book = async function(defaults) {
    await ready()
    const { id } = defaults
    const res = await Books.findOrCreate({ where: { id }, defaults })
    return res.first()
}

/**
 * add chapter in database.
 * 
 * @param {chapter} defaults
 * @returns {promise<chapter>}
 * @public
 */
exports.add_chapter = async function(defaults) {
    await ready()
    const { book, name } = defaults
    const res = await Chapters.findOrCreate({ where: { book, name }, defaults })
    return res.first()
}

/**
 * add photo in database.
 * 
 * @param {photo} defaults
 * @returns {promise<photo>}
 * @public
 */
exports.add_photo = async function(defaults) {
    await ready()
    const { name } = defaults
    const res = await Photos.findOrCreate({ where: { name }, defaults })
    return res.first()
}

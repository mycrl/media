import { createRouter, createWebHistory } from 'vue-router'
import Chapter from './views/Chapter'
import Index from './views/Index'
import Photo from './views/Photo'
import Book from './views/Book'

export default createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        { path: '/', component: Index },
        { path: '/book/:key', component: Book },
        { path: '/chapter/:key/:index', component: Chapter },
        { path: '/photo/:key/:size', component: Photo }
    ]
})

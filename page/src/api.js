import Axios from "axios"

const Host = ''

const axios = Axios.create({
    validateStatus: (status) => status == 200,
    baseURL: Host,
    timeout: 60000,
})

export function getBooks() {
    return axios.get('/api/books')
        .then(({ data }) => data)
}

export function getPhotos() {
    return axios.get('/api/photos')
        .then(({ data }) => data)
}

export function getBookProfile(key) {
    return axios.get('/api/book/' + key)
        .then(({ data }) => data)
}

export function getCover(key) {
    return encodeURI(`${Host}/assets/${key}/cover.jpg`)
}

export function getPhoto(key, i) {
    return encodeURI(`${Host}/assets/_twosixy/${key}/${i}.jpg`)
}

export function getImage(key, name, i) {
    return encodeURI(`${Host}/assets/${key}/${name}/${i}.jpg`)
}

export function addPhoto(url) {
    return axios.post('/api/photos', { url })
        .then(({ data }) => data)
}
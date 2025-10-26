require('dotenv').config()
const NodeCache = require('node-cache')
const express = require('express')

const cardCache = new NodeCache({stdTTL: 3600})
const app = express()
app.use(express.json())
const port = process.env.port
const api_key = process.env.API_KEY

async function fetchAndCache(key, url) {
    const cached = cardCache.get(key)
    if(cached) {
        console.log(`Cache hit: ${key}, fetching from Cache`)
        return cached
    }
    console.log(`Cache miss: ${key}, fetching ${url}, set into Cache`)
    const res = await fetch(url)
    const data = await res.json()
    cardCache.set(key, data)
    return data
}

const API_LINK = 'https://api.tcgdex.net/v2/en'

app.get('/selectedSet', async (req, res) => {
    const choice = req.query.choice
    const cacheKey = `${choice}_set`

    const url = `${API_LINK}/sets/${choice}`
    const data = await fetchAndCache(cacheKey, url)
    res.json(data)
})

app.get('/sets', async (req, res) => {
    const cacheKey = `sets`
    const url = `${API_LINK}/sets`
    const data = await fetchAndCache(cacheKey, url)
    res.json(data)
})

app.get('/selectedSeries', async (req, res) => {
    const choice1 = req.query.choice1
    const cacheKey = `${choice1}_series`

    const url = `${API_LINK}/series/${choice1}`
    const data = await fetchAndCache(cacheKey, url)
    res.json(data)
})

app.get('/series', async (req, res) => {
    const cacheKey = `series`
    const url = `${API_LINK}/series`
    const data = await fetchAndCache(cacheKey, url)
    res.json(data)
})
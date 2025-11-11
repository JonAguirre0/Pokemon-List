require('dotenv').config()
const NodeCache = require('node-cache')
const express = require('express')
const connectDB = require('./public/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Users = require('./public/user')

const cardCache = new NodeCache({stdTTL: 3600})
const app = express()
app.use(express.json())
const port = process.env.port
const api_key = process.env.API_KEY
const jwtSecret = process.env.JWT

connectDB()

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
    const choice = req.query.set
    const cacheKey = `${choice}_set`

    // const url = `${API_LINK}/sets/${choice}`
    const url = `${API_LINK}/cards?set=${choice}`
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
    const choice1 = req.query.series
    const cacheKey = `${choice1}_series`

    const url = `${API_LINK}/series/${choice1}`
    const data = await fetchAndCache(cacheKey, url)
    // res.json(data)
    res.json({data: data.sets})
})

app.get('/series', async (req, res) => {
    const cacheKey = `series`
    const url = `${API_LINK}/series`
    const data = await fetchAndCache(cacheKey, url)
    res.json(data)
})

//https://api.tcgdex.net/v2/en/cards?name=pikachu

app.get('/search', async(req, res) => {
    const searchTerm = req.query.search
    cacheKey = `searching_pokemon_${searchTerm}`
    
    const url = `${API_LINK}/cards?name=${encodeURIComponent(searchTerm)}`
    const data = await fetchAndCache(cacheKey, url)
    res.json(data)
})

app.use(express.static('public'))
app.listen(port, () => console.log(`Server is running on Port ${port}`))
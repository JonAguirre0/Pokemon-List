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
require('dotenv').config()
const NodeCache = require('node-cache')
const express = require('express')
const connectDB = require('./public/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Favorite = require('./public/user')

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

app.post('/login', async(req, res) => {
    try {
        const {username, password} = req.body
        const user = await Favorite.findOne({username})
        if(!user) {
            return res.status(401).json({error: 'Invalid Username'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch) {
            const token = jwt.sign({userID: user._id, username: user.username}, jwtSecret, {expiresIn: '1h'})
            res.json({message: 'Login Successful', token})
        } else {
            return res.status(401).json({error:'Invalid Password'})
        }
    } catch(error) {
        return res.status(500).json({error:'Login Error'})
    }
})

app.post('/logout', async(req,res) => {
    res.status(200).json({message: 'Logged Out Successfully'})
    console.log('Logged Out Successfully')
})

app.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body
        if(!username || !email || !password) {
            return res.status(400).json({error: 'All Fields are Required'})
        }
        const userExists = await Favorite.findOne({username})
        if(userExists) {
            return res.status(400).json({error: 'Username Already Exists'})
        }
        const newUser = await Favorite.create({username, email, password})
        res.json({userID: newUser._id})
    } catch(error) {
        res.status(500).json({message: 'Registeration Error'})
    }
})

app.post('/favorites',async(req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const {id, image, name} = req.body
    if(!token){
        return res.status(401).json({error: 'No Token Provided'})
    }
    try {
        const checkToken = jwt.verify(token, jwtSecret)
        const user = await Favorite.findById(checkToken.userID)

        user.favorites.push({id, image, name})
        await user.save()
        res.json({message: 'Card Saved Successfully to Favorites'})
    } catch (error) {
        res.status(401).json({error: 'Error, Could Not Verify JWT'})
    }
})

app.get('/favoritesList', async(req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(!token){
        return res.status(401).json({error: 'No Token Provided'})
    }
    try {
        const checkToken = jwt.verify(token, jwtSecret)
        const user = await Favorite.findById(checkToken.userID)
        res.json({favorites: user.favorites})
    }catch (error) {
        res.status(401).json({error: 'Error, Could Not Verify JWT'})
    }
})

app.use(express.static('public'))
app.listen(port, () => console.log(`Server is running on Port ${port}`))
const mongoose = require('mongoose')
require('dotenv').config()

const DBURL = process.env.DBURL
const connectDB = async () => {
    try {
        await mongoose.connect(DBURL)
        console.log('Connected to Database')
    } catch (error) {
        console.log('Error, Database Not Connected', error.message)
    }
}

module.exports = connectDB
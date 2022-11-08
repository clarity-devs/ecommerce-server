const mongoose = require('mongoose')
require('dotenv').config() // for process.env

const { MONGO_URL } = process.env

// server connection
mongoose
    .connect(MONGO_URL)
    .then(() => { console.log('Соединение с БД установлено') })
    .catch((err) => console.log(err.message))
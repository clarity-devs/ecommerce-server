const express = require('express')
require('./database')

const userRouter = require('./routes/user')
const shopRouter = require('./routes/shop')
const shiftRouter = require('./routes/shift')
const termRouter = require('./routes/term')
const wageRouter = require('./routes/wage')
const taskRouter = require('./routes/task')

const app = express()
const port = 8001

app.use((req, res, next) => {
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:19006")

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader("Access-Control-Allow-Credentials", true)

    // Pass to next layer of middleware
    next()
})

// saves in req.body data of request body*
app.use(express.json())
app.use('/user', userRouter)
app.use('/shop', shopRouter)
app.use('/shift', shiftRouter)
app.use('/term', termRouter)
app.use('/wage', wageRouter)
app.use('/task', taskRouter)

app.get('/', (req, res) => {
    res.send('<h1>Ecommerce server</h1>')
})

app.listen(port, () => {
    console.log(`порт ${port} активен...`)
})
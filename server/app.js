const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const projects = require('./routes/projects')
const users = require('./routes/users')

mongoose.connect(process.env.MONGO_URI)

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(helmet())

// Конфигурация CORS
app.use(
  cors({
    origin: process.env.CLIENT_URI,
    credentials: true
  })
)

app.use(express.static(`${__dirname}/../../dist`))

// Маршрутизация
app.use('/api/projects', projects)
app.use('/api/users', users)
app.use('*', (req, res) => {
  res.sendFile(`${__dirname}/../../dist/index.html`)
})

// Старт сервера
app.listen(process.env.PORT, () => {
  console.log(`Server start on port ${process.env.PORT}`)
})

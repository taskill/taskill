require('dotenv').config()
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

// Маршрутизация
app.use('/api/projects', projects)
app.use('/api/users', users)

// Старт сервера
app.listen(process.env.PORT, () => {
  console.log(`Server start on port ${process.env.PORT}`)
})

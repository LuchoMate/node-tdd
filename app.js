const express = require('express')
const mongodb = require('./mongodb/mongodb.connect')
const todoRoutes = require('./routes/todo.routes')

mongodb.connect()

const app = express()

app.use(express.json())
app.use('/todos', todoRoutes)

app.use((error, req, res, next) => {
  res.status(500).json({message: error.message})
})

app.get('/', (req, res) => {
  res.json('Hello world!')
})

module.exports = app
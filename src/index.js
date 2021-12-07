"use strict";
const express = require('express')
const cookieParser = require('cookie-parser')
require('dotenv').config()
require('./db/mongoose')
const models = require('./models')

const app = express()
const port = process.env.PORT

// Expose collections to request handlers
app.use((req, res, next) => {
  if (!models.User)
    return next(new Error('No models.'))
  req.models = models;
  return next();
})

// Express.js configurations
app.set('x-powered-by', false)
app.set('json spaces', 2)

// Express.js middleware configuration
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const {
  usersRouter
} = require('./routes')


app.post('/api/upload', (req, res) => {
  try {
    res.json({ data: req.body })
  } catch (error) {
    console.error(error)
  }
})

app.use('/users', usersRouter)

// Error handlers
// Development error handler: Will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res
      .status(err.status || 500)
      .json({ message: { msgBody: 'Error occured:' + err, msgError: true } })
  })
}

// Production error handler: No stacktraces leaked to user
app.use(function (err, req, res, next) {
  res
    .status(err.status || 500)
    .json({ message: { msgBody: 'Error occured:' + err.message, msgError: true } })
})

if (app.get('env') === 'production') {
  app.use(express.static('client/build'))

  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}


app.listen(port, () => console.log(`Server is runnning on http://localhost:${port}`))
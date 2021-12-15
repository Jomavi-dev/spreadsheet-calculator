"use strict";
const express = require('express')
const cookieParser = require('cookie-parser')
require('dotenv').config()
require('./src/db/mongoose')
const models = require('./src/models')

const app = express()
const port = process.env.PORT

// Expose collections to request handlers
app.use((req, res, next) => {
  if (!models.User || !models.Results)
    return next(new Error('No models.'))
  req.models = models;
  return next();
})

// Express.js configurations
app.set('x-powered-by', false)
app.set('json spaces', 2)

// Express.js middleware configuration
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

const {
  usersRouter,
  resultsRouter
} = require('./src/routes')

app.use('/users', usersRouter)
app.use('/results', resultsRouter)

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
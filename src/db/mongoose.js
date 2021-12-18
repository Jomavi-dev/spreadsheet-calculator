const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const uri = process.env.MONGO_URI
mongoose.connect(uri, { useNewUrlParser: true }, (err) => {
  if (err) console.error('Error with MongoDB connection:', err)
  else console.log('MongoDB connection established successfully')
})

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

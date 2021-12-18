const mongoose = require('mongoose')
mongoose.Promise = global.Promise

// process.env.MONGO_URI ||
const uri =
mongoose.connect(uri, { useNewUrlParser: true }, (err) => {
  if (err) console.error('Error with MongoDB connection:', err)
  else console.log('MongoDB connection established successfully')
})

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

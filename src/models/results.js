const mongoose = require('mongoose')

const { Schema } = mongoose

const ObjectId = mongoose.Schema.Types.ObjectId
const resultSchema = new Schema({
  name: {
    type: String,
    required: [true, "You have to specify a name property"]
  },
  score: { type: Number, default: 0 },
  date: { type: Date },
  paid: { type: Boolean, default: false },
  _createdBy: { type: ObjectId }
}, { timestamps: true })

module.exports = mongoose.model('Results', resultSchema)
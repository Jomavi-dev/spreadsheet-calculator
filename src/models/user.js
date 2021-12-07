const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { Schema } = mongoose;

const roles = 'user admin super_admin'.split(' ')
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 4,
    max: 15
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: roles,
    required: true,
    default: roles[0]
  }
}, { timestamps: true });

userSchema.pre('save', function (next) {
  var user = this
  if (!user.isModified('password'))
    return next()
  bcrypt.hash(user.password, 10, (err, passwordHash) => {
    if (err)
      return next(err)
    user.password = passwordHash
    next()
  })
})

userSchema.methods.comparePassword = function (password, cb) {
  var user = this
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err)
      return cb(err)
    else {
      if (!isMatch)
        return cb(null, isMatch)
      cb(null, user)
    }
  })
}

module.exports = mongoose.model('User', userSchema)
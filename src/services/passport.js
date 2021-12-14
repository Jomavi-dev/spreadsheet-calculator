const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const User = require('../models/user')

const cookieExtractor = req => {
  let token
  if (req && req.cookies)
    token = req.cookies['access_token']
  return token
}

// authorization
passport.use(new JWTStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET_KEY
}, (jwt_payload, done) => {
  User.findById({ _id: jwt_payload.sub }, (err, user) => {
    if (err) return done(err, false)
    if (user) return done(null, user)
    done(null, false)
  })
}))

// authentication
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    //smth went wrong in the database
    if (err)
      return done(err)
    //user does exist
    if (!user)
      return done(null, false)
    //check if pwd is correct
    user.comparePassword(password, done)
  })
}))
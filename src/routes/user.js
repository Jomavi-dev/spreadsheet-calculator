const router = require('express').Router()
const passport = require('passport')
require('../services/passport')

const {
  createUser,
  login,
  logout,
  auth,
  checkAdmin
} = require('../controllers/user')

const jwtAuth = passport.authenticate('jwt', { session: false })
const localAuth = passport.authenticate('local', { session: false })

router
  .post('/register', createUser)

router
  .post('/login',
    localAuth, login)

router
  .get('/logout',
    jwtAuth, logout)

router
  .get('/auth',
    jwtAuth, auth)

router
  .get('/admin',
    jwtAuth, checkAdmin)

module.exports = router
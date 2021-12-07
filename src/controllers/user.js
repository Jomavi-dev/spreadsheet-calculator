"use strict";
const JWT = require('jsonwebtoken')

const signToken = userID => {
  return JWT.sign({
    iss: 'Mavi.co',
    sub: userID
  }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
}

exports.createUser = (req, res) => {
  const { username, password } = req.body
  req.models.User.findOne({ username }, (err, user) => {
    if (err)
      return res.status(500).json({ message: { msgBody: 'Error occured', msgError: true } })
    if (user)
      return res.status(400).json({ message: { msgBody: 'Username already taken', msgError: true } })
    else {
      const newUser = new req.models.User({ username, password })
      newUser.save(err => {
        if (err)
          return res.status(500).json({ message: { msgBody: 'Error occured', msgError: true } })
        else
          return res.status(201).json({ message: { msgBody: 'Account created succesfully', msgError: false } })
      })
    }
  })
}

exports.login = (req, res) => {
  if (req.isAuthenticated()) {
    const { _id: id, username, role } = req.user
    const token = signToken(id)
    res.cookie('access_token', token, { httpOnly: true, sameSite: true })
    res.status(200).json({ isAuthenticated: true, user: { username, role } })
  }
}

exports.logout = (req, res) => {
  res.clearCookie('access_token')
  res.json({ user: { username: '', role: '' }, success: true })
}

exports.checkAdmin = (req, res) => {
  if (req.user.role === 'admin')
    res.status(200).json({ message: { msgBody: 'You are an admin', msgError: false } })
  else
    res.status(403).json({ message: { msgBody: 'You are not admin, fuck off!', msgError: true } })
}

exports.auth = (req, res) => {
  const { username, role } = req.user
  res.status(200).json({ isAuthenticated: true, user: { username, role } })
}
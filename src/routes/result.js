const router = require('express').Router()
const passport = require('passport')
require('../services/passport')

const {
  getResults,
  createResult,
  getResult,
  deleteResult,
  updateResult
} = require('../controllers/result')

const jwtAuth = passport.authenticate('jwt', { session: false })

router.param('id', function (req, res, next, id) {
  if (!id) return next(new Error('No result ID.'))
  console.log('id param was detected: ', id)
  req.models.User.findById(
    id,
    function (error, member) {
      if (error) return next(error);
      request.member = member;
      return next();
    }
  );
})

router.route('/')
  // .all(jwtAuth)
  .get(getResults)
  .post(createResult)

router.route('/:id')
  // .all(jwtAuth)
  .get(getResult)
  .delete(deleteResult)
  .patch(updateResult)

module.exports = router
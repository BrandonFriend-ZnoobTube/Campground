const express = require('express');
const passport = require('passport');

const TryAsync = require('../utils/TryAsync');
const authController = require('../controllers/auth');

const router = express.Router();

router.route('/register')
  .get(authController.getRegister)
  .post(TryAsync(authController.postRegister));

router.route('/login')
  .get(authController.getLogin)
  .post(passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/auth/login'
  }), authController.postLogin);

router.get('/logout', authController.getLogout);

module.exports = router;
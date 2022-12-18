const express = require('express');
const passport = require('passport');

const TryAsync = require('../utils/TryAsync');
const User = require('../models/user');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('auth/register');
});

router.post('/register', TryAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);
    req.login(newUser, err => {
      if (err) return next(err);
      req.flash('success', 'Successfully registered');
      res.redirect('/camp/list');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/auth/register');
  }
}));

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/auth/login'
}), (req, res) => {
  req.flash('success', 'Login Successful');
  const redirectUrl = req.session.returnTo || '/camp/list';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {

});

module.exports = router;
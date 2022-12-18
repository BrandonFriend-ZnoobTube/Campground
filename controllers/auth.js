const User = require('../models/user');

module.exports.getRegister = (req, res) => {
  res.render('auth/register');
}

module.exports.getLogin = (req, res) => {
  res.render('auth/login');
}

module.exports.postRegister = async (req, res, next) => {
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
}

module.exports.postLogin = (req, res) => {
  req.flash('success', 'Login Successful');
  const redirectUrl = req.session.returnTo || '/camp/list';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
}

module.exports.getLogout = (req, res) => {
  req.logout();
  req.flash('success', 'Successfully logged out');
  res.redirect('/camp/list');
}
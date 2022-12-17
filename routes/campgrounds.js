const express = require('express');
const TryAsync = require('../utils/TryAsync');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');

const router = express.Router();

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  }
  else {
    next();
  }
};

router.get('/list', TryAsync(async (req, res) => {
  const camps = await Campground.find({});
  res.render('camp/list', { camps });
}));

router.get('/show/:id', TryAsync(async (req, res) => {
  const camp = await Campground.findById(req.params.id).populate('reviews');
  if (!camp) {
    req.flash('error', 'Campground has moved or been deleted');
    return res.redirect('/camp');
  }
  res.render('camp/show', { camp });
}));

router.get('/:id/edit', TryAsync(async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  res.render('camp/edit', { camp });
}));

router.get('/new', (req, res) => {
  res.render('camp/new');
});

router.post('/create', validateCampground, TryAsync(async (req, res) => {
  const camp = new Campground(req.body.campground);
  await camp.save();
  req.flash('success', 'Successfully made a new campground');
  res.redirect(`/camp/show/${ camp._id }`);
}));

router.put('/:id', validateCampground, TryAsync(async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success', 'Successfully updated campground');
  res.redirect(`/camp/show/${ camp._id }`);
}));

router.delete('/delete/:id', TryAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground');
  res.redirect('/camp/list');
}));

module.exports = router;
const express = require('express');
const TryAsync = require('../utils/TryAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  }
  else {
    next();
  }
};

router.post('/', validateReview, TryAsync(async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash('success', 'Successfully created a new review');
  res.redirect(`/camp/show/${ camp._id }`);
}));

router.delete('/:reviewId', TryAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted review');
  res.redirect(`/camp/show/${ id }`);
}));

module.exports = router;
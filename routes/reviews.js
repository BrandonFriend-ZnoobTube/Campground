const express = require('express');
const TryAsync = require('../utils/TryAsync');
const { validateReview, isLoggedIn, validateReviewAuthor } = require('../middleware');
const reviewController = require('../controllers/reviews');

const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReview, TryAsync(reviewController.postReview));
router.delete('/:reviewId', isLoggedIn, validateReviewAuthor, TryAsync(reviewController.deleteReview));

module.exports = router;
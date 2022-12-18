const express = require('express');
const TryAsync = require('../utils/TryAsync');
const { isLoggedIn, validateCampground, validateCampAuthor } = require('../middleware');
const campController = require('../controllers/campgrounds');

const router = express.Router();

router.get('/list', TryAsync(campController.index));
router.get('/:id/edit', isLoggedIn, validateCampAuthor, TryAsync(campController.getCampEdit));

router.route('/new')
  .get(isLoggedIn, campController.getNew)
  .post(isLoggedIn, validateCampground, TryAsync(campController.postCampCreate))

router.route('/:id')
  .get(TryAsync(campController.getCamp))
  .put(isLoggedIn, validateCampground, validateCampAuthor, TryAsync(campController.putCampEdit))
  .delete(isLoggedIn, validateCampAuthor, TryAsync(campController.deleteCamp))

module.exports = router;
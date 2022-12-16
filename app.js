const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');
const TryAsync = require('./utils/TryAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => {
    console.log('Connected to Mongo');
  })
  .catch(err => {
    console.log(`Error: ${ err }`);
  });

const app = express();

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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/camp/list', TryAsync(async (req, res) => {
  const camps = await Campground.find({});
  res.render('camp/list', { camps });
}));

app.get('/camp/show/:id', TryAsync(async (req, res) => {
  const camp = await Campground.findById(req.params.id).populate('reviews');
  res.render('camp/show', { camp });
}));

app.get('/camp/:id/edit', TryAsync(async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  res.render('camp/edit', { camp });
}));

app.get('/camp/new', (req, res) => {
  res.render('camp/new');
});

app.post('/camp/create', validateCampground, TryAsync(async (req, res) => {
  const camp = new Campground(req.body.campground);
  await camp.save();
  res.redirect(`/camp/show/${ camp._id }`);
}));

app.post('/camp/:id/review', validateReview, TryAsync(async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  res.redirect(`/camp/show/${ camp._id }`);
}));

app.put('/camp/:id', validateCampground, TryAsync(async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/camp/show/${ camp._id }`);
}));

app.delete('/camp/delete/:id', TryAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/camp/list');
}));

app.delete('/camp/:id/review/:reviewId', TryAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/camp/show/${ id }`);
}));

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = 'Something went wrong';
  }
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('Running on port 3000');
});
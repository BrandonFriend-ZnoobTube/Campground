const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => {
    console.log('Connected to Mongo');
  })
  .catch(err => {
    console.log(`Error: ${ err }`);
  });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '639df41a0b4fbb0fc6b01a1a',
      location: `${ cities[random1000].city }, ${ cities[random1000].state }`,
      title: `${ sample(descriptors) } ${ sample(places) }`,
      // image: 'https://source.unsplash.com/collection/483251',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
        'Ut faucibus pulvinar elementum integer enim neque volutpat. Venenatis lectus magna fringilla urna porttitor rhoncus dolor. ' +
        'Donec pretium vulputate sapien nec sagittis aliquam malesuada. Aliquam sem fringilla ut morbi.',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
        ]
      }
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
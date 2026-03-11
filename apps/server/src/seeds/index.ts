// This file is used to seed the database with some data.
// To run this file, use the command: npx tsx src/seeds/index.ts while in the server directory.
import mongoose from 'mongoose';
import Campground from '../models/campground';
import { descriptors, places } from './seedHelpers';
import { cities } from './cities';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const sample = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  // Delete all campgrounds from the database
  await Campground.deleteMany({});
  // Create 50 new campgrounds
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Cursus imperdiet sapien ullamcorper orci magnis sollicitudin interdum volutpat. Tristique justo curae phasellus quis eros ultrices.",
      price: randomPrice
    })
    await camp.save();
  }
  console.log('Seeded 50 campgrounds');
};

seedDB().then(() => {
  console.log('Bye bye!');
  mongoose.connection.close();
});
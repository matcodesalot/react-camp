import { Schema, model } from 'mongoose';

const campgroundSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
});

const Campground = model('Campground', campgroundSchema);

export default Campground;
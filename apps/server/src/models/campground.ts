import { Schema, model } from 'mongoose';

interface Campground {
  title: string;
  price: number;
  description: string;
  location: string;
};

const campgroundSchema = new Schema<Campground>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
});

const Campground = model('Campground', campgroundSchema);

export default Campground;
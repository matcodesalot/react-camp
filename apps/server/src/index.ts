import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import Campground from '../models/campground';

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running!' });
});

app.get('/api/make-campground', async (req: Request, res: Response) => {
  const campground = new Campground({
    title: 'Campground 1',
    price: 100,
    description: 'This is a description of the campground',
    location: 'This is a location of the campground',
  });
  await campground.save();
  res.json(campground);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../../apps/client/dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../../apps/client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
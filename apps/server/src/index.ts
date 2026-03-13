import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import Campground from './models/campground';

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

app.get('/api/campgrounds', async (req: Request, res: Response) => {
  const campgrounds = await Campground.find({});
  res.json(campgrounds);
});

app.get('/api/campgrounds/:id', async (req: Request, res: Response) => {
  const campground = await Campground.findById(req.params.id);
  res.json(campground);
});

app.post('/api/campgrounds', async (req: Request, res: Response) => {
  const campground = new Campground(req.body);
  await campground.save();
  res.json(campground);
});

app.put('/api/campgrounds/:id', async (req: Request, res: Response) => {
  const campground = await Campground.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(campground);
});

app.delete('/api/campgrounds/:id', async (req: Request, res: Response) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.json({ message: 'Campground deleted' });
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
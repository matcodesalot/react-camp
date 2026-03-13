import { type FC, useEffect, useState } from 'react';

interface Campground {
  _id: string;
  title: string;
  price: number;
  description: string;
  location: string;
}

export const Campgrounds: FC = () => {
  const [campgrounds, setCampgrounds] = useState<Campground[]>([]);

  useEffect(() => {
    fetch('/api/campgrounds')
      .then((res) => res.json())
      .then((data) => setCampgrounds(data));
  }, []);

  return (
    <div>
      <h1>Campgrounds</h1>
      <ul>
        {campgrounds.map((c) => (
          <li key={c._id}>{c.title}</li>
        ))}
      </ul>
    </div>
  );
};

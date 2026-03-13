import { useLoaderData, Link } from 'react-router';

interface Campground {
  _id: string;
  title: string;
  price: number;
  description: string;
  location: string;
}

export async function loader() {
  const res = await fetch('/api/campgrounds');
  return res.json() as Promise<Campground[]>;
}

export const Campgrounds = () => {
  const campgrounds = useLoaderData() as Campground[];

  return (
    <div>
      <h1>Campgrounds</h1>
      <ul>
        {campgrounds.map((c) => (
          <li key={c._id}>
            <Link to={`/campgrounds/${c._id}`}>{c.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

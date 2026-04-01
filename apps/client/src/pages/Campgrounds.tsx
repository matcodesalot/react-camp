import { useLoaderData } from 'react-router';
import { z } from 'zod';
import { Card } from '../components/Card';
import { CampgroundSchema } from '@my-project/shared';

export async function loader() {
  const res = await fetch('/api/campgrounds');
  if (!res.ok) throw new Response('Failed to load campgrounds', { status: res.status });
  return z.array(CampgroundSchema).parse(await res.json());
}

export const Campgrounds = () => {
  const campgrounds = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Campgrounds</h1>
      {campgrounds.map((c) => (
        <Card
          key={c._id}
          _id={c._id}
          title={c.title}
          price={c.price}
          description={c.description}
          location={c.location}
          image={c.image}
        />
      ))}
    </div>
  );
};
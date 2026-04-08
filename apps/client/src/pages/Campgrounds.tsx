import { useLoaderData } from 'react-router';
import { useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { CampgroundSchema } from '@my-project/shared';

export async function loader() {
  const res = await fetch('/api/campgrounds');
  if (!res.ok) throw new Response('Failed to load campgrounds', { status: res.status });
  return z.array(CampgroundSchema).parse(await res.json());
}

export const Campgrounds = () => {
  const campgrounds = useLoaderData<typeof loader>();

  useEffect(() => {
    const pending = sessionStorage.getItem('pendingToast');
    if (!pending) return;
    sessionStorage.removeItem('pendingToast');
    const { type, message } = JSON.parse(pending);
    type === 'success' ? toast.success(message) : toast.error(message);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Campgrounds</h1>
      {campgrounds.map((c) => (
        <Card
          key={c._id}
          _id={c._id}
          title={c.title}
          description={c.description}
          location={c.location}
          image={c.image}
        />
      ))}
    </div>
  );
};
import { useLoaderData, Link, Form, redirect } from 'react-router';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { CampgroundSchema } from '@my-project/shared';

export async function loader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`/api/campgrounds/${params.id}`);
  if (!res.ok) throw new Response('Campground not found', { status: res.status });
  return CampgroundSchema.parse(await res.json());
}

export async function action({ params, request }: ActionFunctionArgs) {
  if (request.method === 'DELETE') {
    const res = await fetch(`/api/campgrounds/${params.id}`, { method: 'DELETE' });
    if (!res.ok) throw new Response('Failed to delete campground', { status: res.status });
    return redirect('/campgrounds');
  }

  const formData = await request.formData();
  const res = await fetch(`/api/campgrounds/${params.id}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      body: formData.get('body'),
      rating: Number(formData.get('rating')),
    }),
  });
  if (!res.ok) throw new Response('Failed to create review', { status: res.status });
  return null;
}

export const Show = () => {
  const campground = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <img
        src={campground.image}
        alt={campground.title}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{campground.title}</h1>
      <p className="text-gray-700 mb-4">{campground.description}</p>
      <p className="text-lg font-semibold mb-1">${campground.price} / night</p>
      <p className="text-sm text-gray-500 mb-6">{campground.location}</p>
      <div className="flex gap-3">
        <Link
          to={`/campgrounds/${campground._id}/edit`}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Edit
        </Link>
        <Form method="delete">
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </Form>
      </div>
      <h2 className="text-2xl font-bold mb-2">Leave a review</h2>
      <Form method="post">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Rating</span>
          <input name="rating" type="range" min={1} max={5} step={1} className="border border-gray-300 rounded py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Comment</span>
          <textarea name="body" className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
      </Form>
    </div>
  );
};
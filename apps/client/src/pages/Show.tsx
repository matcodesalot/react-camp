import { useLoaderData, Link, Form, redirect } from 'react-router';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { CampgroundSchema } from '@my-project/shared';

export async function loader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`/api/campgrounds/${params.id}`);
  if (!res.ok) throw new Response('Campground not found', { status: res.status });
  return CampgroundSchema.parse(await res.json());
}

export async function action({ params }: ActionFunctionArgs) {
  const res = await fetch(`/api/campgrounds/${params.id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Response('Failed to delete campground', { status: res.status });
  return redirect('/campgrounds');
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
    </div>
  );
};
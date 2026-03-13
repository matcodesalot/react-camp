import { useLoaderData, Link, Form, redirect } from 'react-router';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';

interface Campground {
  _id: string;
  title: string;
  price: number;
  description: string;
  location: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`/api/campgrounds/${params.id}`);
  return res.json() as Promise<Campground>;
}

export async function action({ params }: ActionFunctionArgs) {
  await fetch(`/api/campgrounds/${params.id}`, {
    method: 'DELETE',
  });
  return redirect('/campgrounds');
}

export const Show = () => {
  const campground = useLoaderData() as Campground;

  return (
    <div>
      <h1>{campground.title}</h1>
      <p>{campground.description}</p>
      <p>${campground.price}</p>
      <p>{campground.location}</p>
      <Link to={`/campgrounds/${campground._id}/edit`}>Edit</Link>
      <Form method="delete">
        <button type="submit">Delete</button>
      </Form>
    </div>
  );
};

import { Form, redirect, useLoaderData } from 'react-router';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';

// Loader: fetches existing campground before the component renders
export async function loader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`/api/campgrounds/${params.id}`);
  return res.json(); // returned value is available via useLoaderData()
}

// Action: handles the POST form submission
export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = {
    title: formData.get('title'),
    price: Number(formData.get('price')),
    description: formData.get('description'),
    location: formData.get('location'),
  };

  await fetch(`/api/campgrounds/${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return redirect(`/campgrounds/${params.id}`);
}

// Component: uses <Form> (React Router's form) and defaultValue from loader
export const Edit = () => {
  const campground = useLoaderData();

  return (
    <div>
      <h1>Edit Campground</h1>
      <Form method="put">
        <label>Title: <input name="title" defaultValue={campground.title} required /></label>
        <label>Price: <input name="price" type="number" defaultValue={campground.price} required /></label>
        <label>Description: <textarea name="description" defaultValue={campground.description} required /></label>
        <label>Location: <input name="location" defaultValue={campground.location} required /></label>
        <button type="submit">Save Changes</button>
      </Form>
    </div>
  );
};
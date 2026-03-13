import { Form, redirect } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = {
    title: formData.get('title'),
    price: Number(formData.get('price')),
    description: formData.get('description'),
    location: formData.get('location'),
  };

  const res = await fetch('/api/campgrounds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const newCampground = await res.json();
  return redirect(`/campgrounds/${newCampground._id}`);
}

export const New = () => {
  return (
    <div>
      <h1>New Campground</h1>
      <Form method="post">
        <label>Title: <input name="title" required /></label>
        <label>Price: <input name="price" type="number" required /></label>
        <label>Description: <textarea name="description" required /></label>
        <label>Location: <input name="location" required /></label>
        <button type="submit">Create Campground</button>
      </Form>
    </div>
  );
};

import { useLoaderData, useFetcher, redirect, data } from 'react-router';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { PopulatedCampgroundSchema, CreateCampgroundSchema } from '@my-project/shared';
import { z } from 'zod';
import { authClient } from '../lib/auth-client';
import { API_BASE } from '../lib/api';

type FieldErrors = {
  _form?: string[];
  title?: string[];
  price?: string[];
  description?: string[];
  location?: string[];
  image?: string[];
};

function actionError(errors: FieldErrors, values: Record<string, unknown>, status = 400) {
  return data({ errors, values }, { status });
}

export async function loader({ params }: LoaderFunctionArgs) {
  const [res, { data: session }] = await Promise.all([
    fetch(`${API_BASE}/api/campgrounds/${params.id}`),
    authClient.getSession(),
  ]);
  if (!res.ok) throw new Response('Campground not found', { status: res.status });
  const campground = PopulatedCampgroundSchema.parse(await res.json());
  if (!session) throw new Response(null, { status: 401, statusText: 'You must be logged in' });
  const isAuthor = campground.author?._id === session.user.id;
  if (!isAuthor) {
    throw new Response(null, { status: 403, statusText: 'You do not have permission to do that' });
  }
  return campground;
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const raw = {
    title: formData.get('title'),
    price: Number(formData.get('price')),
    description: formData.get('description'),
    location: formData.get('location'),
    image: formData.get('image'),
  };

  const result = CreateCampgroundSchema.safeParse(raw);
  if (!result.success) {
    return actionError(z.flattenError(result.error).fieldErrors, raw);
  }

  const res = await fetch(`${API_BASE}/api/campgrounds/${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(result.data),
  });

  if (!res.ok) {
    const error = await res.text();
    return actionError({ _form: [error || 'Failed to update campground'] }, raw, 500);
  }

  sessionStorage.setItem('pendingToast', JSON.stringify({ type: 'success', message: 'Campground updated!' }));
  return redirect(`/campgrounds/${params.id}`);
}

export const Edit = () => {
  const campground = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const errors = fetcher.data && 'errors' in fetcher.data ? fetcher.data.errors : null;
  const isBusy = fetcher.state !== 'idle';
  const wasSubmittingRef = useRef(false);

  useEffect(() => {
    if (fetcher.state !== 'idle') {
      wasSubmittingRef.current = true;
      return;
    }
    if (!wasSubmittingRef.current) return;
    wasSubmittingRef.current = false;

    const formErrors = fetcher.data && 'errors' in fetcher.data ? fetcher.data.errors : null;
    if (formErrors?._form) toast.error(formErrors._form[0]);
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Campground</h1>
      <fetcher.Form method="post" className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Title</span>
          <input
            name="title"
            defaultValue={campground.title}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors?.title && (
            <span className="text-sm text-red-500">{errors.title[0]}</span>
          )}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Price</span>
          <input
            name="price"
            type="number"
            defaultValue={campground.price}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors?.price && (
            <span className="text-sm text-red-500">{errors.price[0]}</span>
          )}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Description</span>
          <textarea
            name="description"
            rows={4}
            defaultValue={campground.description}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors?.description && (
            <span className="text-sm text-red-500">{errors.description[0]}</span>
          )}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Location</span>
          <input
            name="location"
            defaultValue={campground.location}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors?.location && (
            <span className="text-sm text-red-500">{errors.location[0]}</span>
          )}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Image URL</span>
          <input
            name="image"
            type="url"
            placeholder="https://example.com/image.jpg"
            defaultValue={campground.image}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors?.image && (
            <span className="text-sm text-red-500">{errors.image[0]}</span>
          )}
        </label>
        <button
          type="submit"
          disabled={isBusy}
          className="self-start px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isBusy ? 'Saving...' : 'Save Changes'}
        </button>
      </fetcher.Form>
    </div>
  );
};

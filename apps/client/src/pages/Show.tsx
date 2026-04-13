import { useLoaderData, Link, Form, redirect, useFetcher, data } from 'react-router';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { useSession } from '../lib/auth-client';
import { toast } from 'sonner';
import { PopulatedCampgroundSchema, CreateReviewSchema, type PopulatedReview } from '@my-project/shared';
import { z } from 'zod';
import { StarRating, StarDisplay } from '../components/StarRating';

type ReviewFieldErrors = {
  _form?: string[];
  body?: string[];
  rating?: string[];
};

function reviewActionError(errors: ReviewFieldErrors, values: Record<string, unknown>, status = 400) {
  return data({ errors, values }, { status });
}

export async function loader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`/api/campgrounds/${params.id}`);
  if (!res.ok) throw new Response('Campground not found', { status: res.status });
  return PopulatedCampgroundSchema.parse(await res.json());
}

export async function action({ params, request }: ActionFunctionArgs) {
  if (request.method === 'DELETE') {
    const formData = await request.formData();
    const reviewId = formData.get('reviewId');

    if (reviewId) {
      const res = await fetch(`/api/campgrounds/${params.id}/reviews/${reviewId}`, { method: 'DELETE' });
      if (!res.ok) {
        const message = await res.text();
        return data({ error: message || 'Failed to delete review' }, { status: res.status });
      }
      return null;
    }

    const res = await fetch(`/api/campgrounds/${params.id}`, { method: 'DELETE' });
    if (!res.ok) throw new Response('Failed to delete campground', { status: res.status });
    sessionStorage.setItem('pendingToast', JSON.stringify({ type: 'success', message: 'Campground deleted!' }));
    return redirect('/campgrounds');
  }

  const formData = await request.formData();
  const raw = {
    body: formData.get('body'),
    rating: Number(formData.get('rating')),
  };

  const result = CreateReviewSchema.safeParse(raw);
  if (!result.success) {
    return reviewActionError(z.flattenError(result.error).fieldErrors, raw);
  }

  const res = await fetch(`/api/campgrounds/${params.id}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result.data),
  });
  if (!res.ok) {
    const error = await res.text();
    return reviewActionError({ _form: [error || 'Failed to create review'] }, raw, 500);
  }
  return null;
}

function ReviewItem({
  review,
  campgroundId,
  deleteFetcher,
  isDeleting,
  session,
}: {
  review: PopulatedReview & { _id: string };
  campgroundId: string;
  deleteFetcher: ReturnType<typeof useFetcher>;
  isDeleting: boolean;
  session: ReturnType<typeof useSession>['data'];
}) {
  return (
    <li className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <StarDisplay value={review.rating} />
          <p className="text-gray-700">{review.body}</p>
          {review.author && (
            <p className="text-sm text-gray-500 mt-1">— {review.author.name}</p>
          )}
        </div>
        {review.author?._id === session?.user?.id && (
          <deleteFetcher.Form method="delete" action={`/campgrounds/${campgroundId}`} className="shrink-0">
            <input type="hidden" name="reviewId" value={review._id} />
            <button
              type="submit"
              disabled={isDeleting}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </deleteFetcher.Form>
        )}
      </div>
    </li>
  );
}

export const Show = () => {
  const campground = useLoaderData<typeof loader>();
  const { data: session } = useSession();
  const fetcher = useFetcher<typeof action>();
  const reviewErrors = fetcher.data && 'errors' in fetcher.data ? fetcher.data.errors : null;
  const isBusy = fetcher.state !== 'idle';
  const formRef = useRef<HTMLFormElement>(null);
  const wasSubmittingRef = useRef(false);
  const [rating, setRating] = useState<number>(0);

  const reviewDeleteFetcher = useFetcher();
  const deletingReviewId = reviewDeleteFetcher.formData?.get('reviewId') as string | null;
  const wasDeletingReviewRef = useRef(false);

  useEffect(() => {
    if (reviewDeleteFetcher.state !== 'idle') {
      wasDeletingReviewRef.current = true;
      return;
    }
    if (!wasDeletingReviewRef.current) return;
    wasDeletingReviewRef.current = false;
    const deleteResult = reviewDeleteFetcher.data as { error?: string } | null;
    if (deleteResult?.error) {
      toast.error(deleteResult.error);
    } else {
      toast.success('Review deleted!');
    }
  }, [reviewDeleteFetcher.state, reviewDeleteFetcher.data]);

  useEffect(() => {
    const pending = sessionStorage.getItem('pendingToast');
    if (!pending) return;
    sessionStorage.removeItem('pendingToast');
    const { type, message } = JSON.parse(pending);
    type === 'success' ? toast.success(message) : toast.error(message);
  }, []);

  useEffect(() => {
    if (fetcher.state !== 'idle') {
      wasSubmittingRef.current = true;
      return;
    }
    if (!wasSubmittingRef.current) return;
    wasSubmittingRef.current = false;

    if (reviewErrors) {
      if (reviewErrors._form) toast.error(reviewErrors._form[0]);
    } else {
      formRef.current?.reset();
      setRating(0);
      toast.success('Review submitted!');
    }
  }, [fetcher.state, reviewErrors]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left column: campground info */}
        <div className="flex-1 min-w-0">
          <img
            src={campground.image}
            alt={campground.title}
            className="w-full h-72 object-cover rounded-lg mb-6"
          />
          <h1 className="text-3xl font-bold mb-2">{campground.title}</h1>
          <p className="text-gray-700 mb-4">{campground.description}</p>
          <p className="text-lg font-semibold mb-1">${campground.price} / night</p>
          <p className="text-sm text-gray-500 mb-6">{campground.location}</p>
          <p className="text-sm text-gray-500 mb-6">Submitted by {campground.author?.name}</p>
          {campground.author?._id === session?.user?.id && (
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
          )}
        </div>

        {/* Right column: reviews */}
        <div className="flex-1 min-w-0">
          {session?.user && (
            <>
              <h2 className="text-2xl font-bold mb-4">Leave a review</h2>
              <fetcher.Form ref={formRef} method="post" className="flex flex-col gap-4 mb-8">
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Rating</span>
                  <StarRating value={rating} onChange={setRating} />
                  {reviewErrors?.rating && (
                    <span className="text-sm text-red-500">{reviewErrors.rating[0]}</span>
                  )}
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Comment</span>
                  <textarea
                    name="body"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {reviewErrors?.body && (
                    <span className="text-sm text-red-500">{reviewErrors.body[0]}</span>
                  )}
                </label>
                <button
                  type="submit"
                  disabled={isBusy}
                  className="self-start px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isBusy ? 'Submitting...' : 'Submit'}
                </button>
              </fetcher.Form>
            </>
          )}
          {campground.reviews.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              <ul className="space-y-4">
                {campground.reviews.map((review) => {
                  if (typeof review === 'string' || !review._id) return null;
                  return (
                    <ReviewItem
                      key={review._id}
                      review={review as PopulatedReview & { _id: string }}
                      campgroundId={campground._id!}
                      deleteFetcher={reviewDeleteFetcher}
                      isDeleting={deletingReviewId === review._id}
                      session={session}
                    />
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
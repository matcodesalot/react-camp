import { useRouteError, isRouteErrorResponse, Link } from 'react-router';

export default function ErrorPage() {
  const error = useRouteError();

  let status = 500;
  let message = 'An unexpected error occurred.';

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message =
      error.status === 404
        ? "The page you're looking for doesn't exist."
        : error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-2">{status}</h1>
      <p className="text-lg text-gray-600 mb-6">{message}</p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}
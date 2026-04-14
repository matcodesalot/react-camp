import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { apiFetch } from './lib/api';

export default function App() {
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    apiFetch(`/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch(() => setStatus('Error connecting to server'));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">React Camp</h1>
      <p className="text-lg">Server status: {status}</p>
      <Link to="/campgrounds">
        <button className="bg-blue-500 text-white p-2 rounded-md">Go to Campgrounds</button>
      </Link>
    </div>
  );
}
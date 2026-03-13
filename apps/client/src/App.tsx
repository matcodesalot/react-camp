import { useEffect, useState } from 'react';
import { Link } from 'react-router';

function App() {
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch(() => setStatus('Error connecting to server'));
  }, []);

  return (
    <div>
      <h1>React + Vite + Express</h1>
      <p>Server status: {status}</p>
      <Link to="/campgrounds">
        <button>Go to Campgrounds</button>
      </Link>
    </div>
  );
}

export default App;
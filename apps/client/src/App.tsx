import { useEffect, useState } from 'react';

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
    </div>
  );
}

export default App;
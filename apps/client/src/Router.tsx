import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import App from './App';
import { Campgrounds } from './pages/Campgrounds';

const router = createBrowserRouter([
  {
    index: true,
    path: '/',
    element: <App />,
  },
  {
    path: '/campgrounds',
    element: <Campgrounds />,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
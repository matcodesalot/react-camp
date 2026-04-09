import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import App from './App';
import Layout from './components/Layout';
import ErrorPage from './pages/ErrorPage';
import { Campgrounds, loader as campgroundsLoader } from './pages/Campgrounds';
import { Show, loader as showLoader, action as deleteAction } from './pages/Show';
import { New, loader as newLoader, action as createAction } from './pages/New';
import { Edit, loader as editLoader, action as updateAction } from './pages/Edit';
import Login from './pages/Login';
import Register from './pages/Register';

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: '/',
        element: <App />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/campgrounds',
        element: <Campgrounds />,
        loader: campgroundsLoader,
      },
      {
        path: '/campgrounds/new',
        element: <New />,
        loader: newLoader,
        action: createAction,
      },
      {
        path: '/campgrounds/:id',
        element: <Show />,
        loader: showLoader,
        action: deleteAction,
      },
      {
        path: '/campgrounds/:id/edit',
        element: <Edit />,
        loader: editLoader,
        action: updateAction,
      },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
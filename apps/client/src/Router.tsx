import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import App from './App';
import { Campgrounds, loader as campgroundsLoader } from './pages/Campgrounds';
import { Show, loader as showLoader, action as deleteAction } from './pages/Show';
import { New, action as newAction } from './pages/New';
import { Edit, loader as editLoader, action as editAction } from './pages/Edit';

const router = createBrowserRouter([
  {
    index: true,
    path: '/',
    element: <App />,
  },
  {
    path: '/campgrounds',
    element: <Campgrounds />,
    loader: campgroundsLoader,
  },
  {
    path: '/campgrounds/new',
    element: <New />,
    action: newAction,
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
    action: editAction,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;

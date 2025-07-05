import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'


import App from './App.tsx'; // Change from .jsx to .tsx
import Dashboard from './pages/Dashboard.tsx';
import Signup from './pages/Signup.tsx';
import Login from './pages/Login';
import YardHealth from './pages/YardHealth.tsx';
import { Profile } from './pages/Profile.tsx';
import ShiftLog from './pages/ShiftLog.tsx';
import ErrorPage from './pages/error.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/yardhealth',
        element: <YardHealth />,
      },
      {
        path: '/profile/:username',
        element: <Profile />,
      },
      {
        path: '/me',
        element: <Profile />,
      },
      {
        path: '/shiftlog',
        element: <ShiftLog />,
      },
    ],
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
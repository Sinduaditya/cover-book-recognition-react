import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Welcome from './pages/Welcome';
import BookScanner from './pages/BookScanner';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Welcome />
    },
    {
      path: "/scanner",
      element: <BookScanner />
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
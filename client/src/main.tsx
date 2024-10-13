import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AllSubmissions } from './components/AllSubmissions.tsx';
import { Home } from './components/Home.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/all-submissions",
        element: <AllSubmissions />,
      },
    ]
  },
]);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
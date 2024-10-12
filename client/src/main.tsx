import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AllSubmissions } from './components/AllSubmissions.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/all-submissions",
    element: <AllSubmissions />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
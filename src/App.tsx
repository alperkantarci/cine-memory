import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./App.css";
import { CineCollection } from "./components/CineCollection";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import { MultiSearch } from "./components/MultiSearch";
import { Layout } from "./components/Layout";
import { CineEntry } from "./components/CineEntry";

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Navigate to="cine-collection" />,
        },
        {
          path: "cine-collection",
          element: <CineCollection />,
        },
        {
          path: "cine-collection/:id",
          element: <CineEntry />,
        },
        {
          path: "search/multi",
          element: <MultiSearch />,
        },
      ],
    },
  ]);
  return (
    <DatabaseProvider>
      <RouterProvider router={router}></RouterProvider>
    </DatabaseProvider>
  );
}

export default App;

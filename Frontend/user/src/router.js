import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./components/Personal/Signup";
import Login from "./components/Personal/Login";
import Update from "./components/Personal/Update";
import Home from "./components/Home";
import WatchList from "./components/Personal/WatchList";
import History from "./components/Personal/History";
import View from "./components/ViewMovies";
import PrivateRoute from "./privateRouter";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },

  // Protected Routes (Wrapped inside PrivateRoute)
  {
    element: <PrivateRoute />,
    children: [
      { path: "/profile", element: <Update /> },
      { path: "/home", element: <Home /> },
      { path: "/bookmark", element: <WatchList /> },
      { path: "/history", element: <History /> },
      { path: "/view/:id", element: <View /> },
    ],
  },
]);

export default router;

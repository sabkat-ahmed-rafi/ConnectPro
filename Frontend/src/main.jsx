import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root/Root";
import Home from "./Components/Home";
import Login from "./Authentication/Login/Login";
import Register from "./Authentication/SignIn/Register";
import Authentication from "./Authentication/Authentication";
import { Toaster } from "react-hot-toast";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Inbox from "./Components/Messages/Inbox";
import Message from "./Components/Messages/Message";
import VideoCall from "./Components/Messages/VideoCall";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    //  next route from here 
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/inbox",
    element: <Inbox />,
    children: [
      {
        path: "/inbox/message/:uid",
        element: <Message></Message>,
        loader: ({params}) => fetch(`${import.meta.env.VITE_BACKEND_URL}/userMessage/${params.uid}`)
      },
      // I have to make a route here for the video and audio functionality to show the video and audio UI
      {
        path: "/inbox/videoCall/:uid",
        element: <VideoCall></VideoCall>,
        loader: ({params}) => fetch(`${import.meta.env.VITE_BACKEND_URL}/videoCall/${params.uid}`)
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Authentication>
        <Toaster position="bottom-right" />
        <RouterProvider router={router} />
      </Authentication>
    </QueryClientProvider>
  </React.StrictMode>
);



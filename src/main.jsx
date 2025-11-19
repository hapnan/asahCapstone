import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "./lib/themeContext.jsx";
import "./index.css";
import Page from "./app/dashboard/page.jsx";
import LoginPage from "./app/login/page.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Page />,
  },
  {
    path:"/login",
    element: <LoginPage />,
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);

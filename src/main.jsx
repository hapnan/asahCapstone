import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ThemeProvider } from "./lib/themeContext.jsx";
import { AuthProvider, useAuth } from "./lib/authContext.jsx";
import { TwilioProvider } from "./lib/twilioContext.jsx";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";

const router = createRouter({
  routeTree,
  context: {
    auth: undefined,
  },
});

export default function App() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <TwilioProvider>
          <App />
          <Toaster />
        </TwilioProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

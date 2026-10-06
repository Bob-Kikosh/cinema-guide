import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";
import AuthProvider from "./context/AuthProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: "#22222a",
          color: "#fff",
          borderRadius: "10px",
        },
      }}
    />
  </StrictMode>
);

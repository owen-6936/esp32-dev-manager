import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { useGLTF } from "@react-three/drei";

// Preload the GLTF model
useGLTF.preload("/models/esp32-s3-draco.glb");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Wrap the entire app in AliveScope */}
    <RouterProvider router={router} />
  </StrictMode>,
);

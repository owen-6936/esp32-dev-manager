import { Canvas, useLoader } from "@react-three/fiber";
import { Stage, OrbitControls, Html, Preload } from "@react-three/drei";
import { Suspense, useEffect, useState, useRef } from "react";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";

export default function ESP32Visual() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection observer to lazy-load only when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[600px] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-6 flex flex-col items-center justify-center overflow-hidden"
    >
      <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-glow mb-3 text-center">
        ESP32-S3 3D Interactive Overview
      </h2>
      <p className="text-blue-200 text-center max-w-xl mx-auto mb-6">
        Drag to rotate, scroll or pan to zoom, and get a closer look at its key
        components.
      </p>

      <div className="relative w-full h-[350px] md:h-[500px]">
        {visible && (
          <Canvas
            shadows
            camera={{ position: [0, 1.5, 3], fov: 45 }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            performance={{ min: 0.5 }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-5, 5, 5]} intensity={0.8} />
            <spotLight
              position={[0, 5, 0]}
              angle={0.4}
              penumbra={0.5}
              intensity={0.9}
              castShadow
            />

            <Suspense
              fallback={
                <Html center>
                  <span className="text-white text-lg">
                    Loading ESP32-S3...
                  </span>
                </Html>
              }
            >
              <Stage
                shadows="contact"
                adjustCamera={false}
                intensity={0} // disable stage lights
              >
                <ESP32Model />
              </Stage>
            </Suspense>

            <OrbitControls
              enablePan
              enableZoom
              enableRotate
              maxPolarAngle={Math.PI / 2}
              minDistance={2}
              maxDistance={6}
            />

            <Preload all />
          </Canvas>
        )}
      </div>
    </section>
  );
}

function ESP32Model() {
  const { scene } = useLoader(
    GLTFLoader,
    "/models/esp32-s3-draco.glb",
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);
    },
  );
  return <primitive object={scene} scale={35} position={[0, -0.5, 0]} />;
}

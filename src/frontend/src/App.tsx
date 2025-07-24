import "@xyflow/react/dist/style.css";
import "./styles/performance.css";
import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { LoadingPage } from "./pages/LoadingPage";
import router from "./routes";
import { useDarkStore } from "./stores/darkStore";
import { useIconPreloader } from "./hooks/use-icon-preloader";
import IconPerformanceMonitor from "./components/IconPerformanceMonitor";

export default function App() {
  const dark = useDarkStore((state) => state.dark);
  
  // Preload critical icons for better performance
  const { isPreloading, preloadComplete, error: preloadError } = useIconPreloader(true);
  
  useEffect(() => {
    if (!dark) {
      document.getElementById("body")!.classList.remove("dark");
    } else {
      document.getElementById("body")!.classList.add("dark");
    }
  }, [dark]);
  
  // Log preloading status for debugging
  useEffect(() => {
    if (preloadComplete) {
      console.log('✅ Icon preloading completed');
    }
    if (preloadError) {
      console.warn('⚠️ Icon preloading error:', preloadError);
    }
  }, [preloadComplete, preloadError]);
  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        <RouterProvider router={router} />
      </Suspense>
      <IconPerformanceMonitor enabled={process.env.NODE_ENV === 'development'} />
    </>
  );
}

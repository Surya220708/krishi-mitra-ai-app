import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary text-primary-foreground">
      <div className="text-center animate-slide-up">
        <h1 className="mb-4 text-4xl font-bold">🌾 Welcome to KrishiMitra AI</h1>
        <p className="text-xl text-primary-foreground/90 mb-6">Your smart farming companion is loading...</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-foreground"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

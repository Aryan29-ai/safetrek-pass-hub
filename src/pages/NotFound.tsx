import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-2xl font-semibold text-foreground">Oops! Page not found</p>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <a 
          href="/" 
          className="inline-block mt-4 px-6 py-3 bg-gradient-hero text-primary-foreground rounded-lg hover:shadow-lg transition-all hover:scale-105 font-semibold"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

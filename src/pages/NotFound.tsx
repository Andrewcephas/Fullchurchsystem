import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Search, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10 max-w-md"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
          <AlertCircle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-8xl font-black mb-4 tracking-tighter text-foreground">404</h1>
        <h2 className="text-3xl font-black mb-6 tracking-tight text-foreground">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-10 font-medium leading-relaxed">
          It seems the page you're looking for has been moved or doesn't exist. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Home className="mr-2 h-5 w-5" /> BACK TO HOME
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-2xl border-2 border-muted hover:bg-muted font-black transition-all hover:scale-105 active:scale-95">
              <Search className="mr-2 h-5 w-5" /> CONTACT SUPPORT
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

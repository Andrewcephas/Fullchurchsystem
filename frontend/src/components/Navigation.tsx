import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, Calendar, Book, Heart, Play, Phone, ChevronDown, ShieldCheck, Quote, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { motion, AnimatePresence } from "framer-motion";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { settings } = useSiteSettings();
  const isHomePage = location.pathname === "/";

  const navItems = [
    {
      name: "About", href: "/about", icon: Users, hasDropdown: true,
      dropdownItems: [
        { name: "Our Story", href: "/about/our-story" },
        { name: "Mission", href: "/about/mission" },
        { name: "Leadership", href: "/about/leadership" }
      ]
    },
    { name: "Ministries", href: "/ministries", icon: Users },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Sermons", href: "/sermons", icon: Book },
    { name: "Give", href: "/give", icon: Heart },
    { name: "Quotes", href: "/quotes", icon: Quote },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowAboutDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowAboutDropdown(false), 200);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || !isHomePage ? 'glass-navbar py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.img 
              whileHover={{ scale: 1.1, rotate: 5 }}
              src="/images/gpc-logo.png" 
              alt="GPC Logo" 
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors" 
            />
            <div className="flex flex-col">
              <span className={`font-bold text-xl leading-none tracking-tight transition-colors ${scrolled || !isHomePage ? 'text-foreground' : 'text-white'}`}>Global Power Church</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Experience God's Power</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div ref={dropdownRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <Link to={item.href} className={`flex items-center gap-1 px-4 py-2 text-sm font-bold transition-all rounded-full ${location.pathname.startsWith(item.href) ? 'text-primary bg-primary/10' : (scrolled || !isHomePage) ? 'text-foreground hover:text-primary' : 'text-white/90 hover:text-white'}`}>
                      {item.name}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showAboutDropdown ? 'rotate-180' : ''}`} />
                    </Link>
                    <AnimatePresence>
                      {showAboutDropdown && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-1 w-64 bg-background/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-primary/10 py-3 z-[100]"
                        >
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link key={dropdownItem.name} to={dropdownItem.href} className="block px-4 py-2.5 text-sm text-popover-foreground hover:bg-primary/10 hover:text-primary transition-colors mx-2 rounded-xl" onClick={() => setShowAboutDropdown(false)}>
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link to={item.href} className={`px-4 py-2 text-sm font-bold transition-all rounded-full ${location.pathname === item.href ? 'text-primary bg-primary/10' : (scrolled || !isHomePage) ? 'text-foreground hover:text-primary' : 'text-white/90 hover:text-white'}`}>
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="rounded-full border-primary/50 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-primary/20">
                <Play className="h-4 w-4 mr-2" />Watch Live
              </Button>
            </a>
            <Link to="/login">
              <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                <ShieldCheck className="h-4 w-4 mr-2" />Admin
              </Button>
            </Link>
            <Link to="/admin/notifications" className="relative">
              <Button variant="ghost" size="icon" className={`rounded-full ${(scrolled || !isHomePage) ? 'hover:bg-primary/10' : 'text-white hover:bg-white/10'}`}>
                <Bell className="h-5 w-5" />
              </Button>
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">!</span>
            </Link>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className={`rounded-full ${(scrolled || !isHomePage) ? 'hover:bg-primary/10' : 'text-white hover:bg-white/10'}`}><Menu className="h-6 w-6" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-xl border-l border-white/10">
              <div className="flex flex-col space-y-6 mt-8 px-2">
                <div className="flex items-center gap-3 mb-8">
                  <img src="/images/gpc-logo.png" alt="GPC Logo" className="w-12 h-12 rounded-full object-cover shadow-lg" />
                  <div className="flex flex-col">
                    <span className="font-bold text-xl text-foreground">Global Power</span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Experience Power</span>
                  </div>
                </div>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                      <div key={item.name}>
                        <Link 
                          to={item.href} 
                          className={`flex items-center gap-4 px-4 py-3 text-lg font-semibold rounded-2xl transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`} 
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon className="h-5 w-5" />{item.name}
                        </Link>
                        {item.hasDropdown && (
                          <div className="ml-12 mt-2 space-y-1 border-l-2 border-primary/10 pl-4">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link key={dropdownItem.name} to={dropdownItem.href} className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium" onClick={() => setIsOpen(false)}>
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="pt-8 space-y-4 border-t border-border">
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="block w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full rounded-2xl border-primary text-primary hover:bg-primary hover:text-white transition-all h-12 text-base font-semibold">
                      <Play className="h-5 w-5 mr-3" />Watch Live
                    </Button>
                  </a>
                  <Link to="/login" className="block w-full" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold shadow-xl shadow-primary/20">
                      <ShieldCheck className="h-5 w-5 mr-3" />Admin Login
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

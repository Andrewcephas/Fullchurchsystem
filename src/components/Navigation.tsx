import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, Calendar, Book, Heart, Play, Phone, ChevronDown, ShieldCheck } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { settings } = useSiteSettings();

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
    { name: "Contact", href: "/contact", icon: Phone },
  ];

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
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/gpc-logo.png" alt="GPC Logo" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-bold text-xl text-foreground">Global Power Church</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div ref={dropdownRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <Link to={item.href} className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                      {item.name}
                      <ChevronDown className={`h-4 w-4 transition-transform ${showAboutDropdown ? 'rotate-180' : ''}`} />
                    </Link>
                    {showAboutDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-popover rounded-md shadow-lg border border-border py-1 z-50">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link key={dropdownItem.name} to={dropdownItem.href} className="block px-4 py-2.5 text-sm text-popover-foreground hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setShowAboutDropdown(false)}>
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to={item.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                <Play className="h-4 w-4 mr-2" />Watch Live
              </Button>
            </a>
            <Link to="/login">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <ShieldCheck className="h-4 w-4 mr-2" />Admin
              </Button>
            </Link>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background">
              <div className="flex flex-col space-y-6 mt-6">
                <div className="flex items-center gap-2 mb-6">
                  <img src="/images/gpc-logo.png" alt="GPC Logo" className="w-10 h-10 rounded-full object-cover" />
                  <span className="font-bold text-xl text-foreground">Global Power Church</span>
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name}>
                      <Link to={item.href} className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                        <Icon className="h-5 w-5" />{item.name}
                      </Link>
                      {item.hasDropdown && (
                        <div className="ml-8 mt-2 space-y-2">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link key={dropdownItem.name} to={dropdownItem.href} className="block text-sm text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="border-t border-border pt-6 space-y-3">
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                      <Play className="h-4 w-4 mr-2" />Watch Live
                    </Button>
                  </a>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-3">
                      <ShieldCheck className="h-4 w-4 mr-2" />Admin Login
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

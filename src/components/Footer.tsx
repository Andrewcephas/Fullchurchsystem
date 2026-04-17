import { Link } from "react-router-dom";
import { Phone, Mail, ExternalLink } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

const Footer = () => {
  const { settings } = useSiteSettings();
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello Global Power Church")}`;

  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/gpc-logo.png" alt="GPC Logo" className="w-10 h-10 rounded-full object-cover" />
              <span className="font-bold text-lg">Global Power Church</span>
            </div>
            <p className="text-accent-foreground/70 text-sm mb-4">A spirit-filled ministry led by Bishop Paul Ndolo Mulu. Jeremiah 1:10</p>
            <div className="space-y-2 text-sm text-accent-foreground/70">
              <a href={`tel:+${settings.whatsapp}`} className="flex items-center gap-2 hover:text-secondary transition-colors"><Phone className="h-4 w-4" />{settings.phone}</a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-secondary transition-colors"><Mail className="h-4 w-4" />{settings.email}</a>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm text-accent-foreground/70">
              <Link to="/about" className="block hover:text-secondary transition-colors">About Us</Link>
              <Link to="/ministries" className="block hover:text-secondary transition-colors">Ministries</Link>
              <Link to="/events" className="block hover:text-secondary transition-colors">Events</Link>
              <Link to="/sermons" className="block hover:text-secondary transition-colors">Sermons</Link>
              <Link to="/give" className="block hover:text-secondary transition-colors">Give</Link>
              <Link to="/contact" className="block hover:text-secondary transition-colors">Contact</Link>
              <Link to="/prayer-request" className="block hover:text-secondary transition-colors">Prayer Request</Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Service Times</h3>
            <div className="space-y-2 text-sm text-accent-foreground/70">
              {settings.services.map((s, i) => (
                <p key={i}>{s.title} — {s.time}</p>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Connect With Us</h3>
            <div className="space-y-2 text-sm text-accent-foreground/70">
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-secondary transition-colors"><ExternalLink className="h-4 w-4" />YouTube</a>
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-secondary transition-colors"><ExternalLink className="h-4 w-4" />Facebook Group</a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-secondary transition-colors"><ExternalLink className="h-4 w-4" />WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-accent-foreground/20 py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-sm text-accent-foreground/50">
          <p>© {new Date().getFullYear()} Global Power Church. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed by{" "}<a href="https://catech.co.ke" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-secondary/80 transition-colors">Catech Solutions & Graphics</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from "react-router-dom";
import { Phone, Mail, ExternalLink, ArrowUpCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { motion } from "framer-motion";

const Footer = () => {
  const { settings } = useSiteSettings();
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello Global Power Church")}`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#050505] text-white border-t border-white/10">
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/images/gpc-logo.png" alt="GPC Logo" className="w-12 h-12 rounded-full object-cover shadow-2xl border-2 border-primary/20" />
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight">Global Power Church</span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Experience Power</span>
              </div>
            </div>
            <p className="text-white/80 text-base leading-relaxed max-w-xs font-medium">
              A spirit-filled ministry led by Bishop Paul Ndolo Mulu. Empowering lives through the word and power of God.
            </p>
            <div className="space-y-4 pt-2">
              <a href={`tel:+${settings.whatsapp}`} className="flex items-center gap-3 text-white/70 hover:text-secondary transition-all group font-semibold">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-white/70 hover:text-secondary transition-all group font-semibold">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                {settings.email}
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black mb-8 tracking-tight text-white/90">Quick Exploration</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              <Link to="/about" className="text-white/80 hover:text-secondary transition-all font-semibold flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" /> About Us
              </Link>
              <Link to="/ministries" className="text-white/80 hover:text-secondary transition-all font-semibold flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" /> Ministries
              </Link>
              <Link to="/events" className="text-white/80 hover:text-secondary transition-all font-semibold flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" /> Events
              </Link>
              <Link to="/sermons" className="text-white/80 hover:text-secondary transition-all font-semibold flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" /> Sermons
              </Link>
              <Link to="/give" className="text-white/80 hover:text-secondary transition-all font-semibold flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" /> Give
              </Link>
              <Link to="/contact" className="text-white/80 hover:text-secondary transition-all font-semibold flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" /> Contact
              </Link>
              <Link to="/prayer-request" className="text-white/80 hover:text-secondary transition-all font-semibold flex items-center gap-2 col-span-2">
                <div className="w-1 h-1 bg-primary rounded-full" /> Prayer Request
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black mb-8 tracking-tight text-white/90">Join Our Services</h3>
            <div className="space-y-4">
              {settings.services.map((s, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-primary/20 transition-all group">
                  <p className="font-black text-primary text-sm group-hover:text-secondary transition-colors">{s.title}</p>
                  <p className="text-white/80 text-xs font-bold mt-1 tracking-wider uppercase">{s.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black mb-8 tracking-tight text-white/90">Stay Connected</h3>
            <div className="space-y-4">
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-red-600/10 border border-red-600/20 hover:bg-red-600 hover:text-white transition-all group font-bold">
                <span className="flex items-center gap-3">YouTube</span>
                <ExternalLink className="h-5 w-5" />
              </a>
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-blue-600/10 border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all group font-bold">
                <span className="flex items-center gap-3">Facebook Group</span>
                <ExternalLink className="h-5 w-5" />
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-green-600/10 border border-green-600/20 hover:bg-green-600 hover:text-white transition-all group font-bold">
                <span className="flex items-center gap-3">WhatsApp Community</span>
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-8 bg-black/20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-white/70 text-sm font-bold tracking-tight">© {new Date().getFullYear()} Global Power Church. All rights reserved.</p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1 font-black">Jeremiah 1:10 — Kingdom Mandate</p>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white/40 hover:text-primary transition-all font-bold group"
          >
            <span className="text-xs uppercase tracking-widest">Back to top</span>
            <ArrowUpCircle className="h-8 w-8 group-hover:-translate-y-1 transition-transform" />
          </button>

          <p className="text-white/40 text-sm font-bold tracking-tight">
            Built by <a href="https://catech.co.ke" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-all border-b border-primary/20 hover:border-secondary">Catech Solutions</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

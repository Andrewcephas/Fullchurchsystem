import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Quote, RefreshCw, Copy, Share2 } from "lucide-react";

interface QuoteItem {
  id: string;
  theme: string;
  quote_text: string;
  author: string | null;
  reference: string | null;
}

const Quotes = () => {
  const [themes, setThemes] = useState<{ value: string; label: string }[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("Faith");
  const [quote, setQuote] = useState<QuoteItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch available themes
    const fetchThemes = async () => {
      const response = await apiService.request('/social-quotes/themes/', { method: 'GET' });
      if (response.data) {
        setThemes(response.data as { value: string; label: string }[]);
      }
    };
    fetchThemes();
  }, []);

  const generateQuote = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.generateSocialQuotes(selectedTheme);
      if (response.data?.quotes && response.data.quotes.length > 0) {
        setQuote(response.data.quotes[0]);
      } else if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!quote) return;
    const textToCopy = `"${quote.quote_text}"\n\n${quote.author ? `- ${quote.author}` : ''} ${quote.reference ? `(${quote.reference})` : ''}\n\nVia Global Power Church`;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied!",
      description: "Quote copied to clipboard. Ready to share!",
    });
  };

  const downloadAsImage = () => {
    if (!quote) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas size for high resolution shareable image
    canvas.width = 1080;
    canvas.height = 1080;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "#f3f4f6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Draw a nice border
    ctx.strokeStyle = "#6b21a8"; // primary color
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, 1000, 1000);

    // Watermark Logo
    const logo = new Image();
    logo.crossOrigin = "anonymous";
    logo.src = "/images/logo.png";
    logo.onload = () => {
      // Draw watermark in center
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.drawImage(logo, 1080 / 2 - 250, 1080 / 2 - 250, 500, 500);
      ctx.restore();

      // Draw small logo at bottom
      ctx.globalAlpha = 0.2;
      ctx.drawImage(logo, 1080 / 2 - 40, 900, 80, 80);
      ctx.globalAlpha = 1.0;

      // Text settings
      ctx.fillStyle = "#111827";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Quote Text wrapping
      ctx.font = "italic bold 64px 'Outfit', sans-serif";
      const words = quote.quote_text.split(" ");
      let line = "";
      let lines = [];
      const maxWidth = 850;
      
      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      let totalHeight = lines.length * 80;
      let startY = 1080 / 2 - totalHeight / 2 - 40;
      
      lines.forEach((l, i) => {
        ctx.fillText(`"${l.trim()}"`, 1080 / 2, startY + i * 85);
      });

      // Author
      if (quote.author) {
        ctx.fillStyle = "#6b21a8"; // primary color
        ctx.font = "bold 44px 'Outfit', sans-serif";
        ctx.fillText(`— ${quote.author}`, 1080 / 2, startY + totalHeight + 80);
      }

      // Branding Text
      ctx.fillStyle = "#6b7280";
      ctx.font = "600 24px 'Inter', sans-serif";
      ctx.fillText("GLOBAL POWER CHURCH", 1080 / 2, 1010);

      // Trigger Download as JPG
      try {
        const link = document.createElement("a");
        link.download = `GlobalPowerChurch_Quote_${selectedTheme}_${Date.now()}.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();
        
        toast({
          title: "Success!",
          description: "Your quote has been downloaded as a premium image.",
        });
      } catch (err) {
        toast({
          title: "Download Failed",
          description: "Could not generate image. Try copying text instead.",
          variant: "destructive"
        });
      }
    };
    
    logo.onerror = () => {
      toast({
        title: "Logo Error",
        description: "Could not load branding for the image. Continuing without watermark.",
        variant: "destructive"
      });
      // Fallback if logo fails
      // ... (can add logic here)
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center justify-center">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none font-bold shadow-inner">
              <Sparkles className="w-4 h-4 mr-2 inline" /> INSPIRATION & WISDOM
            </Badge>
            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter text-foreground leading-tight">
              Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Quotes</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              Generate and share powerful, faith-filled quotes curated for the Global Power Church family.
            </p>
          </motion.div>

          <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-3xl rounded-[3rem] overflow-hidden border border-white/20">
            <CardContent className="p-6 md:p-12">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-10 items-center justify-center">
                <div className="w-full md:w-64">
                  <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                    <SelectTrigger className="h-14 rounded-2xl bg-muted/50 border-2 focus:ring-primary">
                      <SelectValue placeholder="Select Theme" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {themes.map((t) => (
                        <SelectItem key={t.value} value={t.value} className="rounded-lg">{t.label}</SelectItem>
                      ))}
                      {themes.length === 0 && (
                        <SelectItem value="Faith" className="rounded-lg">Faith</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  size="lg" 
                  onClick={generateQuote} 
                  disabled={isLoading}
                  className="w-full md:w-auto h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  {isLoading ? (
                    <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-5 w-5 mr-2" />
                  )}
                  Generate Quote
                </Button>
              </div>

              <div className="relative min-h-[300px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {quote ? (
                    <motion.div
                      key={quote.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                      className="w-full relative"
                    >
                      <Quote className="absolute -top-6 -left-2 md:-top-10 md:-left-6 w-16 h-16 md:w-24 md:h-24 text-primary/10 -z-10 rotate-180" />
                      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-6 md:p-12 border border-white/40 shadow-inner text-center">
                        <p className="text-2xl md:text-5xl font-black text-foreground mb-8 leading-tight tracking-tight px-2">
                          "{quote.quote_text}"
                        </p>
                        <div className="flex flex-col items-center justify-center space-y-2">
                          {quote.author && (
                            <p className="text-lg md:text-xl font-bold text-primary">— {quote.author}</p>
                          )}
                          {quote.reference && (
                            <Badge variant="outline" className="text-xs md:text-sm font-semibold rounded-full px-4 py-1 border-primary/30 text-primary">
                              {quote.reference}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <Button 
                          variant="outline" 
                          size="lg" 
                          onClick={copyToClipboard}
                          className="rounded-full font-bold border-2 hover:bg-primary/10 transition-all shadow-sm h-12 md:h-14"
                        >
                          <Copy className="w-5 h-5 mr-2" /> Copy Text
                        </Button>
                        <Button 
                          variant="default" 
                          size="lg" 
                          onClick={downloadAsImage}
                          className="rounded-full font-bold bg-secondary hover:bg-secondary/90 text-white transition-all shadow-lg h-12 md:h-14"
                        >
                          <Share2 className="w-5 h-5 mr-2" /> Download JPG
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground flex flex-col items-center justify-center h-full"
                    >
                      <Quote className="w-16 h-16 mb-4 text-muted/30" />
                      <p className="text-lg font-medium">Select a theme and generate a quote to get started.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Quotes;

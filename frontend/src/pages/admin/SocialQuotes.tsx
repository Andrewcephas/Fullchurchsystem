import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Sparkles, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";

const themes = ["Faith", "Prayer", "Love", "Hope", "Worship", "Grace", "Strength", "Healing", "Salvation", "Peace"];

const SocialQuotes = () => {
  const [theme, setTheme] = useState("Faith");
  const [quotes, setQuotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

   const generateQuotes = async () => {
     setLoading(true);
     try {
       const response = await apiService.generateSocialQuotes(theme);
       if (response.error) throw new Error(response.error);
       // Backend returns { quotes: [{quote_text, author, reference, ...}] }
       const quoteObjects = response.data?.quotes || [];
       const quoteTexts = quoteObjects.map((q: { quote_text: string }) => q.quote_text);
       setQuotes(quoteTexts);
     } catch {
       toast({ title: "Error generating quotes", variant: "destructive" });
     }
     setLoading(false);
   };

  const copyQuote = (q: string) => {
    navigator.clipboard.writeText(q);
    toast({ title: "Quote copied to clipboard!" });
  };

   const downloadAsImage = async (q: string, index: number) => {
     const canvas = document.createElement("canvas");
     canvas.width = 1080;
     canvas.height = 1080;
     const ctx = canvas.getContext("2d")!;

     // Nature background gradient (deep forest green to serene blue)
     const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
     bgGrad.addColorStop(0, "#0f4c3a");
     bgGrad.addColorStop(0.5, "#1e7a5c");
     bgGrad.addColorStop(1, "#0f4c3a");
     ctx.fillStyle = bgGrad;
     ctx.fillRect(0, 0, 1080, 1080);

     // Add subtle texture/noise for depth
     ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
     for (let i = 0; i < 5000; i++) {
       ctx.fillRect(Math.random() * 1080, Math.random() * 1080, 2, 2);
     }

     // Gold border
     ctx.strokeStyle = "#d4a843";
     ctx.lineWidth = 16;
     ctx.strokeRect(40, 40, 1000, 1000);

     // Inner glow border
     ctx.strokeStyle = "rgba(212, 168, 67, 0.3)";
     ctx.lineWidth = 4;
     ctx.strokeRect(56, 56, 968, 968);

     // Load and draw church logo watermark (semi-transparent)
     try {
       const logoImg = new Image();
       logoImg.crossOrigin = "anonymous";
       await new Promise<void>((resolve, reject) => {
         logoImg.onload = () => resolve();
         logoImg.onerror = reject;
         logoImg.src = "/images/gpc-logo.png";
       });
       ctx.globalAlpha = 0.15;
       const logoSize = 200;
       ctx.drawImage(logoImg, 540 - logoSize/2, 540 - logoSize/2, logoSize, logoSize);
       ctx.globalAlpha = 1.0;
     } catch (err) {
       console.warn("Could not load watermark logo:", err);
     }

     // Quote text with shadow
     ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
     ctx.shadowBlur = 10;
     ctx.shadowOffsetX = 3;
     ctx.shadowOffsetY = 3;
     ctx.fillStyle = "#ffffff";
     ctx.font = "bold 44px Georgia, serif";
     ctx.textAlign = "center";
     ctx.textBaseline = "middle";

// Word wrap
      const words = q.split(" ");
      const lines: string[] = [];
     let currentLine = "";
     words.forEach((word) => {
       const test = currentLine + (currentLine ? " " : "") + word;
       if (ctx.measureText(test).width > 920) {
         lines.push(currentLine);
         currentLine = word;
       } else {
         currentLine = test;
       }
     });
     if (currentLine) lines.push(currentLine);
     const lineHeight = 58;
     const totalHeight = lines.length * lineHeight;
     const startY = 540 - totalHeight / 2 + lineHeight / 2;

     lines.forEach((line, i) => {
       ctx.fillText(line, 540, startY + i * lineHeight);
     });

     // Reset shadow
     ctx.shadowColor = "transparent";
     ctx.shadowBlur = 0;
     ctx.shadowOffsetX = 0;
     ctx.shadowOffsetY = 0;

     // Church name with decorative line
     ctx.fillStyle = "#d4a843";
     ctx.font = "bold 26px Arial, sans-serif";
     ctx.fillText("— Global Power Church", 540, 940);

     const link = document.createElement("a");
     link.download = `gpc-quote-${index + 1}.png`;
     link.href = canvas.toDataURL("image/png");
     link.click();
   };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Social Media Quotes</h2>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Generate Quotes</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{themes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={generateQuotes} disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Sparkles className="h-4 w-4 mr-2" />{loading ? "Generating..." : "Generate Quotes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {quotes.length > 0 && (
        <div className="grid gap-4">
          {quotes.map((q, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <p className="text-foreground mb-4 text-lg italic">"{q}"</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => copyQuote(q)}>
                    <Copy className="h-3 w-3 mr-1" />Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => downloadAsImage(q, i)}>
                    <Download className="h-3 w-3 mr-1" />Download Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialQuotes;

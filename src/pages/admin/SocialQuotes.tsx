import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Sparkles, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const themes = ["Faith", "Prayer", "Love", "Hope", "Worship", "Grace", "Strength", "Healing", "Salvation", "Peace"];

const SocialQuotes = () => {
  const [theme, setTheme] = useState("Faith");
  const [quotes, setQuotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateQuotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quotes", {
        body: { theme },
      });
      if (error) throw error;
      setQuotes(data.quotes || []);
    } catch {
      toast({ title: "Error generating quotes", variant: "destructive" });
    }
    setLoading(false);
  };

  const copyQuote = (q: string) => {
    navigator.clipboard.writeText(q);
    toast({ title: "Quote copied to clipboard!" });
  };

  const downloadAsImage = (q: string, index: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d")!;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, "#6b21a8");
    grad.addColorStop(1, "#4c1d95");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Gold border
    ctx.strokeStyle = "#d4a843";
    ctx.lineWidth = 16;
    ctx.strokeRect(40, 40, 1000, 1000);

    // Quote text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px serif";
    ctx.textAlign = "center";
    const words = q.split(" ");
    let lines: string[] = [];
    let currentLine = "";
    words.forEach((word) => {
      const test = currentLine + (currentLine ? " " : "") + word;
      if (ctx.measureText(test).width > 880) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = test;
      }
    });
    if (currentLine) lines.push(currentLine);
    const lineHeight = 56;
    const startY = 540 - (lines.length * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, 540, startY + i * lineHeight);
    });

    // Church name
    ctx.fillStyle = "#d4a843";
    ctx.font = "bold 28px sans-serif";
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

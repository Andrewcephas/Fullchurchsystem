import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Eye, EyeOff, Lock, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const getRedirectPath = (role: string | undefined): string => {
  switch (role) {
    case "super_admin":
    case "secretary":
      return "/admin";
    case "branch_admin":
      return "/admin";
    case "sunday_school_teacher":
      return "/admin/sunday-school";
    default:
      return "/admin";
  }
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, loading, user } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      toast({ title: "Login successful", description: "Welcome back!" });
      const redirectPath = getRedirectPath(user?.role);
      navigate(redirectPath);
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-none shadow-3xl overflow-hidden rounded-[3rem] bg-background/80 backdrop-blur-xl">
          <CardHeader className="text-center pt-12 pb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <img 
                src="/images/gpc-logo.jpg" 
                alt="GPC Logo" 
                className="w-24 h-24 mx-auto rounded-[2rem] object-cover relative z-10 border-4 border-white shadow-2xl" 
              />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight mb-2 flex items-center justify-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary" /> Admin Portal
            </CardTitle>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Global Power Church Management</p>
          </CardHeader>
          <CardContent className="px-10 pb-12">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address (Gmail)</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input 
                    id="username" 
                    type="email" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    placeholder="yourname@gmail.com" 
                    className="h-14 pl-12 rounded-2xl border-2 border-muted bg-muted/20 focus:border-primary/50 focus:bg-background transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password (Phone Number)</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="Your phone number" 
                    className="h-14 pl-12 pr-12 rounded-2xl border-2 border-muted bg-muted/20 focus:border-primary/50 focus:bg-background transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 mt-4" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 animate-spin" /> SIGNING IN...
                  </span>
                ) : "SIGN IN TO PORTAL"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center mt-8 text-muted-foreground font-medium text-sm">
          Protected by Divine Security & Advanced Encryption
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

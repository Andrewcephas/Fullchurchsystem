import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src="/images/gpc-logo.jpg" alt="GPC Logo" className="w-20 h-20 mx-auto rounded-full object-cover mb-4 border-4 border-secondary" />
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" /> Admin Login
          </CardTitle>
          <p className="text-muted-foreground text-sm">Global Power Church Management System</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="admin" />
            </div>
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••" 
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[30px] text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

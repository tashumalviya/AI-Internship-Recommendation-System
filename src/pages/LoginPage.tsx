import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fake auth - allow any email but require it to exist in localStorage
    // For this prototype, we'll just log them in if email exists in localStorage
    // or create a dummy user if they use test@example.com
    
    try {
      const storedUserRaw = localStorage.getItem("user");
      const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
      
      if (email === "test@example.com" && password === "password") {
        login({
          name: "Test User",
          email: "test@example.com",
          skills: ["React", "JavaScript"],
          preferredRole: "Frontend Dev"
        });
        setLocation("/dashboard");
      } else if (storedUser && storedUser.email === email) {
        login(storedUser);
        setLocation("/dashboard");
      } else {
        setError("Invalid credentials. Please try again or sign up.");
      }
    } catch (err) {
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 font-bold text-3xl tracking-tight">
            <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <Briefcase className="h-8 w-8 text-primary-foreground" />
            </div>
            InternAI
          </div>
        </div>
        
        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline" onClick={(e) => e.preventDefault()}>
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-4">
              <Button type="submit" className="w-full h-11 text-base shadow-md hover-elevate group">
                Sign in
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary font-semibold hover:underline">
                  Sign up
                </Link>
              </div>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-lg text-xs text-center border border-border/50">
                <p className="font-semibold mb-1">Demo Credentials:</p>
                <p className="text-muted-foreground">Email: test@example.com</p>
                <p className="text-muted-foreground">Password: password</p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";
import { useNavigate, Link } from "react-router-dom";

interface LoginFormProps {
  onBack?: () => void;
}

const LoginForm = ({ onBack }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        // Sign up flow - don't require email confirmation
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("Account already exists", {
              description: "Please sign in instead or use a different email address."
            });
          } else {
            toast.error("Sign up failed", {
              description: error.message
            });
          }
        } else if (data.user) {
          toast.success("Account created successfully!");
          navigate("/community");
        }
      } else {
        // Sign in flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Email not confirmed")) {
            toast.error("Please verify your email", {
              description: "Check your inbox and click the verification link before signing in."
            });
          } else if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid credentials", {
              description: "Please check your email and password and try again."
            });
          } else {
            toast.error("Sign in failed", {
              description: error.message
            });
          }
        } else if (data.user) {
          toast.success("Welcome back!");
          navigate("/community");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Something went wrong", {
        description: "Please try again or contact support if the issue persists."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast.error("Google sign-in failed", {
          description: error.message
        });
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Something went wrong", {
        description: "Please try again later."
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-swap-lightBlue to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 p-0 h-auto text-swap-blue hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isSignup ? "Create your account" : "Welcome back"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isSignup 
                ? "Join SwapSpot to find your perfect housing exchange" 
                : "Sign in to your SwapSpot account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full h-11 border-gray-300 hover:bg-gray-50"
            >
              {isGoogleLoading ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </span>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-gray-300 focus:border-swap-blue focus:ring-swap-blue"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-gray-300 focus:border-swap-blue focus:ring-swap-blue"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-swap-blue hover:bg-swap-darkBlue text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isSignup ? "Creating account..." : "Signing in..."}
                  </span>
                ) : (
                  isSignup ? "Create account" : "Sign in"
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                {isSignup ? "Already have an account?" : "Don't have an account?"}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={isSignup ? () => setIsSignup(false) : handleCreateAccount}
                className="w-full h-11 border-gray-300 text-swap-blue hover:bg-swap-lightBlue hover:border-swap-blue"
              >
                {isSignup ? "Sign in instead" : "Create an account"}
              </Button>
            </div>

            <div className="text-center">
              <Link 
                to="/" 
                className="text-sm text-swap-blue hover:underline"
              >
                ← Back to homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;

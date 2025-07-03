import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Crown, Instagram, Phone, MessageSquare, Sparkles, Check, Eye, Users, Shield, Star, Lock, Mail } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

interface MessagingDialogProps {
  recipientName: string;
  listingTitle: string;
  listingLocation: string;
  contactInfo?: {
    instagram?: string;
    whatsapp?: string;
    snapchat?: string;
    email?: string;
  };
  buttonVariant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  buttonText?: string;
  className?: string;
}

// Confetti component
const Confetti = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string, delay: number}>>([]);

  useEffect(() => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 3
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 animate-float-up"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: '3s'
          }}
        />
      ))}
    </div>
  );
};

export default function MessagingDialog({
  recipientName,
  listingTitle,
  listingLocation,
  contactInfo,
  buttonVariant = "default",
  buttonText = "View Contact Info",
  className
}: MessagingDialogProps) {
  const { subscriptionData, user, loading } = useSubscription();
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const hasPaid = subscriptionData?.subscribed || false;

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please sign up first to access SwapSpot");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {},
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        console.error("Checkout error:", error);
        toast.error("Failed to start payment. Please try again.");
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSendMatch = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('send-match-email', {
        body: {
          recipientName,
          listingTitle,
          listingLocation,
          contactInfo
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        console.error("Error sending match email:", error);
        toast.error("Failed to send match notification");
        return;
      }

      toast.success("Match notification sent! Check your email for contact details.");
    } catch (error) {
      console.error("Error sending match:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDemoPayment = () => {
    setShowCongratulations(true);
    setShowConfetti(true);
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    toast.success("🎉 Welcome to SwapSpot! Payment successful!");
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={buttonVariant} className={className}>
            <MessageCircle className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {showCongratulations && <Sparkles className="h-5 w-5 text-yellow-500" />}
              {hasPaid || showCongratulations 
                ? `Connect with ${recipientName}` 
                : `Access Required`
              }
            </DialogTitle>
            <DialogDescription>
              {hasPaid || showCongratulations
                ? `Send a match request for "${listingTitle}" in ${listingLocation}`
                : `You need SwapSpot access to connect with verified students`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {hasPaid || showCongratulations ? (
              // Show contact form for paid users
              <div className="space-y-4">
                {showCongratulations && (
                  <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Crown className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
                        <h3 className="text-lg font-bold text-yellow-800 mb-1">Payment Successful! 🎉</h3>
                        <p className="text-sm text-yellow-700">You now have full access to SwapSpot!</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      Request Match with {recipientName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">What happens next:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• You'll receive an email with {recipientName}'s contact information</li>
                        <li>• {recipientName} will be notified of your interest</li>
                        <li>• Both parties can then connect directly</li>
                      </ul>
                    </div>

                    <Button 
                      onClick={handleSendMatch}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={loading}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Match Request
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Show payment required for free users
              <div className="space-y-6">
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="h-6 w-6 text-red-500" />
                      <div>
                        <h3 className="font-semibold text-red-800">SwapSpot Access Required</h3>
                        <p className="text-sm text-red-600">Connect with verified students across Europe</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold text-blue-800">SwapSpot Access</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-blue-800">€25</span>
                      <span className="text-sm text-blue-600">one-time</span>
                    </div>
                    <p className="text-sm text-blue-700">Lifetime access to all features</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Connect with unlimited verified students</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Email notifications for all matches</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Access to all contact information</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Priority support</span>
                      </li>
                    </ul>
                    <Button 
                      onClick={handleDemoPayment}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Get SwapSpot Access'}
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-4 text-center text-xs">
                  <div className="flex flex-col items-center gap-1">
                    <Shield className="h-6 w-6 text-green-600" />
                    <span className="font-medium">Verified Students</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Users className="h-6 w-6 text-blue-600" />
                    <span className="font-medium">10,000+ Members</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Star className="h-6 w-6 text-yellow-600" />
                    <span className="font-medium">4.8/5 Rating</span>
                  </div>
                </div>

                <p className="text-xs text-center text-gray-500">
                  Secure payment • Money-back guarantee • One-time payment
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

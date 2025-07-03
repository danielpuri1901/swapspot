
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Shield, Star, Zap, MessageCircle, Users, Eye, X } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

interface PremiumFeaturesProps {
  className?: string;
}

export default function PremiumFeatures({ className }: PremiumFeaturesProps) {
  const { subscriptionData, isPremium, loading, user } = useSubscription();

  const handleUpgrade = async (tier: 'basic' | 'premium' | 'elite') => {
    if (!user) {
      toast.error("Please log in to upgrade your subscription");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        console.error("Checkout error:", error);
        toast.error("Failed to start checkout. Please try again.");
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

  const handleManageSubscription = async () => {
    if (!user) {
      toast.error("Please log in to manage your subscription");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        console.error("Portal error:", error);
        toast.error("Failed to open customer portal. Please try again.");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const subscriptionTiers = [
    {
      id: 'free',
      name: 'Free Browsing',
      price: '€0',
      period: 'forever',
      description: 'Browse student profiles and accommodations',
      features: [
        { name: 'Browse all listings', included: true },
        { name: 'View student profiles', included: true },
        { name: 'University verification', included: true },
        { name: 'Basic safety guidelines', included: true },
        { name: 'Contact information access', included: false },
        { name: 'Direct messaging', included: false },
        { name: 'Priority support', included: false },
        { name: 'Profile views tracking', included: false },
        { name: 'Premium badge', included: false },
        { name: 'Advanced matching', included: false },
        { name: 'Swap guarantee', included: false },
      ],
      buttonText: 'Current Plan',
      highlight: false,
    },
    {
      id: 'basic',
      name: 'Basic Connect',
      price: '€15',
      period: '/month',
      description: 'Connect with up to 5 students per month',
      features: [
        { name: 'Everything in Free', included: true },
        { name: '5 contact reveals per month', included: true },
        { name: 'Direct messaging (5 chats/month)', included: true },
        { name: 'Email support', included: true },
        { name: 'Profile views tracking', included: true },
        { name: 'Premium badge', included: false },
        { name: 'Priority support', included: false },
        { name: 'Advanced matching', included: false },
        { name: 'Swap guarantee', included: false },
        { name: 'Spotlighted listings', included: false },
        { name: 'Unlimited connections', included: false },
      ],
      buttonText: 'Get Basic',
      highlight: false,
    },
    {
      id: 'premium',
      name: 'Premium Connect',
      price: '€25',
      period: '/month',
      description: 'Unlimited connections with premium features',
      features: [
        { name: 'Everything in Basic', included: true },
        { name: 'Unlimited contact reveals', included: true },
        { name: 'Unlimited direct messaging', included: true },
        { name: 'Priority support (2h response)', included: true },
        { name: 'Advanced matching algorithm', included: true },
        { name: 'Premium badge', included: true },
        { name: 'Profile boost (2x visibility)', included: true },
        { name: 'Swap guarantee protection', included: false },
        { name: 'Spotlighted listings', included: false },
        { name: 'Concierge service', included: false },
        { name: 'Legal assistance', included: false },
      ],
      buttonText: 'Get Premium',
      highlight: true,
    },
    {
      id: 'elite',
      name: 'Elite Experience',
      price: '€45',
      period: '/month',
      description: 'Everything included with VIP treatment',
      features: [
        { name: 'Everything in Premium', included: true },
        { name: 'Swap guarantee protection', included: true },
        { name: 'Spotlighted listings (top placement)', included: true },
        { name: 'Personal concierge service', included: true },
        { name: 'Legal assistance & contracts', included: true },
        { name: '24/7 priority support', included: true },
        { name: 'Custom matching preferences', included: true },
        { name: 'Exclusive events access', included: true },
        { name: 'Travel insurance discount', included: true },
        { name: 'Multi-city planning', included: true },
        { name: 'VIP badge', included: true },
      ],
      buttonText: 'Get Elite',
      highlight: false,
    },
  ];

  const currentTier = subscriptionData?.subscription_tier || 'free';

  if (loading) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-8">
        {/* Current Plan Status */}
        <Card className={isPremium ? "border-yellow-200 bg-yellow-50" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentTier === 'elite' ? (
                    <>
                      <Crown className="h-5 w-5 text-purple-600" />
                      Elite Experience
                    </>
                  ) : currentTier === 'premium' ? (
                    <>
                      <Crown className="h-5 w-5 text-yellow-600" />
                      Premium Connect
                    </>
                  ) : currentTier === 'basic' ? (
                    <>
                      <Star className="h-5 w-5 text-blue-600" />
                      Basic Connect
                    </>
                  ) : (
                    "Free Browsing"
                  )}
                </CardTitle>
                <CardDescription>
                  {currentTier === 'elite' 
                    ? `You have elite access with all features${subscriptionData?.subscription_end ? ` until ${new Date(subscriptionData.subscription_end).toLocaleDateString()}` : ''}`
                    : currentTier === 'premium'
                    ? `You have unlimited connections and premium features${subscriptionData?.subscription_end ? ` until ${new Date(subscriptionData.subscription_end).toLocaleDateString()}` : ''}`
                    : currentTier === 'basic'
                    ? `You can connect with up to 5 students per month${subscriptionData?.subscription_end ? ` until ${new Date(subscriptionData.subscription_end).toLocaleDateString()}` : ''}`
                    : "Browse student profiles and accommodations. Upgrade to start connecting directly."
                  }
                </CardDescription>
              </div>
              <Badge variant={isPremium ? "default" : "secondary"}>
                {currentTier === 'elite' ? 'Elite' : currentTier === 'premium' ? 'Premium' : currentTier === 'basic' ? 'Basic' : 'Free'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {isPremium ? (
                <Button variant="outline" onClick={handleManageSubscription}>
                  Manage Subscription
                </Button>
              ) : (
                <Button onClick={() => handleUpgrade('basic')} className="bg-blue-600 hover:bg-blue-700">
                  <Star className="h-4 w-4 mr-2" />
                  Start with Basic - €15/month
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Plan</CardTitle>
            <CardDescription>
              Select the plan that best fits your student accommodation needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subscriptionTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative rounded-lg border p-6 ${
                    tier.highlight
                      ? 'border-yellow-300 bg-yellow-50 ring-2 ring-yellow-300'
                      : currentTier === tier.id
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-yellow-600 text-white">Most Popular</Badge>
                    </div>
                  )}
                  {currentTier === tier.id && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-600 text-white">Current Plan</Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                    <div className="mb-2">
                      <span className="text-3xl font-bold">{tier.price}</span>
                      <span className="text-gray-500">{tier.period}</span>
                    </div>
                    <p className="text-sm text-gray-600">{tier.description}</p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={feature.included ? '' : 'text-gray-500'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={currentTier === tier.id ? "outline" : tier.highlight ? "default" : "outline"}
                    disabled={currentTier === tier.id}
                    onClick={() => {
                      if (tier.id !== 'free' && currentTier !== tier.id) {
                        handleUpgrade(tier.id as 'basic' | 'premium' | 'elite');
                      }
                    }}
                  >
                    {currentTier === tier.id ? 'Current Plan' : tier.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trust & Safety */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Built on Trust
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800 mb-3">
              SwapSpot is designed for European university students who value trust and community. All members are verified through their university email addresses.
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• University email verification required</li>
              <li>• Student-to-student connections only</li>
              <li>• Safe, familiar social platforms for communication</li>
              <li>• Community-driven safety guidelines</li>
              <li>• Swap guarantee for Premium+ members</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

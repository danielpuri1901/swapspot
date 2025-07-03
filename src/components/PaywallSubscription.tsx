
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

interface PaywallSubscriptionProps {
  className?: string;
}

export default function PaywallSubscription({ className }: PaywallSubscriptionProps) {
  const handleSubscribe = async (tier: 'basic' | 'premium' | 'elite') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please log in to subscribe");
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
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

  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic Connect',
      price: '€15',
      period: '/month',
      description: 'Perfect for students looking for their first exchange',
      features: [
        'Connect with 5 students per month',
        'Basic profile verification',
        'Email support',
        'Basic matching algorithm',
        'Standard profile visibility'
      ],
      buttonText: 'Start Basic',
      icon: Star,
      highlight: false,
    },
    {
      id: 'premium',
      name: 'Premium Connect',
      price: '€25',
      period: '/month',
      description: 'Most popular - Unlimited connections with premium features',
      features: [
        'Unlimited student connections',
        'Priority profile verification',
        'Advanced matching algorithm',
        'Premium badge on profile',
        'Priority customer support',
        'Enhanced profile visibility',
        'Photo verification included'
      ],
      buttonText: 'Go Premium',
      icon: Crown,
      highlight: true,
    },
    {
      id: 'elite',
      name: 'Elite Experience',
      price: '€45',
      period: '/month',
      description: 'Everything included with VIP treatment',
      features: [
        'Everything in Premium',
        'Personal concierge service',
        'Swap guarantee protection',
        'Legal assistance & contracts',
        '24/7 priority support',
        'Exclusive events access',
        'Custom matching preferences',
        'VIP badge and top placement'
      ],
      buttonText: 'Get Elite',
      icon: Zap,
      highlight: false,
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your SwapSpot Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students already finding their perfect exchange accommodations. 
            Get verified access to connect with students across Europe.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex justify-center items-center space-x-8 mb-12 text-gray-600">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">10,000+</div>
            <div className="text-sm">Verified Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">500+</div>
            <div className="text-sm">Universities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-sm">Countries</div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {subscriptionPlans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.highlight
                    ? 'border-2 border-blue-500 shadow-lg scale-105'
                    : 'border border-gray-200 hover:border-blue-300'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.highlight ? 'pt-8' : 'pt-6'}`}>
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.highlight ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        plan.highlight ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="px-6 pb-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full py-3 ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    onClick={() => handleSubscribe(plan.id as 'basic' | 'premium' | 'elite')}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Security & Trust */}
        <div className="bg-white rounded-lg p-8 shadow-sm border">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Why Choose SwapSpot?</h3>
            <p className="text-gray-600">Join the most trusted student accommodation exchange platform in Europe</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Verified Students Only</h4>
              <p className="text-sm text-gray-600">Every student is verified through their university email and enrollment documents</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Safe & Secure</h4>
              <p className="text-sm text-gray-600">All transactions and communications are protected with enterprise-grade security</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">Our dedicated support team is available around the clock to help you</p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Not satisfied? Cancel anytime. 
            <Badge variant="outline" className="ml-2">30-day money-back guarantee</Badge>
          </p>
        </div>
      </div>
    </div>
  );
}

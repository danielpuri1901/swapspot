import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BookOpen, 
  MessageSquare, 
  Users, 
  Star,
  Clock,
  ThumbsUp,
  Search,
  Filter,
  Bot,
  Crown,
  Lock,
  Globe,
  MapPin,
  Calendar,
  Mail,
  Info,
  MessageCircle,
  Library
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PubertChat from "@/components/PubertChat";
import CommunityChat from "@/components/CommunityChat";
import ConnectForums from "@/components/ConnectForums";
import { useState, useEffect } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/lib/supabase";

const Community = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { subscriptionData, isPremium, isBasic, isElite, loading } = useSubscription();

  // Check email verification status
  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setIsEmailVerified(user.email_confirmed_at !== null);
        }
      } catch (error) {
        console.error("Error checking email verification:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkEmailVerification();
  }, []);

  const handleResendVerification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: user.email,
          options: {
            emailRedirectTo: `${window.location.origin}/verify`
          }
        });
        
        if (error) {
          console.error("Error resending verification:", error);
        } else {
          alert("Verification email sent! Please check your inbox.");
        }
      }
    } catch (error) {
      console.error("Error resending verification:", error);
    }
  };
  
  const wikiGuides = [
    {
      title: "How to Clean and Leave the Place",
      description: "Complete checklist for preparing your space for your swap partner",
      category: "Preparation",
      readTime: "5 min",
      rating: 4.8,
      views: 1250,
      featured: true
    },
    {
      title: "Cultural Etiquette Differences Checklist",
      description: "Navigate cultural differences and house rules respectfully",
      category: "Culture",
      readTime: "8 min",
      rating: 4.9,
      views: 980,
      featured: true
    },
    {
      title: "What to Do if Your Match Falls Through",
      description: "Backup plans and emergency accommodation options",
      category: "Emergency",
      readTime: "6 min",
      rating: 4.7,
      views: 750,
      featured: true
    },
    {
      title: "First Week Survival Guide",
      description: "Essential tips for settling into your temporary home",
      category: "Getting Started",
      readTime: "10 min",
      rating: 4.6,
      views: 1100
    },
    {
      title: "Managing Utilities and Bills",
      description: "How to handle shared expenses during your swap",
      category: "Practical",
      readTime: "7 min",
      rating: 4.5,
      views: 650
    },
    {
      title: "Communication Best Practices",
      description: "How to maintain clear communication with your swap partner",
      category: "Communication",
      readTime: "4 min",
      rating: 4.8,
      views: 890
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swap-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section with Gradient Background */}
        <section className="bg-gradient-to-r from-swap-blue to-swap-darkBlue py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Connect & Chat with Exchange Students
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-6">
              Join city-based group chats and connect with verified exchange students worldwide
            </p>
            <div className="flex justify-center">
              <Badge className="bg-white/20 text-white text-lg px-6 py-3 border-white/30">
                <MessageSquare className="h-5 w-5 mr-2" />
                Real-time Chat Available
              </Badge>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <Tabs defaultValue="connect" className="space-y-6">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 h-16 bg-white shadow-lg rounded-xl border border-gray-200">
                <TabsTrigger 
                  value="connect" 
                  className="flex items-center gap-3 text-base font-semibold py-4 px-6 rounded-lg data-[state=active]:bg-swap-blue data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 hover:bg-gray-50"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Connect & Chat</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="wiki" 
                  className="flex items-center gap-3 text-base font-semibold py-4 px-6 rounded-lg data-[state=active]:bg-swap-blue data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 hover:bg-gray-50"
                >
                  <Library className="h-5 w-5" />
                  <span>Resources</span>
                </TabsTrigger>
              </TabsList>

              {/* Connect & Chat Tab */}
              <TabsContent value="connect" className="space-y-6">
                <div className="text-center mb-6">
                  <Alert className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-blue-800">
                      <strong>Pro Tip:</strong> Click on any username in the chat to see their profile info, including where they're from and where they're going!
                    </AlertDescription>
                  </Alert>
                </div>
                <ConnectForums />
              </TabsContent>

              {/* Wiki Tab */}
              <TabsContent value="wiki" className="space-y-8">
                
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search wiki guides..." 
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter by Category
                  </Button>
                </div>

                {/* Featured Guides */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-500" />
                    Featured Guides
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {wikiGuides.filter(guide => guide.featured).map((guide, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <Badge variant="secondary">{guide.category}</Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {guide.rating}
                            </div>
                          </div>
                          <CardTitle className="text-lg">{guide.title}</CardTitle>
                          <CardDescription>{guide.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {guide.readTime}
                            </div>
                            <div>{guide.views} views</div>
                          </div>
                          <Button className="w-full">Read Guide</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* All Guides */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">All Guides</h2>
                  <div className="space-y-4">
                    {wikiGuides.map((guide, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-grow">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{guide.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {guide.category}
                                </Badge>
                                {guide.featured && (
                                  <Badge variant="default" className="text-xs">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-600 mb-2">{guide.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {guide.readTime}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {guide.rating}
                                </div>
                                <div>{guide.views} views</div>
                              </div>
                            </div>
                            <Button variant="outline">Read</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </section>

        {/* Support CTA with Enhanced Styling */}
        <section className="bg-white py-16 border-t">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-gradient-to-r from-swap-lightBlue to-blue-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-swap-darkBlue">Need More Help?</h2>
              <p className="text-gray-700 mb-6 text-lg">
                Can't find what you're looking for? Our support team and AI assistant are here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-swap-blue hover:bg-swap-darkBlue">
                  <Link to="/support">Contact Support</Link>
                </Button>
                <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="flex items-center gap-2 border-swap-blue text-swap-blue hover:bg-swap-blue hover:text-white">
                      <Bot className="h-5 w-5" />
                      Chat with Pubert
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[80vh] p-0">
                    <DialogHeader className="p-6 pb-0">
                      <DialogTitle>Chat with Pubert - AI Assistant</DialogTitle>
                    </DialogHeader>
                    <div className="flex-grow p-6 pt-0">
                      <PubertChat className="h-full" />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Community;

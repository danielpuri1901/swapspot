
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, LogOut, Plus, Settings, Crown, Shield, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";
import PremiumFeatures from "@/components/PremiumFeatures";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Account = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isPremium } = useSubscription();

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/login");
          return;
        }
        
        setUser(session.user);

        // Get user profile data
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load your profile");
      } finally {
        setLoading(false);
      }
    };
    
    getProfile();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("You've been logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const handleVerifyForForums = () => {
    // Navigate to a verification page or trigger verification process
    navigate("/verify-student");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-swap-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isEmailVerified = user?.email_confirmed_at;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Account</h1>
          
          <div className="space-y-6">
            {/* Verification Status Alert */}
            {!isEmailVerified && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <div className="flex items-center justify-between">
                    <span>Verify your student status to access forums and premium features</span>
                    <Button size="sm" onClick={handleVerifyForForums} className="ml-4">
                      Verify Now
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <PremiumFeatures />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Profile
                      {isPremium && <Crown className="h-4 w-4 text-yellow-600" />}
                      {isEmailVerified && <Shield className="h-4 w-4 text-green-600" />}
                    </CardTitle>
                    <CardDescription>Your account information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-swap-lightBlue flex items-center justify-center">
                          <User className="h-6 w-6 text-swap-blue" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {profile?.full_name || user?.email?.split('@')[0] || "User"}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            {isEmailVerified ? (
                              <>
                                <Shield className="h-3 w-3 text-green-600" />
                                Verified Student
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3 w-3 text-yellow-600" />
                                Unverified
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{user?.email}</span>
                        </div>
                      </div>

                      {profile && (
                        <div className="pt-4 space-y-2">
                          <p className="text-sm text-gray-500 mb-1">Profile Details</p>
                          {profile.university && (
                            <p className="text-sm"><strong>University:</strong> {profile.university}</p>
                          )}
                          {profile.program && (
                            <p className="text-sm"><strong>Program:</strong> {profile.program}</p>
                          )}
                          {profile.current_location && (
                            <p className="text-sm"><strong>Location:</strong> {profile.current_location}</p>
                          )}
                        </div>
                      )}
                      
                      <div className="pt-4 flex flex-col gap-2">
                        <Button variant="outline" size="sm" className="justify-start" asChild>
                          <a href="/onboarding">
                            <Settings className="h-4 w-4 mr-2" />
                            Update Profile
                          </a>
                        </Button>
                        {!isEmailVerified && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="justify-start text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            onClick={handleVerifyForForums}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Verify for Forums
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Log Out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Your Places</CardTitle>
                    <CardDescription>Places you've listed for swap</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 border border-dashed border-gray-300 rounded-md">
                      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Plus className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Places Added Yet</h3>
                      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        List your accommodation to start swapping with other students around the world
                      </p>
                      <Button className="bg-green-600 hover:bg-green-700" asChild>
                        <a href="/post-place">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Place
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;

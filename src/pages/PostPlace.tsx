
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const PostPlace = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState("private");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [utilities, setUtilities] = useState("");
  const [deposit, setDeposit] = useState("");
  const [description, setDescription] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [transportation, setTransportation] = useState<string[]>([]);
  const [customTransport, setCustomTransport] = useState("");
  const [houseRules, setHouseRules] = useState({
    smoking: false,
    pets: false,
    guests: false,
    quietHours: "",
    cleaningSchedule: ""
  });
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const commonAmenities = [
    "WiFi", "Furnished", "Kitchen", "Parking", "Air Conditioning", 
    "Heating", "Washing Machine", "Dishwasher", "Balcony", "Garden"
  ];

  const commonTransportation = [
    "Metro", "Bus", "Train", "Tram", "Bike Sharing", "Walking Distance"
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
        setIsAuthenticated(true);
        toast.success("Welcome back!", {
          description: "You're logged in and ready to post your apartment"
        });
      } else {
        console.log("User not authenticated but allowing access for demo");
        toast.info("Demo Mode", {
          description: "You're using this feature in demo mode"
        });
      }
    };
    
    checkAuth();
  }, []);

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities(prev => [...prev, customAmenity.trim()]);
      setCustomAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setSelectedAmenities(prev => prev.filter(a => a !== amenity));
  };

  const handleTransportToggle = (transport: string) => {
    setTransportation(prev => 
      prev.includes(transport) 
        ? prev.filter(t => t !== transport)
        : [...prev, transport]
    );
  };

  const addCustomTransport = () => {
    if (customTransport.trim() && !transportation.includes(customTransport.trim())) {
      setTransportation(prev => [...prev, customTransport.trim()]);
      setCustomTransport("");
    }
  };

  const removeTransport = (transport: string) => {
    setTransportation(prev => prev.filter(t => t !== transport));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      if (!title || !location || !description) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Enhanced apartment listing submitted!", {
        description: "Your detailed listing with amenities and house rules has been created."
      });
      
      // Reset form
      setTitle("");
      setLocation("");
      setRoomType("private");
      setMonthlyRent("");
      setUtilities("");
      setDeposit("");
      setDescription("");
      setNeighborhood("");
      setSelectedAmenities([]);
      setTransportation([]);
      setHouseRules({
        smoking: false,
        pets: false,
        guests: false,
        quietHours: "",
        cleaningSchedule: ""
      });
      
      setTimeout(() => navigate("/browse"), 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong", {
        description: "Please try again later"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Post Your Apartment</h1>
          <p className="text-gray-600 mb-8">Create a detailed listing to find the perfect swap partner</p>
          
          {!isAuthenticated && (
            <Alert className="mb-6 bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <h3 className="font-medium text-blue-700">Demo Mode</h3>
                  <AlertDescription className="text-blue-600">
                    You're using this feature in demo mode. In a production app, verification would be required.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential details about your accommodation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="title" className="text-sm font-medium block mb-1">Listing Title *</label>
                  <Input 
                    id="title"
                    placeholder="e.g., Cozy Studio in the City Center"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className="text-sm font-medium block mb-1">City/Location *</label>
                    <Input 
                      id="location"
                      placeholder="e.g., Amsterdam, Netherlands"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="neighborhood" className="text-sm font-medium block mb-1">Neighborhood</label>
                    <Input 
                      id="neighborhood"
                      placeholder="e.g., City Center, University District"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="roomType" className="text-sm font-medium block mb-1">Room Type</label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Room Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entire">Entire Place</SelectItem>
                      <SelectItem value="private">Private Room</SelectItem>
                      <SelectItem value="shared">Shared Room</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="description" className="text-sm font-medium block mb-1">Description *</label>
                  <Textarea 
                    id="description"
                    placeholder="Describe your place, including what makes it special, the atmosphere, and what you love about living there..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
                <CardDescription>Optional pricing details to help with planning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="monthlyRent" className="text-sm font-medium block mb-1">Monthly Rent</label>
                    <Input 
                      id="monthlyRent"
                      type="text"
                      placeholder="e.g., €800"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="utilities" className="text-sm font-medium block mb-1">Utilities</label>
                    <Input 
                      id="utilities"
                      type="text"
                      placeholder="e.g., €50 included"
                      value={utilities}
                      onChange={(e) => setUtilities(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="deposit" className="text-sm font-medium block mb-1">Deposit</label>
                    <Input 
                      id="deposit"
                      type="text"
                      placeholder="e.g., €400"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities & Features</CardTitle>
                <CardDescription>What does your place offer?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <label htmlFor={amenity} className="text-sm">{amenity}</label>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom amenity"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                  />
                  <Button type="button" variant="outline" onClick={addCustomAmenity}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedAmenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                      {amenity}
                      <button type="button" onClick={() => removeAmenity(amenity)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transportation */}
            <Card>
              <CardHeader>
                <CardTitle>Transportation</CardTitle>
                <CardDescription>What transportation options are nearby?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonTransportation.map((transport) => (
                    <div key={transport} className="flex items-center space-x-2">
                      <Checkbox
                        id={transport}
                        checked={transportation.includes(transport)}
                        onCheckedChange={() => handleTransportToggle(transport)}
                      />
                      <label htmlFor={transport} className="text-sm">{transport}</label>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom transportation"
                    value={customTransport}
                    onChange={(e) => setCustomTransport(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTransport())}
                  />
                  <Button type="button" variant="outline" onClick={addCustomTransport}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {transportation.map((transport) => (
                    <Badge key={transport} variant="secondary" className="flex items-center gap-1">
                      {transport}
                      <button type="button" onClick={() => removeTransport(transport)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* House Rules */}
            <Card>
              <CardHeader>
                <CardTitle>House Rules</CardTitle>
                <CardDescription>Set expectations for your space</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smoking"
                      checked={houseRules.smoking}
                      onCheckedChange={(checked) => 
                        setHouseRules(prev => ({ ...prev, smoking: !!checked }))
                      }
                    />
                    <label htmlFor="smoking" className="text-sm">Smoking allowed</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pets"
                      checked={houseRules.pets}
                      onCheckedChange={(checked) => 
                        setHouseRules(prev => ({ ...prev, pets: !!checked }))
                      }
                    />
                    <label htmlFor="pets" className="text-sm">Pets allowed</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="guests"
                      checked={houseRules.guests}
                      onCheckedChange={(checked) => 
                        setHouseRules(prev => ({ ...prev, guests: !!checked }))
                      }
                    />
                    <label htmlFor="guests" className="text-sm">Guests allowed</label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quietHours" className="text-sm font-medium block mb-1">Quiet Hours</label>
                    <Input
                      id="quietHours"
                      placeholder="e.g., 10 PM - 8 AM"
                      value={houseRules.quietHours}
                      onChange={(e) => 
                        setHouseRules(prev => ({ ...prev, quietHours: e.target.value }))
                      }
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cleaningSchedule" className="text-sm font-medium block mb-1">Cleaning Schedule</label>
                    <Input
                      id="cleaningSchedule"
                      placeholder="e.g., Weekly cleaning expected"
                      value={houseRules.cleaningSchedule}
                      onChange={(e) => 
                        setHouseRules(prev => ({ ...prev, cleaningSchedule: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              type="submit" 
              className="w-full bg-swap-blue hover:bg-swap-darkBlue"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Listing..." : "Create Detailed Listing"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostPlace;

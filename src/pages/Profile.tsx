import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, GraduationCap, MapPin, Euro, Calendar, Home, Edit, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";
import { addUserToGoogleSheet, formatUserDataForSheet } from "@/services/googleSheetsService";

interface ProfileData {
  full_name?: string;
  email?: string;
  university?: string;
  exchange_university?: string;
  program?: string;
  current_location?: string;
  current_address?: string;
  start_date?: string;
  end_date?: string;
  budget?: string;
  apartment_description?: string;
  nationality?: string;
  languages_spoken?: string[];
  interests?: string;
}

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<ProfileData>({});
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  const checkAuthAndLoadProfile = async () => {
    try {
      // Check current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast.error('Authentication error. Please log in again.');
        navigate('/login');
        return;
      }

      if (!session) {
        console.log('No active session, redirecting to login');
        toast.error('Please log in to access your profile');
        navigate('/login');
        return;
      }

      console.log('User authenticated:', session.user.id);
      setUser(session.user);

      // Load profile data
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      } else if (profileData) {
        console.log('Profile loaded:', profileData);
        setProfile(profileData);
        // Set edit data to be read-only initially - fields are auto-filled from onboarding
        setEditData(profileData);
      } else {
        console.log('No profile found, user may need to complete onboarding');
        toast.error('Please complete the onboarding process first.');
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication error. Please log in again.');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string | string[]) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Update Supabase
      const { error: supabaseError } = await supabase
        .from('profiles')
        .update({
          ...editData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (supabaseError) {
        throw supabaseError;
      }

      // Update Google Sheets
      try {
        const sheetData = formatUserDataForSheet(editData);
        await addUserToGoogleSheet(sheetData);
      } catch (sheetError) {
        console.error('Google Sheets update error:', sheetError);
        // Don't fail the whole operation if Google Sheets fails
      }

      setProfile(editData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile || {});
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swap-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md">
            <Alert>
              <AlertDescription>
                No profile data found. Please complete the onboarding process first.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/onboarding')} 
              className="mt-4"
            >
              Complete Onboarding
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-swap-blue" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  {isEditing ? (
                    <Input
                      value={editData.full_name || ''}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-700">{profile.full_name || 'Not provided'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-gray-700">{profile.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-swap-blue" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label>Current University</Label>
                   {isEditing ? (
                     <Input
                       value={editData.university || ''}
                       onChange={(e) => handleInputChange('university', e.target.value)}
                     />
                   ) : (
                     <p className="text-gray-700 bg-green-50 p-2 rounded border border-green-200">
                       {profile.university || 'Not provided'} 
                       {profile.university && <span className="text-green-600 text-sm ml-2">✓ From onboarding</span>}
                     </p>
                   )}
                 </div>
                 <div className="space-y-2">
                   <Label>Exchange University</Label>
                   {isEditing ? (
                     <Input
                       value={editData.exchange_university || ''}
                       onChange={(e) => handleInputChange('exchange_university', e.target.value)}
                     />
                   ) : (
                     <p className="text-gray-700 bg-green-50 p-2 rounded border border-green-200">
                       {profile.exchange_university || 'Not provided'}
                       {profile.exchange_university && <span className="text-green-600 text-sm ml-2">✓ From onboarding</span>}
                     </p>
                   )}
                 </div>
                 <div className="space-y-2">
                   <Label>Program/Field of Study</Label>
                   {isEditing ? (
                     <Input
                       value={editData.program || ''}
                       onChange={(e) => handleInputChange('program', e.target.value)}
                     />
                   ) : (
                     <p className="text-gray-700 bg-green-50 p-2 rounded border border-green-200">
                       {profile.program || 'Not provided'}
                       {profile.program && <span className="text-green-600 text-sm ml-2">✓ From onboarding</span>}
                     </p>
                   )}
                 </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-swap-blue" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label>Current Location</Label>
                   {isEditing ? (
                     <Input
                       value={editData.current_location || ''}
                       onChange={(e) => handleInputChange('current_location', e.target.value)}
                     />
                   ) : (
                     <p className="text-gray-700 bg-green-50 p-2 rounded border border-green-200">
                       {profile.current_location || 'Not provided'}
                       {profile.current_location && <span className="text-green-600 text-sm ml-2">✓ From onboarding</span>}
                     </p>
                   )}
                 </div>
                 <div className="space-y-2">
                   <Label>Current Address</Label>
                   {isEditing ? (
                     <Textarea
                       value={editData.current_address || ''}
                       onChange={(e) => handleInputChange('current_address', e.target.value)}
                       rows={3}
                     />
                   ) : (
                     <p className="text-gray-700 bg-green-50 p-2 rounded border border-green-200">
                       {profile.current_address || 'Not provided'}
                       {profile.current_address && <span className="text-green-600 text-sm ml-2">✓ From onboarding</span>}
                     </p>
                   )}
                 </div>
              </CardContent>
            </Card>

            {/* Exchange Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-swap-blue" />
                  Exchange Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label>Start Date</Label>
                   {isEditing ? (
                     <Input
                       type="date"
                       value={editData.start_date || ''}
                       onChange={(e) => handleInputChange('start_date', e.target.value)}
                     />
                   ) : (
                     <p className="text-gray-700 bg-green-50 p-2 rounded border border-green-200">
                       {profile.start_date ? new Date(profile.start_date).toLocaleDateString() : 'Not provided'}
                       {profile.start_date && <span className="text-green-600 text-sm ml-2">✓ From onboarding</span>}
                     </p>
                   )}
                 </div>
                 <div className="space-y-2">
                   <Label>End Date</Label>
                   {isEditing ? (
                     <Input
                       type="date"
                       value={editData.end_date || ''}
                       onChange={(e) => handleInputChange('end_date', e.target.value)}
                     />
                   ) : (
                     <p className="text-gray-700 bg-green-50 p-2 rounded border border-green-200">
                       {profile.end_date ? new Date(profile.end_date).toLocaleDateString() : 'Not provided'}
                       {profile.end_date && <span className="text-green-600 text-sm ml-2">✓ From onboarding</span>}
                     </p>
                   )}
                 </div>
                 <div className="space-y-2">
                   <Label>Budget</Label>
                   {isEditing ? (
                     <Select 
                       value={editData.budget || ''} 
                       onValueChange={(value) => handleInputChange('budget', value)}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Select budget range" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="300-500">€300 - €500</SelectItem>
                         <SelectItem value="500-700">€500 - €700</SelectItem>
                         <SelectItem value="700-900">€700 - €900</SelectItem>
                         <SelectItem value="900-1200">€900 - €1,200</SelectItem>
                         <SelectItem value="1200-1500">€1,200 - €1,500</SelectItem>
                         <SelectItem value="1500+">€1,500+</SelectItem>
                       </SelectContent>
                     </Select>
                   ) : (
                     <p className="text-gray-700 bg-green-50 p-2 rounded border border-green-200">
                       {profile.budget || 'Not provided'}
                       {profile.budget && <span className="text-green-600 text-sm ml-2">✓ From onboarding</span>}
                     </p>
                   )}
                 </div>
              </CardContent>
            </Card>

            {/* About You Section */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-swap-blue" />
                  About You
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Nationality</Label>
                    {isEditing ? (
                      <Input
                        value={editData.nationality || ''}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        placeholder="e.g. Dutch, German, Spanish"
                      />
                    ) : (
                      <p className="text-gray-700">{profile.nationality || 'Not provided'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Languages Spoken</Label>
                    {isEditing ? (
                      <Input
                        value={editData.languages_spoken?.join(', ') || ''}
                        onChange={(e) => handleInputChange('languages_spoken', e.target.value.split(', ').filter(lang => lang.trim()))}
                        placeholder="e.g. English, Dutch, German"
                      />
                    ) : (
                      <p className="text-gray-700">{profile.languages_spoken?.join(', ') || 'Not provided'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Interests</Label>
                    {isEditing ? (
                      <Input
                        value={editData.interests || ''}
                        onChange={(e) => handleInputChange('interests', e.target.value)}
                        placeholder="e.g. Travel, Photography, Sports"
                      />
                    ) : (
                      <p className="text-gray-700">{profile.interests || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accommodation Description */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-swap-blue" />
                  Accommodation Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Description</Label>
                  {isEditing ? (
                    <Textarea
                      value={editData.apartment_description || ''}
                      onChange={(e) => handleInputChange('apartment_description', e.target.value)}
                      rows={4}
                      placeholder="Describe your accommodation..."
                    />
                  ) : (
                    <p className="text-gray-700">
                      {profile.apartment_description || 'No description provided'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;

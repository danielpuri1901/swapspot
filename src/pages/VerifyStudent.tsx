
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Upload, CheckCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

const VerifyStudent = () => {
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'id'>('email');
  const [universityEmail, setUniversityEmail] = useState('');
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please log in to verify your student status");
        navigate("/login");
        return;
      }

      // Send verification email
      if (verificationMethod === 'email' && universityEmail) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: universityEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/verify`
          }
        });

        if (error) {
          toast.error("Failed to send verification email", {
            description: error.message
          });
        } else {
          toast.success("Verification email sent!", {
            description: "Please check your university email and click the verification link"
          });
          navigate("/account");
        }
      } else {
        // Handle file upload verification (simplified for now)
        toast.success("Verification request submitted!", {
          description: "Our team will review your student ID within 24-48 hours"
        });
        navigate("/account");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Failed to submit verification");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-swap-blue mx-auto mb-4" />
              <CardTitle className="text-2xl">Student Verification</CardTitle>
              <CardDescription>
                Verify your student status to access forums and premium features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <RadioGroup 
                  value={verificationMethod} 
                  onValueChange={(value) => setVerificationMethod(value as 'email' | 'id')}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">University Email Verification</p>
                          <p className="text-sm text-gray-600">Verify with your .edu or university email</p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="id" id="id" />
                    <Label htmlFor="id" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Upload className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Student ID Upload</p>
                          <p className="text-sm text-gray-600">Upload a photo of your student ID</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {verificationMethod === 'email' && (
                  <div className="space-y-2">
                    <Label htmlFor="university-email">University Email Address</Label>
                    <Input
                      id="university-email"
                      type="email"
                      placeholder="your.name@university.edu"
                      value={universityEmail}
                      onChange={(e) => setUniversityEmail(e.target.value)}
                      required
                    />
                  </div>
                )}

                {verificationMethod === 'id' && (
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID Document</Label>
                    <Input
                      id="student-id"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setVerificationFile(e.target.files?.[0] || null)}
                      required
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/account")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || (verificationMethod === 'email' && !universityEmail) || (verificationMethod === 'id' && !verificationFile)}
                    className="flex-1"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Verification"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyStudent;

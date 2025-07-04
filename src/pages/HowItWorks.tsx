
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, UserCheck, Zap, Users, CheckCircle, GraduationCap, Sparkles } from "lucide-react";

const HowItWorksPage = () => {
  const steps = [
    {
      number: "1",
      icon: <UserCheck className="h-12 w-12 text-swap-blue" />,
      title: "Tell us your exchange needs",
      description: "Share your university exchange program, study abroad dates, destination preferences, and housing requirements. That's it - we handle the rest.",
      highlight: "Just one simple form"
    },
    {
      number: "2", 
      icon: <Zap className="h-12 w-12 text-swap-blue" />,
      title: "We do the searching for exchange students",
      description: "Our intelligent system works 24/7, automatically scanning and analyzing thousands of verified university student profiles to find your perfect exchange matches.",
      highlight: "AI-powered matching"
    },
    {
      number: "3",
      icon: <Users className="h-12 w-12 text-swap-blue" />,
      title: "We deliver your student matches", 
      description: "Receive curated exchange student match notifications with complete profiles and contact details - no searching, no browsing, just perfect study abroad matches.",
      highlight: "Curated matches delivered"
    },
    {
      number: "4",
      icon: <CheckCircle className="h-12 w-12 text-swap-blue" />,
      title: "You connect and swap for your exchange",
      description: "Simply reach out to your pre-screened exchange student matches to finalize details. We've already done all the hard work of finding compatibility for your study abroad experience.",
      highlight: "Easy connection"
    }
  ];

  const benefits = [
    "Save 80% on accommodation costs",
    "Connect with verified university students",
    "Automated matching system",
    "24/7 customer support",
    "Secure payment processing",
    "Global network of universities"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-swap-blue via-swap-darkBlue to-purple-700 py-20 md:py-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-full h-full" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 md:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-white font-semibold text-lg">Built Exclusively for Exchange Students</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              We Handle Everything<br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                So You Don't Have To
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              Stop wasting time on endless searches. Our AI-powered system works around the clock to find your perfect study abroad housing match automatically.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Button asChild size="lg" className="bg-white text-swap-blue hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/signup">
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full backdrop-blur-sm">
                Watch Demo
              </Button>
            </div>
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <CheckCircle className="h-5 w-5 text-green-300 mb-2 mx-auto" />
                  <p className="text-white/90 text-sm font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Four simple steps to your perfect exchange housing match
              </p>
            </div>
            
            <div className="space-y-20 md:space-y-32">
              {steps.map((step, index) => (
                <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Visual Side */}
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-swap-blue/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                      <div className="relative bg-white rounded-3xl p-16 shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-gray-100">
                        <div className="flex items-center justify-center mb-6">
                          {step.icon}
                        </div>
                        <div className="bg-swap-blue text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold shadow-lg mx-auto">
                          {step.number}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Side */}
                  <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <div className="inline-block bg-swap-lightBlue text-swap-darkBlue px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      {step.highlight}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 bg-swap-blue">
          <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 md:p-16 border border-white/20">
              <Sparkles className="h-12 w-12 text-yellow-300 mx-auto mb-6" />
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
                Zero Effort, Maximum Exchange Results
              </h3>
              <div className="space-y-6 text-lg md:text-xl text-white/90 leading-relaxed mb-8">
                <p>
                  While you focus on your studies and exchange preparations, our advanced matching system works continuously to find university students who perfectly complement your study abroad needs.
                </p>
                <p>
                  We analyze compatibility factors, verify student status, and deliver only the highest-quality exchange matches directly to you.
                </p>
                <p className="text-xl md:text-2xl font-bold text-yellow-300">
                  You literally don't have to do anything except provide your exchange preferences once.
                </p>
              </div>
              <Button asChild size="lg" className="bg-white text-swap-blue hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/signup">
                  Find My Exchange Housing Match
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;

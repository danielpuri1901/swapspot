
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, Users, Shield, BookOpen, Award, Heart, Sparkles, Quote, ArrowRight } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Shield className="h-8 w-8 text-swap-blue" />,
      title: "Safety First",
      description: "We verify all users through their university email addresses and provide tools to help students make informed decisions about their swaps.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      title: "Accessible Education",
      description: "We believe that financial constraints shouldn't prevent students from experiencing international education opportunities.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Global Community",
      description: "Beyond just accommodation, SwapSpot helps build connections between students worldwide, fostering a global community of learners.",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Students Connected" },
    { number: "50+", label: "Countries" },
    { number: "500+", label: "Universities" },
    { number: "95%", label: "Success Rate" }
  ];

  const faqs = [
    {
      question: "How does SwapSpot verify users?",
      answer: "We verify all users through their university email addresses. This ensures that everyone on our platform is a current student at an accredited university."
    },
    {
      question: "What if I don't find a direct swap match?",
      answer: "SwapSpot allows for both direct swaps and network swaps. This means you can participate in a chain of exchanges if a direct match isn't available for your specific cities and dates."
    },
    {
      question: "Is there a fee to use SwapSpot?",
      answer: "Basic matching and communication features are free. Premium features like verified profile badges, priority matching, and virtual tours are available with a premium subscription."
    },
    {
      question: "How are conflicts resolved?",
      answer: "SwapSpot provides a mediation service for any issues that may arise during the swap. We also encourage users to create clear agreements about accommodation rules and expectations before finalizing a swap."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-swap-blue via-swap-darkBlue to-purple-700 py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          <div className="relative max-w-6xl mx-auto px-4 md:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Heart className="h-5 w-5 text-red-300" />
              <span className="text-white font-semibold text-lg">Our Mission</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Making Study Abroad<br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Accessible to Everyone
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              SwapSpot connects university students worldwide for safe, affordable accommodation exchanges during study abroad semesters.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/80 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2">
                <div className="inline-block bg-swap-lightBlue text-swap-darkBlue px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  Our Story
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 leading-tight">
                  Born from Personal Experience
                </h2>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    SwapSpot was born from a simple realization: every semester, thousands of university students travel abroad for exchange programs, while their rooms sit empty at home.
                  </p>
                  <p>
                    Founded by a group of former exchange students who experienced the housing struggle firsthand, we created SwapSpot to solve this problem through a safe, university-verified home exchange platform.
                  </p>
                  <p>
                    Our platform ensures that students can find affordable accommodations while studying abroad, making international education more accessible to all.
                  </p>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-swap-blue/20 to-purple-600/20 rounded-3xl blur-xl"></div>
                  <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                    <Quote className="h-12 w-12 text-swap-blue mb-6" />
                    <blockquote className="text-gray-700 italic text-lg mb-6 leading-relaxed">
                      "During my exchange semester, finding affordable housing was the biggest challenge. I kept thinking how perfect it would be if I could just swap with another student going to my home university. That's when the idea for SwapSpot began to take shape."
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-swap-blue to-swap-darkBlue rounded-full flex items-center justify-center text-white font-bold text-lg">
                        M
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Mael Moulin Fournier</p>
                        <p className="text-gray-600">Co-founder & CEO</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-block bg-swap-lightBlue text-swap-darkBlue px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Our Values
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                The Principles That Guide Us
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything we do is built on these core values that shape our mission
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="group relative">
                  <div className="absolute -inset-2 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-lg" 
                       style={{background: `linear-gradient(135deg, ${value.color.split(' ')[1]}, ${value.color.split(' ')[3]})`}}></div>
                  <div className="relative bg-white p-8 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                    <div className={`bg-gradient-to-r ${value.color} p-3 rounded-xl w-fit mb-6`}>
                      <div className="text-white">{value.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-block bg-swap-lightBlue text-swap-darkBlue px-4 py-2 rounded-full text-sm font-semibold mb-6">
                FAQ
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about using SwapSpot
              </p>
            </div>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-block bg-swap-lightBlue text-swap-darkBlue px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Our Team
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Meet the Founders
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The passionate people behind SwapSpot's mission
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="group relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-swap-blue to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-lg"></div>
                <div className="relative text-center p-8 bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-r from-swap-blue to-swap-darkBlue rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">
                    M
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mael Moulin Fournier</h3>
                  <p className="text-swap-blue font-semibold mb-4">Co-founder & CEO</p>
                  <p className="text-gray-600 text-sm">Leading the vision to make study abroad accessible to every student worldwide.</p>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-swap-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-lg"></div>
                <div className="relative text-center p-8 bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-swap-blue rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">
                    D
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Daniel Puri</h3>
                  <p className="text-purple-600 font-semibold mb-4">Co-founder & CTO</p>
                  <p className="text-gray-600 text-sm">Building the technology that powers seamless student connections globally.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-swap-blue to-swap-darkBlue">
          <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
            <Sparkles className="h-12 w-12 text-yellow-300 mx-auto mb-8" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              Ready to Join the SwapSpot Community?
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
              Sign up with your university email and start finding your perfect accommodation swap today. Join thousands of students who have already transformed their study abroad experience.
            </p>
            <Button asChild size="lg" className="bg-white text-swap-blue hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/signup">
                Sign Up with University Email
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;

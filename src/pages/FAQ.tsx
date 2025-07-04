
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, MessageSquare, Users, Shield, CreditCard, Globe, ArrowRight, Sparkles } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      title: "General Questions",
      icon: <HelpCircle className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-700",
      questions: [
        {
          question: "What is SwapSpot?",
          answer: "SwapSpot is a platform that connects university students for accommodation exchanges during study abroad semesters. Instead of paying for expensive housing, students can swap their existing accommodations, making international education more affordable."
        },
        {
          question: "How does SwapSpot verify users?",
          answer: "We verify all users through their university email addresses. This ensures that everyone on our platform is a current student at an accredited university, providing an additional layer of security and trust."
        },
        {
          question: "Is SwapSpot available worldwide?",
          answer: "Yes, SwapSpot is available to university students worldwide. Our platform supports international exchanges between students from different countries and continents."
        },
        {
          question: "Do I need to pay to use SwapSpot?",
          answer: "Basic matching and communication features are free. Premium features like verified profile badges, priority matching, and virtual tours are available with a premium subscription."
        }
      ]
    },
    {
      title: "Using SwapSpot",
      icon: <Users className="h-5 w-5" />,
      color: "bg-green-100 text-green-700",
      questions: [
        {
          question: "How do I find a swap match?",
          answer: "After creating a profile and listing your accommodation, you can browse available listings or use our matching algorithm to find potential swap partners. You can filter by location, dates, and accommodation type to find the perfect match."
        },
        {
          question: "What if I don't find a direct swap match?",
          answer: "SwapSpot allows for both direct swaps and network swaps. This means you can participate in a chain of exchanges if a direct match isn't available for your specific cities and dates."
        },
        {
          question: "How do I communicate with potential matches?",
          answer: "Once you find a potential match, you can use our secure messaging system to communicate. We also provide video chat capabilities for more detailed discussions about your exchange."
        },
        {
          question: "Can I list multiple accommodations?",
          answer: "Yes, you can list multiple accommodations if you have access to different housing options. This increases your chances of finding the perfect match."
        }
      ]
    },
    {
      title: "Safety & Support",
      icon: <Shield className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-700",
      questions: [
        {
          question: "How are conflicts resolved?",
          answer: "SwapSpot provides a mediation service for any issues that may arise during the swap. We also encourage users to create clear agreements about accommodation rules and expectations before finalizing a swap."
        },
        {
          question: "What happens if my swap partner cancels?",
          answer: "If your swap partner cancels before your exchange begins, our team will prioritize finding you a new match. We also recommend having a backup plan just in case."
        },
        {
          question: "How can I contact support?",
          answer: "You can reach our support team through the contact form on our support page, or by emailing hello@swapspot.com. For urgent matters, premium users have access to expedited support."
        },
        {
          question: "Is my personal information safe?",
          answer: "Yes, we take privacy seriously. We use industry-standard encryption and never share your personal information with third parties without your consent."
        }
      ]
    },
    {
      title: "Payments & Subscriptions",
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-700",
      questions: [
        {
          question: "How does payment work for swaps?",
          answer: "Most swaps are direct exchanges with no money changing hands. However, if there are utility differences or additional costs, we provide secure payment processing to handle these transactions."
        },
        {
          question: "What's included in the premium subscription?",
          answer: "Premium subscribers get priority matching, verified profile badges, unlimited messaging, virtual tour capabilities, and expedited customer support."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes, you can cancel your premium subscription at any time. You'll continue to have access to premium features until the end of your billing period."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer refunds within 14 days of subscription purchase if you haven't used any premium features. Contact our support team for assistance."
        }
      ]
    }
  ];

  const popularQuestions = [
    "How does SwapSpot verify users?",
    "What if I don't find a direct swap match?",
    "How are conflicts resolved?",
    "Is there a fee to use SwapSpot?"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-swap-blue via-swap-darkBlue to-purple-700 py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          <div className="relative max-w-6xl mx-auto px-4 md:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <HelpCircle className="h-5 w-5 text-yellow-300" />
              <span className="text-white font-semibold text-lg">Help Center</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Frequently Asked
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block">
                Questions
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              Find answers to common questions about SwapSpot and get the help you need
            </p>

            {/* Popular Questions */}
            <div className="max-w-3xl mx-auto">
              <h3 className="text-white font-semibold mb-4">Most Popular Questions:</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {popularQuestions.map((question, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                    {question}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Content */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="space-y-12">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-white p-8 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${category.color}`}>
                        {category.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                        <p className="text-gray-600">{category.questions.length} questions</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.questions.map((faq, index) => (
                        <AccordionItem 
                          key={index} 
                          value={`${categoryIndex}-${index}`}
                          className="border border-gray-200 rounded-lg px-6 hover:shadow-md transition-shadow"
                        >
                          <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-swap-blue py-6">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-gradient-to-br from-swap-lightBlue to-blue-50 rounded-3xl p-12">
              <MessageSquare className="h-16 w-16 text-swap-blue mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6 text-swap-darkBlue">Still Need Help?</h2>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                Can't find the answer you're looking for? Our support team is here to help you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-swap-blue hover:bg-swap-darkBlue text-lg px-8 py-6">
                  <Link to="/support">
                    Contact Support
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-swap-blue text-swap-blue hover:bg-swap-blue hover:text-white text-lg px-8 py-6">
                  <Link to="/community">
                    Join Community Chat
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Get Started CTA */}
        <section className="py-20 bg-gradient-to-r from-swap-blue to-swap-darkBlue">
          <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
            <Sparkles className="h-12 w-12 text-yellow-300 mx-auto mb-8" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              Ready to Start Your Exchange Journey?
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
              Join thousands of students who have found their perfect accommodation swap through SwapSpot
            </p>
            <Button asChild size="lg" className="bg-white text-swap-blue hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/signup">
                Get Started Now
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

export default FAQ;

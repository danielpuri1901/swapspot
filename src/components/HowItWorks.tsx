
import { Users, Search, UserCheck, CheckCircle, Zap, GraduationCap, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UserCheck className="h-10 w-10 text-blue-600" />,
      title: "You tell us your exchange needs",
      description: "Share your university exchange program, study abroad dates, destination preferences, and housing requirements. That's it - we handle the rest."
    },
    {
      icon: <Zap className="h-10 w-10 text-blue-600" />,
      title: "We do the searching for exchange students",
      description: "Our intelligent system works 24/7, automatically scanning and analyzing thousands of verified university student profiles to find your perfect exchange matches."
    },
    {
      icon: <Users className="h-10 w-10 text-blue-600" />,
      title: "We deliver your student matches",
      description: "Receive curated exchange student match notifications with complete profiles and contact details - no searching, no browsing, just perfect study abroad matches."
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-blue-600" />,
      title: "You connect and swap for your exchange",
      description: "Simply reach out to your pre-screened exchange student matches to finalize details. We've already done all the hard work of finding compatibility for your study abroad experience."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-full">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <span className="text-blue-600 font-bold text-xl">For University Exchange Students</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            We Handle Everything So 
            <span className="text-blue-600 block">Exchange Students Don't Have To</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Stop wasting time on endless searches. Our AI-powered system works around the clock to find your perfect study abroad housing match automatically.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center h-full">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl w-fit mx-auto mb-6">
                  {step.icon}
                </div>
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 text-lg font-bold shadow-lg">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 leading-tight">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-blue-300" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-10 md:p-12 max-w-5xl mx-auto border-2 border-blue-200 shadow-xl">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">
              Zero Effort, Maximum Exchange Results
            </h3>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
              While you focus on your studies and exchange preparations, our advanced matching system works continuously to find university students who perfectly complement your study abroad needs. 
              We analyze compatibility factors, verify student status, and deliver only the highest-quality exchange matches directly to you.
              <span className="font-bold text-blue-700 block mt-4 text-xl"> You literally don't have to do anything except provide your exchange preferences once.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

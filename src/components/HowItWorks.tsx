
import { Users, Search, UserCheck, CheckCircle, Zap, GraduationCap, ArrowRight, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UserCheck className="h-8 w-8 text-white" />,
      title: "Tell us your needs",
      description: "Share your exchange program details and housing requirements. We handle the rest."
    },
    {
      icon: <Zap className="h-8 w-8 text-white" />,
      title: "We find your matches",
      description: "Our AI system works 24/7 to find your perfect exchange student matches automatically."
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Get curated matches",
      description: "Receive pre-screened student profiles with complete contact details delivered to you."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-white" />,
      title: "Connect and swap",
      description: "Simply reach out to finalize details. We've already done the compatibility matching."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-swap-blue p-2 rounded-full">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-swap-blue font-bold text-lg">AI-Powered Matching</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
            We Do Everything
            <span className="bg-gradient-to-r from-swap-blue to-swap-darkBlue bg-clip-text text-transparent block">
              So You Don't Have To
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our intelligent system handles all the searching, matching, and filtering automatically.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center h-full">
                <div className="bg-swap-blue p-3 rounded-2xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 text-sm font-bold shadow-lg">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-5 w-5 text-blue-300" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <div className="bg-gradient-to-br from-swap-lightBlue to-blue-50 rounded-2xl p-8 max-w-4xl mx-auto border-2 border-blue-200 shadow-xl">
            <Sparkles className="h-10 w-10 text-swap-blue mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-swap-darkBlue mb-4">
              Zero Effort, Maximum Results
            </h3>
            <p className="text-gray-700 leading-relaxed">
              You provide preferences once. Our AI works continuously to find perfect matches and delivers them to you.
              <span className="font-bold text-swap-blue block mt-2">That's it.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


import { Quote, GraduationCap, Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "SwapSpot found my perfect exchange match in just 3 days without me doing anything. They did all the work while I focused on preparing for Spain.",
      name: "Marco Rodriguez",
      role: "Barcelona Exchange",
      program: "Universitat Pompeu Fabra",
      avatar: "https://i.pravatar.cc/150?img=53"
    },
    {
      id: 2,
      quote: "Finally, a service that works FOR students. I got three perfect matches delivered to my email for London - no browsing, no endless scrolling.",
      name: "Sophie Chen",
      role: "London Exchange", 
      program: "LSE Study Abroad",
      avatar: "https://i.pravatar.cc/150?img=20"
    },
    {
      id: 3,
      quote: "I literally did nothing except fill out preferences once. SwapSpot found my ideal housing partner and I could focus entirely on my medical studies prep.",
      name: "Emma Thompson",
      role: "Medical Exchange",
      program: "King's College London",
      avatar: "https://i.pravatar.cc/150?img=32"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-swap-blue p-2 rounded-full">
              <Star className="h-5 w-5 text-white" />
            </div>
            <span className="text-swap-blue font-semibold">Student Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Students Love Our 
            <span className="bg-gradient-to-r from-swap-blue to-swap-darkBlue bg-clip-text text-transparent"> AI Matching</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real stories from students who saved time with our automated system
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-2xl relative shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-swap-blue rounded-full opacity-80 group-hover:scale-125 transition-transform duration-300"></div>
              <Quote className="h-8 w-8 text-gray-200 absolute top-4 left-4" />
              
              <div className="pt-6">
                <p className="text-gray-700 mb-6 relative z-10 italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-swap-blue rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.program}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <div className="bg-swap-blue rounded-2xl p-6 text-white max-w-3xl mx-auto shadow-xl">
            <GraduationCap className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
            <h3 className="text-xl font-bold mb-3">
              AI Does The Work, Students Get Results
            </h3>
            <p className="text-white/90 text-sm">
              Our system processes thousands of profiles daily to find your perfect match automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

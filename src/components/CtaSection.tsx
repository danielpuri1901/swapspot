
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-swap-blue via-swap-darkBlue to-purple-600 relative overflow-hidden">
      {/* Dynamic background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-yellow-300/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-12 h-12 bg-orange-300/30 rounded-full animate-pulse delay-1000"></div>
      
      <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full animate-pulse">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Ready to Find Your Perfect
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block">
              Exchange Match?
            </span>
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Join thousands of students using AI-powered matching for their study abroad housing
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold text-lg px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Link to="/signup">
                Start Matching Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="border-white/50 text-white hover:bg-white/20 text-lg px-10 py-6 rounded-full backdrop-blur-sm border-2 font-semibold transition-all duration-300">
              <Link to="/how-it-works">
                See How It Works
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

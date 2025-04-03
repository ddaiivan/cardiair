import React from 'react';
// Updated imports for used icons
import { ArrowRight, Calculator, Pill, Apple, Book, FileSearch, Brain, Computer, AlertTriangle, Network, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
// Removed MedicalNewsSection import
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added Card imports
import { Button } from '@/components/ui/button'; // Added Button import
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Import Carousel components
import Autoplay from "embla-carousel-autoplay"; // Import Autoplay plugin


// Updated toolsData array for Hero Section Carousel
const toolsData = [
  // Screening Tools
  { icon: Calculator, title: "Medical Calculator", description: "Calculate BMI, BSA, GFR, and other clinical values relevant to screening.", link: "/screening/medical-calculator" },
  { icon: Book, title: "Disease Library", description: "Information on conditions relevant to cardiorespiratory screening.", link: "/screening/disease-library" },
  { icon: AlertTriangle, title: "Drug Interaction Checker", description: "Check for interactions that might affect screening results or risk.", link: "/screening/interaction-checker" },
  { icon: Network, title: "AI Mind Map Generator", description: "Visually organize screening concepts or patient risk factors.", link: "/screening/ai-mindmap-generator" },
  { icon: ClipboardList, title: "Clinical Scoring Hub", description: "Access scoring calculators used in cardiorespiratory risk assessment.", link: "/screening/clinical-scoring-hub" },
  // Monitoring Tools
  { icon: Brain, title: "AI Chatbot", description: "Engage with an AI assistant for monitoring guidance and queries.", link: "/monitoring/ai-chatbot" },
  { icon: Computer, title: "Explore GEMINI", description: "Utilize Google's advanced AI for insights related to health monitoring.", link: "/monitoring/explore-gemini" },
  // Education Tools
  { icon: Pill, title: "Drug Reference", description: "Learn about medications used in cardiorespiratory health.", link: "/education/drug-reference" },
  { icon: Apple, title: "Nutrition Database", description: "Explore how nutrition impacts heart and lung health.", link: "/education/nutrition-database" },
  { icon: FileSearch, title: "Clinical Guidelines", description: "Understand the latest evidence-based practice guidelines.", link: "/education/clinical-guidelines" },
  // Note: AI Peer Review and Learning Resources are not included here as they weren't moved to a specific category page.
];

// Website Project Images
const websiteImages = ['/tb1.png', '/tb2.png', '/tb3.png', '/tb4.png'];

const HeroSection = () => {
  // Initialize Autoplay plugin for Tools Carousel
  const toolsAutoplayPlugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  // Initialize Autoplay plugin for Website Project Carousel
  const websiteAutoplayPlugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    // Updated section background to white
    <section className="relative bg-cardiair-white pt-20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="flex flex-col items-center text-center md:items-start md:text-left"> {/* Align left on medium screens */}
            {/* Updated heading color */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cardiair-gray-dark mb-4 animate-fade-in">
              CardiAIR
            </h1>
            {/* Updated tagline color */}
            <p className="text-lg sm:text-xl md:text-2xl text-cardiair-gray-medium mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Your Partner in Cardiorespiratory Health: Screening, Monitoring, and Education
            </p>
            {/* Updated accent line color and alignment */}
            <div className="h-1 w-40 bg-cardiair-red mb-8 animate-slide-up mx-auto md:mx-0" style={{ animationDelay: '0.3s' }}></div>
            {/* Updated paragraph color */}
            <p className="text-base md:text-lg text-cardiair-gray-medium mb-8 max-w-3xl leading-relaxed animate-slide-up text-justify" style={{ animationDelay: '0.4s' }}>
              CardiAIR provides accessible tools and resources for early screening, effective monitoring, and comprehensive education on cardiorespiratory diseases. Empowering individuals and healthcare professionals towards better heart and lung health.
            </p>
            {/* Updated button styles */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up items-center md:items-start" style={{ animationDelay: '0.5s' }}>
              <Link
                to="/screening"
                className="px-6 py-3 bg-cardiair-red text-cardiair-white rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center" // Primary button style
              >
                Start Screening
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                to="/education"
                className="px-6 py-3 border border-cardiair-red text-cardiair-red rounded-lg hover:bg-cardiair-red hover:text-cardiair-white transition-all flex items-center justify-center" // Secondary button style
              >
                Education {/* Changed text from Learn More */}
              </Link>
            </div>
          </div>
          {/* Added cardio image section */}
          <div className="flex justify-center order-1 md:order-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <img
              src="/cardio1.jpg" // Updated path to cardio1.jpg
              alt="Cardiorespiratory Health Illustration"
              className="w-full max-w-md lg:max-w-xl h-auto object-contain rounded-lg border border-gray-200 shadow-lg" // Increased size on large screens, added mockup styling
            />
          </div>
        </div>
      </div>

      {/* Removed Key Achievements and Website Project sections */}

      {/* START: CardiAIR Tools & Resources Section - Updated background and heading color */}
      <div className="bg-cardiair-gray-light py-16"> {/* Added light gray background */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-cardiair-gray-dark mb-12">CardiAIR Tools & Resources</h2>

          {/* Carousel Implementation */}
        <Carousel
          plugins={[toolsAutoplayPlugin.current]} // Use tools plugin instance
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
          onMouseEnter={() => toolsAutoplayPlugin.current.stop()} // Use tools instance handler
          onMouseLeave={() => toolsAutoplayPlugin.current.play()} // Use tools instance handler
        >
          <CarouselContent className="-ml-4"> {/* Adjust margin for spacing */}
            {toolsData.map((tool, index) => (
              // Set basis for different screen sizes
              <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/4"> 
                <div className="p-1 h-full"> {/* Added padding and full height */}
                  {/* Tool Card Structure (copied from original grid) */}
                  <Link 
                    to={tool.link} 
                    // Updated Tool Card styles
                    className="tool-card group block h-full p-6 bg-cardiair-white rounded-lg border border-cardiair-gray-light shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col"
                  >
                    {/* Updated icon background/color */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cardiair-red/10 text-cardiair-red mb-4 group-hover:bg-cardiair-red group-hover:text-cardiair-white transition-colors flex-shrink-0">
                      <tool.icon size={24} />
                    </div>
                    {/* Updated title and description colors */}
                    <h3 className="text-lg font-semibold text-cardiair-gray-dark mb-2">{tool.title}</h3>
                    <p className="text-sm text-cardiair-gray-medium mb-4 text-justify flex-grow">{tool.description}</p>
                    {/* Updated Launch Tool button style */}
                    <span className="mt-auto inline-flex items-center px-4 py-2 bg-cardiair-red text-cardiair-white text-sm font-medium rounded-lg group-hover:bg-opacity-90 transition-colors self-start">
                      Launch Tool
                      <ArrowRight size={16} className="ml-2" />
                    </span>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden lg:inline-flex" /> {/* Position buttons outside on larger screens */}
          <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden lg:inline-flex" />
        </Carousel>

          {/* Add the login message below the carousel - Updated color */}
          <p className="text-center font-bold text-lg text-cardiair-gray-dark mt-8">Ready to explore? Login to access all tools.</p>
          {/* Removed the "View All Tools" button container as all tools are now displayed */}
        </div>
      </div>
      {/* END: CardiAIR Tools & Resources Section */}

      {/* Removed Medical News Section */}
    </section>
  );
};

export default HeroSection;

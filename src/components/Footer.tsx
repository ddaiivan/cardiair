
import { Mail, Phone, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // Updated footer background and default text colors
    <footer className="bg-cardiair-gray-dark text-cardiair-gray-light py-12">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading text-cardiair-white">CardiAIR</h3> {/* Updated heading color */}
            <p className="text-gray-300 mb-4">Screening, Monitoring & Education for Cardiorespiratory Health.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading text-cardiair-white">Quick Links</h3> {/* Updated heading color */}
            <ul className="space-y-2">
              {/* Updated link colors */}
              <li><Link to="/" className="text-cardiair-gray-light hover:text-cardiair-white transition-colors">Home</Link></li>
              <li><Link to="/screening" className="text-cardiair-gray-light hover:text-cardiair-white transition-colors">Screening</Link></li>
              <li><Link to="/monitoring" className="text-cardiair-gray-light hover:text-cardiair-white transition-colors">Monitoring</Link></li>
              <li><Link to="/education" className="text-cardiair-gray-light hover:text-cardiair-white transition-colors">Education</Link></li>
              <li><Link to="/about" className="text-cardiair-gray-light hover:text-cardiair-white transition-colors">About</Link></li>
              {/* Removed Tools link */}
              <li><Link to="/contact" className="text-cardiair-gray-light hover:text-cardiair-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading text-cardiair-white">Contact</h3> {/* Updated heading color */}
             <div className="space-y-3">
               {/* Updated contact link/text colors and email address */}
               <p className="flex items-center">
                 <Mail size={16} className="mr-2" />
                 <a href="mailto:cardiair@daivanlabs.com" className="text-cardiair-gray-light hover:text-cardiair-white transition-colors">
                   cardiair@daivanlabs.com
                 </a>
               </p>
               {/* Removed Phone line */}
            </div>
          </div>
        </div>

        {/* Updated border and copyright text color */}
        <div className="border-t border-cardiair-gray-medium mt-10 pt-6 text-center text-cardiair-gray-medium">
          <p>© {currentYear} CardiAIR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

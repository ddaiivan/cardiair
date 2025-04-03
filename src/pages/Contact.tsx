import { Mail } from 'lucide-react'; // Removed unused Linkedin, MapPin
import PageHeader from '../components/PageHeader'; // Keep relative path

const Contact = () => {
  // Removed unused state and handlers

  return (
    // Use Layout applied in App.tsx, remove redundant outer div
    <>
      <PageHeader
        title="Contact Us" // Updated title
        subtitle="We'd love to hear from you. Reach out with questions or feedback." // Updated subtitle
      />

      {/* Use standard container and adjust padding */}
      <div className="container max-w-7xl mx-auto px-4 py-16">
        {/* Adjusted max-width */}
        <div className="max-w-2xl mx-auto">
            {/* Contact Information */}
            <div>
              {/* Updated heading color */}
              <h2 className="text-2xl font-bold text-cardiair-gray-dark mb-6">Contact Information</h2>
              {/* Updated text color */}
              <p className="text-cardiair-gray-medium mb-8 text-justify">
                Have questions about CardiAIR, suggestions for improvement, or partnership inquiries?
                Please feel free to contact us via email. We appreciate your feedback and will get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                {/* Email Section */}
                <div className="flex items-start">
                  {/* Updated icon background/color */}
                  <div className="w-12 h-12 rounded-full bg-cardiair-red/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="text-cardiair-red" size={20} />
                  </div>
                  <div>
                    {/* Updated text colors */}
                    <h3 className="text-lg font-semibold text-cardiair-gray-dark mb-1">Email</h3>
                    <a
                      href="mailto:cardiair@daivanlabs.com" // Updated email address
                      className="text-cardiair-red hover:underline break-all" // Updated colors
                    >
                      cardiair@daivanlabs.com {/* Updated email address */}
                    </a>
                  </div>
                </div>

                {/* Removed LinkedIn Section */}
                {/* Removed Location Section */}

              </div>

              {/* Removed "Connect for Collaboration" box */}
            </div>
            {/* Removed the Contact Form section */}
        </div>
      </div>
    </> // Closing JSX Fragment
  );
};

export default Contact;

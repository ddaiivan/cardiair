import PageHeader from '../components/PageHeader'; // Keep relative path

const About = () => {
  return (
    // Use Layout applied in App.tsx, remove redundant outer div
    <>
      <PageHeader
        title="About CardiAIR" // Updated title
        subtitle="Empowering proactive cardiorespiratory health through technology." // Updated subtitle
      />

      {/* Use standard container and adjust padding */}
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12 items-start"> {/* Use items-start */}
          {/* Main content area */}
          <div className="md:col-span-2">
            {/* Updated heading color */}
            <h2 className="text-2xl font-bold text-cardiair-gray-dark mb-6">Background</h2>
            {/* Updated text color and content */}
            <p className="text-cardiair-gray-medium mb-6 leading-relaxed text-justify">
              Cardiorespiratory diseases remain a significant health challenge globally and in Indonesia. Early detection, consistent monitoring, and accessible education are crucial for effective prevention and management. CardiAIR was established to address these needs by providing a user-friendly digital platform equipped with reliable tools and resources.
            </p>
            <p className="text-cardiair-gray-medium mb-6 leading-relaxed text-justify">
              We aim to bridge the gap between clinical knowledge and public awareness, empowering individuals to take control of their heart and lung health, and supporting healthcare professionals with efficient digital tools.
            </p>

            {/* Updated heading color */}
            <h2 className="text-2xl font-bold text-cardiair-gray-dark mb-6 mt-12">Vision</h2>
            {/* Updated text color and content */}
            <p className="text-cardiair-gray-medium mb-6 leading-relaxed text-justify">
              To be the leading digital platform in Indonesia for cardiorespiratory health, fostering a proactive community focused on prevention, early detection, and effective management through accessible technology and reliable education.
            </p>

            {/* Updated heading color */}
            <h2 className="text-2xl font-bold text-cardiair-gray-dark mb-6 mt-12">Philosophy</h2>
            {/* Updated styling and text color/content */}
            <div className="bg-cardiair-gray-light rounded-lg p-6 mb-12 border-l-4 border-cardiair-red">
              <p className="text-cardiair-gray-medium italic text-justify">
                "We believe in empowering individuals and healthcare providers with accessible, evidence-based tools and knowledge. Our commitment lies in promoting proactive health management, facilitating early intervention, and fostering a healthier future through continuous education and technological innovation in cardiorespiratory care."
              </p>
            </div>
          </div>

          {/* Image/Logo area */}
          <div className="md:col-span-1 flex justify-center md:justify-start">
            <div className="bg-cardiair-white rounded-lg shadow-md p-4 sticky top-24 max-w-xs w-full"> {/* Adjusted padding and width */}
              <div className="flex justify-center mb-4">
                 {/* Updated image source to about.jpg */}
                <img
                  src="/about.jpg" // Changed image source
                  alt="CardiAIR Concept" // Updated alt text
                  className="w-full h-auto object-cover rounded-lg shadow-md" // Use cover and ensure responsiveness
                />
              </div>
              {/* Removed contact information section */}
            </div> {/* Closing div for the sticky card */}
          </div> {/* Closing div for the image column */}
        </div> {/* Closing div for the grid */}
      </div> {/* Closing div for the container */}
    </> // Closing JSX Fragment
  );
};

export default About;

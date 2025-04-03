import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Added Card imports
import { Button } from '@/components/ui/button'; // Added Button import
import { Link } from 'react-router-dom'; // Added Link import
import { Brain, Computer } from 'lucide-react'; // Added necessary icons

// Define the tools specific to the Monitoring page
const monitoringToolsData = [
  {
    id: 6, // Original ID from Tools.tsx
    title: 'AI Chatbot',
    description: 'Engage with an AI assistant for monitoring guidance and queries.', // Adjusted description
    icon: Brain,
    path: '/monitoring/ai-chatbot', // Updated path
    comingSoon: false
  },
  {
    id: 8, // Original ID from Tools.tsx
    title: 'Explore GEMINI',
    description: 'Utilize Google\'s advanced AI for insights related to health monitoring.', // Adjusted description
    icon: Computer,
    path: '/monitoring/explore-gemini', // Updated path
    comingSoon: false
  },
];

const Monitoring = () => {
  return (
    <Layout>
      <PageHeader title="Monitoring Tools" subtitle="AI-powered tools to assist in monitoring your cardiorespiratory health." /> {/* Updated subtitle */}
      {/* Updated container div to use theme background */}
      <div className="bg-cardiair-gray-light py-12">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Changed layout to Flexbox for centering */}
          <div className="flex flex-wrap justify-center -m-3"> {/* Added justify-center and negative margin */}
            {monitoringToolsData.map((tool) => (
              // Added width classes and padding to simulate grid columns and gap
              <div key={tool.id} className="w-full md:w-1/2 lg:w-1/3 p-3"> {/* Added padding */}
                <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg bg-cardiair-white border border-cardiair-gray-light rounded-lg">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                    <tool.icon className="h-8 w-8 text-cardiair-red" />
                    {tool.comingSoon && (
                      <span className="text-xs bg-amber-100 text-amber-800 py-1 px-2 rounded-full font-medium">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <CardTitle className="mt-2 text-cardiair-gray-dark">{tool.title}</CardTitle>
                  <CardDescription className="text-justify text-cardiair-gray-medium">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {/* Optional: Add padding or content if needed */}
                </CardContent>
                <CardFooter>
                  {tool.comingSoon ? (
                    <Button
                      className="w-full bg-gray-400 cursor-not-allowed text-white rounded-lg"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  ) : (
                    <Link to={tool.path || '#'} className="w-full">
                      <Button className="w-full bg-cardiair-red hover:bg-opacity-90 text-cardiair-white rounded-lg">
                        Launch Tool
                      </Button>
                    </Link>
                  )}
                </CardFooter>
                </Card>
              </div> // Close the wrapping div for width/padding
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Monitoring;

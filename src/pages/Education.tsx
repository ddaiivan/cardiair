import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Added Card imports
import { Button } from '@/components/ui/button'; // Added Button import
import { Link } from 'react-router-dom'; // Added Link import
import { Pill, Apple, FileSearch } from 'lucide-react'; // Added necessary icons

// Define the tools specific to the Education page
const educationToolsData = [
  {
    id: 2, // Original ID from Tools.tsx
    title: 'Drug Reference',
    description: 'Learn about medications used in cardiorespiratory health.', // Adjusted description
    icon: Pill,
    path: '/education/drug-reference', // Updated path
    comingSoon: false
  },
  {
    id: 3, // Original ID from Tools.tsx
    title: 'Nutrition Database',
    description: 'Explore how nutrition impacts heart and lung health.', // Adjusted description
    icon: Apple,
    path: '/education/nutrition-database', // Updated path
    comingSoon: false
  },
  {
    id: 5, // Original ID from Tools.tsx
    title: 'Clinical Guidelines',
    description: 'Understand the latest evidence-based practice guidelines.', // Adjusted description
    icon: FileSearch,
    path: '/education/clinical-guidelines', // Updated path
    comingSoon: false
  },
];

const Education = () => {
  return (
    <Layout>
      <PageHeader title="Education Resources" subtitle="Information and tools to learn about cardiorespiratory health." /> {/* Updated title/subtitle */}
      {/* Updated container div to use theme background */}
      <div className="bg-cardiair-gray-light py-12">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Changed layout to Flexbox for centering */}
          <div className="flex flex-wrap justify-center -m-3"> {/* Added justify-center and negative margin */}
            {educationToolsData.map((tool) => (
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
          {/* TODO: Add other educational content sections here (articles, videos etc.) */}
        </div>
      </div>
    </Layout>
  );
};

export default Education;

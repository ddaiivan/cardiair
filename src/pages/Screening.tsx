import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Added Card imports
import { Button } from '@/components/ui/button'; // Added Button import
import { Link } from 'react-router-dom'; // Added Link import
import { Calculator, Book, Network, ClipboardList, AlertTriangle } from 'lucide-react'; // Added necessary icons

// Define the tools specific to the Screening page
const screeningToolsData = [
  {
    id: 1, // Original ID from Tools.tsx
    title: 'Medical Calculator',
    description: 'Calculate BMI, BSA, GFR, and other important clinical values relevant to screening.',
    icon: Calculator,
    path: '/screening/medical-calculator', // Updated path
    comingSoon: false
  },
  {
    id: 4, // Original ID from Tools.tsx
    title: 'Disease Library',
    description: 'Information on conditions relevant to cardiorespiratory screening.',
    icon: Book,
    path: '/screening/disease-library', // Updated path
    comingSoon: false
  },
  {
    id: 9, // Original ID from Tools.tsx
    title: 'Drug Interaction Checker',
    description: 'Check for interactions that might affect screening results or risk.',
    icon: AlertTriangle,
    path: '/screening/interaction-checker', // Updated path
    comingSoon: false
  },
  {
    id: 11, // Original ID from Tools.tsx
    title: 'AI Mind Map Generator',
    description: 'Visually organize screening concepts or patient risk factors.',
    icon: Network,
    path: '/screening/ai-mindmap-generator', // Updated path
    comingSoon: false
  },
  {
    id: 12, // Original ID from Tools.tsx
    title: 'Clinical Scoring Hub',
    description: 'Access scoring calculators used in cardiorespiratory risk assessment.',
    icon: ClipboardList,
    path: '/screening/clinical-scoring-hub', // Updated path
    comingSoon: false
  },
];

const Screening = () => {
  return (
    <Layout>
      <PageHeader title="Screening Tools" subtitle="Tools and resources for cardiorespiratory screening and risk assessment." />
      {/* Updated container div to use theme background */}
      <div className="bg-cardiair-gray-light py-12">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Changed layout to Flexbox for centering last row */}
          <div className="flex flex-wrap justify-center -m-3"> {/* Added justify-center and negative margin */}
            {screeningToolsData.map((tool) => (
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

export default Screening;

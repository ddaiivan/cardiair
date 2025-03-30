import React, { useState, useEffect, useCallback } from 'react'; // Consolidated imports
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, X, Loader2, Sparkles, ArrowLeft } from 'lucide-react'; // Consolidated imports + ArrowLeft
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

interface InteractionResult {
  pair: string[];
  severity: string; // Keep severity in the data structure even if not displayed
  description: string;
  // Add state for summarization specific to each result
  summary?: string;
  isSummarizing?: boolean;
  summaryError?: string;
}

const InteractionChecker = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [drugs, setDrugs] = useState<string[]>(['', '']); // Start with two input fields
  const [results, setResults] = useState<InteractionResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading for initial interaction check
  const [error, setError] = useState<string | null>(null); // Error for initial interaction check

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (index: number, value: string) => {
    const newDrugs = [...drugs];
    newDrugs[index] = value;
    setDrugs(newDrugs);
  };

  const addDrugInput = () => {
    setDrugs([...drugs, '']);
  };

  const removeDrugInput = (index: number) => {
    if (drugs.length > 2) { // Keep at least two inputs
      const newDrugs = drugs.filter((_, i) => i !== index);
      setDrugs(newDrugs);
    }
  };

  const handleCheckInteractions = async () => {
    const validDrugs = drugs.map(d => d.trim()).filter(d => d.length > 0);
    if (validDrugs.length < 2) {
      setError('Please enter at least two drugs to check for interactions.');
      setResults(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    // Define the worker URL (adjust if your port differs)
    const workerUrl = 'http://127.0.0.1:8787';

    try {
      console.log('Sending drugs to worker:', validDrugs);
      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ drugs: validDrugs }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors returned from the worker API
        console.error('Worker API Error:', data);
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      console.log('Received interactions from worker:', data.interactions);
      setResults(data.interactions || []); // Set results or empty array if undefined

    } catch (err: any) {
      console.error('Error checking interactions:', err);
      setError(err.message || 'Failed to check interactions. Please ensure the local worker is running and reachable.');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle summarization request for a specific interaction
  const handleSummarize = useCallback(async (index: number) => {
    if (!results || !results[index] || !results[index].description) return;

    const interactionText = results[index].description;

    // Update state to show loading for this specific item
    setResults(currentResults =>
      currentResults?.map((res, i) =>
        i === index ? { ...res, isSummarizing: true, summaryError: undefined, summary: undefined } : res
      ) || null
    );

    // Define the Gemini worker URL (ensure this port is correct for gemini-cf-worker)
    const geminiWorkerUrl = 'http://127.0.0.1:8788'; // Assuming port 8788

    try {
      console.log(`Sending text to Gemini worker for summarization (interaction index ${index})`);
      const response = await fetch(geminiWorkerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send text using the 'textToSummarize' field expected by the updated worker
        body: JSON.stringify({ textToSummarize: interactionText }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Gemini Worker API Error:', data);
        throw new Error(data.error || `Summarization request failed with status ${response.status}`);
      }

      console.log(`Received summary from Gemini worker (interaction index ${index})`);
      // Update state with the summary for this specific item
      setResults(currentResults =>
        currentResults?.map((res, i) =>
          i === index ? { ...res, isSummarizing: false, summary: data.responseText || "Summary not available." } : res
        ) || null
      );

    } catch (err: any) {
      console.error('Error summarizing interaction:', err);
      // Update state with the error for this specific item
      setResults(currentResults =>
        currentResults?.map((res, i) =>
          i === index ? { ...res, isSummarizing: false, summaryError: err.message || 'Failed to get summary.' } : res
        ) || null
      );
    }
  }, [results]); // Dependency array includes results

  // Simple Markdown to HTML converter for bold and italic
  const renderMarkdown = (text: string) => {
    if (!text) return { __html: '' };
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>');       // Italic
    // Handle potential newline characters from Markdown
    html = html.replace(/\n/g, '<br />');
    return { __html: html };
  };

  return (
    <>
      <PageHeader
        title="Drug Interaction Checker"
        subtitle="Check potential drug interactions using data sourced from OpenFDA."
      />
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Enter Drugs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {drugs.map((drug, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder={`Drug ${index + 1}`}
                  value={drug}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="flex-grow"
                />
                {drugs.length > 2 && (
                  <Button variant="ghost" size="icon" onClick={() => removeDrugInput(index)} aria-label="Remove drug">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className="flex justify-between items-center">
               <Button variant="outline" onClick={addDrugInput}>
                 Add Another Drug
               </Button>
               <Button
                 onClick={handleCheckInteractions}
                 disabled={isLoading || drugs.filter(d => d.trim().length > 0).length < 2}
                 className="bg-medical-teal hover:bg-medical-blue"
               >
                 {isLoading ? 'Checking...' : 'Check Interactions'}
               </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
           <div className="mt-6 text-center">
             <p>Loading interaction results...</p>
             {/* Add a spinner or loading indicator here if desired */}
           </div>
         )}

        {results && !isLoading && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Interaction Results</CardTitle>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <p>No significant interactions found between the entered drugs based on available data.</p>
              ) : (
                <ul className="space-y-4">
                  {results.map((result, index) => (
                    <li key={index} className="p-4 border rounded shadow-sm">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" /> {/* Default icon color */}
                        <strong className="text-lg">{result.pair.join(' + ')}</strong>
                        {/* Severity badge removed */}
                      </div>
                      <p className="text-gray-700 text-justify mb-3">{result.description}</p> {/* Added margin-bottom */}

                      {/* Summarization Section */}
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        {result.isSummarizing ? (
                          <div className="flex items-center text-sm text-gray-500">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Summary...
                          </div>
                        ) : result.summaryError ? (
                          <div className="text-sm text-red-600">
                            Error summarizing: {result.summaryError}
                          </div>
                        ) : result.summary ? (
                          <div>
                            <h4 className="text-sm font-semibold mb-1 flex items-center">
                              <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                              AI Summary:
                            </h4>
                            {/* Use dangerouslySetInnerHTML to render Markdown */}
                            <p
                              className="text-sm text-gray-600 text-justify"
                              dangerouslySetInnerHTML={renderMarkdown(result.summary)}
                            />
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSummarize(index)}
                            disabled={result.isSummarizing}
                          >
                            Summarize with AI
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
               <p className="mt-4 text-sm text-gray-500 italic">
                 Disclaimer: This tool provides information based on available data and does not substitute for professional medical advice. Always consult with a healthcare provider for clinical decisions.
               </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Back to Tools Button - Centered below the main content */}
      <div className="flex justify-center mt-8 mb-4">
        <Link to="/tools">
          <Button variant="outline" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Button>
        </Link>
      </div>
    </>
  );
};

export default InteractionChecker;

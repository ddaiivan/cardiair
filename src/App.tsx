
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Screening from "./pages/Screening"; // Added import
import Monitoring from "./pages/Monitoring"; // Added import
import Education from "./pages/Education"; // Added import (re-added)
// Removed Honors import
// Removed Research import
// Removed Experience import
// Removed Certifications import
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
// Removed Tools import
import MedicalCalculator from "./pages/MedicalCalculator";
import DrugReference from "./pages/DrugReference";
import NutritionDatabase from "./pages/NutritionDatabase"; // Import NutritionDatabase
import DiseaseLibrary from "./pages/DiseaseLibrary"; // Import DiseaseLibrary
import ClinicalGuidelines from "./pages/ClinicalGuidelines"; // Import ClinicalGuidelines
import AIChatbot from "./pages/AIChatbot"; // Import AIChatbot
import AIPeerReview from "./pages/AIPeerReview"; // Import AIPeerReview
import LearningResources from "./pages/LearningResources"; // Import LearningResources
import LearningCoursera from "./pages/LearningCoursera"; // Import LearningCoursera
import LearningOsmosis from "./pages/LearningOsmosis"; // Import LearningOsmosis
import LearningUpToDate from "./pages/LearningUpToDate"; // Import LearningUpToDate
import LearningOther from "./pages/LearningOther"; // Import LearningOther
import ExploreGemini from "./pages/ExploreGemini"; // Import ExploreGemini
import InteractionChecker from "./pages/InteractionChecker"; // Import InteractionChecker
import MindMapMaker from "./pages/MindMapMaker"; // Import MindMapMaker
import ClinicalScoringHub from "./pages/ClinicalScoringHub"; // Import ClinicalScoringHub
// Removed StreamInteraction import
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/screening" element={<Screening />} /> {/* Added route */}
            <Route path="/monitoring" element={<Monitoring />} /> {/* Added route */}
            <Route path="/education" element={<Education />} /> {/* Added route (re-added) */}
            {/* Removed /honors route */}
            {/* Removed /research route */}
            {/* Removed /experience route */}
            {/* Removed /certifications route */}
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            {/* Removed /tools route */}
            {/* Updated route for Medical Calculator */}
            <Route
              path="/screening/medical-calculator" // Updated path
              element={
                <ProtectedRoute>
                  <MedicalCalculator /> {/* Removed Layout */}
                </ProtectedRoute>
              } 
            />
            {/* Updated route for Drug Reference */}
            <Route
              path="/education/drug-reference" // Updated path
              element={
                <ProtectedRoute>
                  <DrugReference /> {/* Removed Layout */}
                </ProtectedRoute>
              } 
            />
            {/* Updated route for Nutrition Database */}
            <Route
              path="/education/nutrition-database" // Updated path
              element={
                <ProtectedRoute>
                  <NutritionDatabase /> {/* Removed Layout */}
                </ProtectedRoute>
              } 
            />
            {/* Updated route for Disease Library */}
            <Route
              path="/screening/disease-library" // Updated path
              element={
                <ProtectedRoute>
                  <DiseaseLibrary /> {/* Removed Layout */}
                 </ProtectedRoute>
               } 
             />
             {/* Updated route for Clinical Guidelines */}
             <Route
               path="/education/clinical-guidelines" // Updated path
               element={
                 <ProtectedRoute>
                   <ClinicalGuidelines /> {/* Removed Layout */}
                 </ProtectedRoute>
               }
             />
             {/* Updated route for Explore GEMINI */}
             <Route
               path="/monitoring/explore-gemini" // Updated path
               element={
                 <ProtectedRoute>
                   <ExploreGemini /> {/* Removed Layout */}
                 </ProtectedRoute>
               }
             />
             {/* Updated route for AI Chatbot */}
             <Route
               path="/monitoring/ai-chatbot" // Updated path
               element={
                 <ProtectedRoute>
                  <AIChatbot /> {/* Removed Layout */}
                </ProtectedRoute>
              } 
            />
            {/* Keep AI Peer-Review under /tools for now, or decide where it belongs */}
            <Route
              path="/tools/ai-peer-review"
              element={
                <ProtectedRoute>
                  <Layout><AIPeerReview /></Layout> {/* Keep Layout if it's a top-level tool */}
                </ProtectedRoute>
              } 
            />
            {/* Keep Learning Resources under /tools for now, or move to /education */}
            <Route
              path="/tools/learning-resources"
              element={
                <ProtectedRoute>
                  <Layout><LearningResources /></Layout> {/* Keep Layout if it's a top-level tool */}
                </ProtectedRoute>
              } 
            />
            {/* Keep specific learning resources under /tools for now, or move to /education */}
            <Route
              path="/tools/learning-resources/coursera"
              element={
                <ProtectedRoute>
                  <Layout><LearningCoursera /></Layout> {/* Keep Layout if it's a top-level tool */}
                </ProtectedRoute>
              } 
            />
            <Route
              path="/tools/learning-resources/osmosis"
              element={
                <ProtectedRoute>
                  <Layout><LearningOsmosis /></Layout> {/* Keep Layout if it's a top-level tool */}
                </ProtectedRoute>
              } 
            />
            <Route
              path="/tools/learning-resources/uptodate"
              element={
                <ProtectedRoute>
                  <Layout><LearningUpToDate /></Layout> {/* Keep Layout if it's a top-level tool */}
                </ProtectedRoute>
              } 
            />
            <Route
              path="/tools/learning-resources/other"
              element={
                <ProtectedRoute>
                  <Layout><LearningOther /></Layout> {/* Keep Layout if it's a top-level tool */}
                </ProtectedRoute>
              }
            />
            {/* Updated route for Interaction Checker */}
            <Route
              path="/screening/interaction-checker" // Updated path
              element={
                <ProtectedRoute>
                  <InteractionChecker /> {/* Removed Layout */}
                 </ProtectedRoute>
               }
             />
             {/* Updated route for AI Mind Map Generator */}
             <Route
               path="/screening/ai-mindmap-generator" // Updated path
               element={
                 <ProtectedRoute>
                   <MindMapMaker /> {/* Removed Layout */}
                 </ProtectedRoute>
               }
             />
             {/* Updated route for Clinical Scoring Hub */}
            <Route
              path="/screening/clinical-scoring-hub" // Updated path
              element={
                <ProtectedRoute>
                  <ClinicalScoringHub /> {/* Removed Layout */}
                 </ProtectedRoute>
               }
             />
             {/* Removed Stream Interaction route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

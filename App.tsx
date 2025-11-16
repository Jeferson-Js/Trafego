
import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { generateMarketingPlan } from './services/geminiService';
import type { FormState } from './types';

function App() {
  const [formState, setFormState] = useState<FormState>({ niche: 'digital art prints', price: '25', goal: '1000' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!formState.niche || !formState.price || !formState.goal) {
      setError("All fields are required.");
      return;
    }
    
    const price = parseFloat(formState.price);
    const goal = parseFloat(formState.goal);

    if (isNaN(price) || price <= 0 || isNaN(goal) || goal <= 0) {
      setError("Please enter valid positive numbers for price and goal.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPlan(null);

    try {
      const plan = await generateMarketingPlan(formState.niche, price, goal);
      if(plan.startsWith("Error:")) {
        setError(plan);
        setGeneratedPlan(null);
      } else {
        setGeneratedPlan(plan);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate plan. ${errorMessage}`);
      setGeneratedPlan(null);
    } finally {
      setIsLoading(false);
    }
  }, [formState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            CopyCraft AI
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Your AI-powered assistant for crafting winning marketing strategies.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <InputForm
              formState={formState}
              setFormState={setFormState}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            <ResultsDisplay
              plan={generatedPlan}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Gemini API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

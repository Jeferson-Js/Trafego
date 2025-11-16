
import React, { useMemo } from 'react';
import { SectionCard } from './SectionCard';
import { LoadingSpinner } from './LoadingSpinner';
import { getIconForTitle, InfoIcon, ErrorIcon } from './icons';

interface ResultsDisplayProps {
  plan: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ plan, isLoading, error }) => {
  const sections = useMemo(() => {
    if (!plan) return [];
    
    return plan.split('\n## ').filter(s => s.trim() !== '').map(sectionText => {
      const parts = sectionText.split('\n');
      const title = parts[0].trim().replace('## ', '');
      const content = parts.slice(1).join('\n').trim();
      return { title, content };
    });
  }, [plan]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-gray-300">CopyCraft AI is thinking...</p>
        <p className="mt-2 text-sm text-gray-400">This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-5 rounded-xl shadow-lg flex items-start">
        <div className="mr-3 flex-shrink-0">
          <ErrorIcon />
        </div>
        <div>
          <h3 className="text-lg font-bold text-red-100">An Error Occurred</h3>
          <p className="mt-1 text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
       <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white/5 backdrop-blur-md rounded-xl p-8 border-2 border-dashed border-white/20">
        <div className="text-blue-400 mb-4">
          <InfoIcon />
        </div>
        <h3 className="text-xl font-bold text-white">Ready to Craft Your Strategy?</h3>
        <p className="mt-2 text-center text-gray-300 max-w-sm">
          Fill in your product details on the left and click "Generate" to receive your personalized marketing plan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <SectionCard key={section.title} title={section.title} icon={getIconForTitle(section.title)}>
          {section.content}
        </SectionCard>
      ))}
    </div>
  );
};

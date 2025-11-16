import React, { useMemo, useState } from 'react';
import { SectionCard } from './SectionCard';
import { LoadingSpinner } from './LoadingSpinner';
import { getIconForTitle, InfoIcon, ErrorIcon } from './icons';
import type { GeneratedPlan } from '../types';

interface ResultsDisplayProps {
  plan: GeneratedPlan | null;
  translatedPlan: string | null;
  isLoading: boolean;
  isTranslating: boolean;
  error: string | null;
  onTranslate: (language: string) => void;
  onToggleView: () => void;
  isShowingOriginal: boolean;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  plan, 
  translatedPlan,
  isLoading, 
  isTranslating,
  error,
  onTranslate,
  onToggleView,
  isShowingOriginal
}) => {
  const [targetLanguage, setTargetLanguage] = useState('');

  const sections = useMemo(() => {
    const contentToParse = isShowingOriginal ? plan?.text : translatedPlan;
    if (!contentToParse) return [];
    
    return contentToParse.split('\n## ').filter(s => s.trim() !== '').map(sectionText => {
      const parts = sectionText.split('\n');
      const title = parts[0].trim().replace('## ', '');
      const content = parts.slice(1).join('\n').trim();
      return { title, content };
    });
  }, [plan?.text, translatedPlan, isShowingOriginal]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-gray-300">CopyCraft AI is crafting your plan...</p>
        <p className="mt-2 text-sm text-gray-400 text-center">This includes generating ultra-realistic images, which may take a moment.</p>
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
          Fill in your product details on the left and click "Generate" to receive your personalized marketing plan, complete with images.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Translate to... (e.g., Spanish)"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          disabled={isTranslating}
          className="flex-grow bg-white/10 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-w-[200px]"
        />
        <button
          onClick={() => onTranslate(targetLanguage)}
          disabled={!targetLanguage.trim() || isTranslating}
          className="flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-all"
        >
          {isTranslating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Translating...
            </>
          ) : (
            'Translate'
          )}
        </button>
        {translatedPlan && (
          <button
            onClick={onToggleView}
            className="py-2 px-4 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 transition-all"
          >
            {isShowingOriginal ? 'Show Translation' : 'Show Original'}
          </button>
        )}
      </div>

      {sections.map((section) => {
        if (section.title.toLowerCase().includes('ad copy') && plan?.images && plan.images.length > 0 && isShowingOriginal) {
          const adCopies = section.content.split(/(?=Ad Copy \d+:)/).filter(s => s.trim());
          return (
            <SectionCard key={section.title} title={section.title} icon={getIconForTitle(section.title)}>
              {adCopies.map((copy, index) => (
                <div key={index} className={index < adCopies.length - 1 ? "mb-8 pb-8 border-b border-white/20" : ""}>
                  <div className="whitespace-pre-wrap font-light leading-relaxed">{copy.trim()}</div>
                  {plan.images[index] && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-blue-300 mb-2">Generated Ad Image:</p>
                      <img 
                        src={plan.images[index]} 
                        alt={`Generated ad creative for Ad Copy ${index + 1}`}
                        className="rounded-lg w-full object-cover shadow-lg border-2 border-blue-500/50" 
                      />
                    </div>
                  )}
                </div>
              ))}
            </SectionCard>
          );
        }

        return (
            <SectionCard key={section.title} title={section.title} icon={getIconForTitle(section.title)}>
              {section.content}
            </SectionCard>
        );
      })}
    </div>
  );
};
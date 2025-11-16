
import React from 'react';

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 transition-all duration-300 hover:border-blue-400/50 hover:bg-white/15">
      <div className="flex items-center mb-4">
        <span className="text-blue-300 mr-3 flex-shrink-0">{icon}</span>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="text-gray-200 whitespace-pre-wrap font-light leading-relaxed">
        {children}
      </div>
    </div>
  );
};

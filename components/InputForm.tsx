
import React from 'react';
import type { FormState } from '../types';

interface InputFormProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-2">
    {children}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="block w-full bg-white/10 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
  />
);


export const InputForm: React.FC<InputFormProps> = ({ formState, setFormState, onGenerate, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const isFormValid = formState.niche.trim() !== '' && formState.price.trim() !== '' && formState.goal.trim() !== '';

  return (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/10 sticky top-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Your Product Details</h2>
      <div className="space-y-6">
        <div>
          <Label htmlFor="niche">Product Niche</Label>
          <Input
            id="niche"
            name="niche"
            type="text"
            placeholder="e.g., vegan dog food"
            value={formState.niche}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="price">Product Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="e.g., 25"
            value={formState.price}
            onChange={handleChange}
            disabled={isLoading}
            min="0.01"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="goal">Revenue Goal ($)</Label>
          <Input
            id="goal"
            name="goal"
            type="number"
            placeholder="e.g., 1000"
            value={formState.goal}
            onChange={handleChange}
            disabled={isLoading}
            min="1"
            step="1"
          />
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading || !isFormValid}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating... (video may take a few minutes)
            </>
          ) : (
            'Generate Marketing Plan'
          )}
        </button>
      </div>
    </div>
  );
};

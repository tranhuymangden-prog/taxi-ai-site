
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, stepLabels }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-start">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center text-center w-24">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-lg ${
                    isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-200' : 
                    isCompleted ? 'bg-indigo-600 text-white' : 
                    'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <p className={`text-xs mt-2 font-medium break-words ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>
                  {stepLabels[i]}
                </p>
              </div>
              {step < totalSteps && (
                <div className={`flex-1 h-1 mt-5 transition-all duration-300 ${isCompleted ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;

import React from 'react';
import { PROVIDERS } from '../constants';
import { TranslationProvider } from '../types';

interface ProviderSelectorProps {
  selected: TranslationProvider;
  onChange: (provider: TranslationProvider) => void;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
      {PROVIDERS.map((provider) => {
        const isSelected = selected === provider.id;
        const Icon = provider.icon;
        
        return (
          <button
            key={provider.id}
            onClick={() => onChange(provider.id as TranslationProvider)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border
              ${isSelected 
                ? 'bg-surfaceHighlight border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                : 'bg-transparent border-transparent text-gray-400 hover:text-gray-200 hover:bg-surfaceHighlight/50'
              }
            `}
          >
            <Icon size={16} className={isSelected ? provider.color : 'text-gray-500'} />
            <span className={isSelected ? 'text-white' : ''}>{provider.name}</span>
            {isSelected && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_currentColor] text-primary"></span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ProviderSelector;
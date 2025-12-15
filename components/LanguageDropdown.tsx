import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { LANGUAGES } from '../constants';
import { Language } from '../types';

interface LanguageDropdownProps {
  selected: string;
  onChange: (code: string) => void;
  excludeAuto?: boolean;
  align?: 'left' | 'right';
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ 
  selected, 
  onChange, 
  excludeAuto = false,
  align = 'left' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableLanguages = LANGUAGES.filter(l => excludeAuto ? l.code !== 'auto' : true);
  const filteredLanguages = availableLanguages.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLang = LANGUAGES.find(l => l.code === selected);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-surfaceHighlight hover:bg-border rounded-xl transition-colors text-sm font-medium border border-border"
      >
        <span className="text-gray-200">{selectedLang?.name}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 w-64 max-h-80 bg-surface border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${align === 'right' ? 'right-0' : 'left-0'}`}>
          <div className="p-2 border-b border-border sticky top-0 bg-surface z-10">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surfaceHighlight text-white text-sm pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder-gray-600"
                autoFocus
              />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 p-1">
            {filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onChange(lang.code);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between text-sm transition-colors ${
                  selected === lang.code 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-300 hover:bg-surfaceHighlight'
                }`}
              >
                <div className="flex flex-col">
                    <span>{lang.name}</span>
                    <span className="text-xs text-gray-500">{lang.nativeName}</span>
                </div>
                {selected === lang.code && <Check size={14} />}
              </button>
            ))}
            {filteredLanguages.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No languages found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
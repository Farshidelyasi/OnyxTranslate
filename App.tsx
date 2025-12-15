import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightLeft, Copy, Sparkles, X, Volume2 } from 'lucide-react';
import LanguageDropdown from './components/LanguageDropdown';
import ProviderSelector from './components/ProviderSelector';
import { translateText } from './services/geminiService';
import { TranslationProvider, TranslationResult } from './types';
import { LANGUAGES } from './constants';

function App() {
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('fa'); // Default to Persian as requested implicitly
  const [provider, setProvider] = useState<TranslationProvider>(TranslationProvider.GOOGLE);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-translate with debounce
  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);

    if (!inputText.trim()) {
      setResult(null);
      setIsLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      handleTranslate();
    }, 1000); // 1s debounce

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText, sourceLang, targetLang, provider]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const data = await translateText(inputText, sourceLang, targetLang, provider);
      setResult(data);
    } catch (error) {
      console.error("Translation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') {
      // Can't swap if auto, maybe set source to detected?
      if (result?.detectedLanguage) {
        setSourceLang(targetLang);
        setTargetLang(result.detectedLanguage);
        setInputText(result.translatedText || '');
      } else {
        alert("Select a specific source language to swap.");
      }
    } else {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
      setInputText(result?.translatedText || '');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  const getDir = (langCode: string) => {
    const lang = LANGUAGES.find(l => l.code === langCode);
    return lang?.dir || 'ltr';
  };

  // Determine direction for inputs
  const inputDir = sourceLang === 'auto' ? 'ltr' : getDir(sourceLang);
  const outputDir = getDir(targetLang);

  return (
    <div className="min-h-screen bg-background text-gray-200 font-sans selection:bg-primary/30">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
               <Sparkles size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Onyx<span className="text-primary font-light">Translate</span></h1>
          </div>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors"
          >
            v1.0.0
          </a>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 max-w-5xl mx-auto">
        
        {/* Provider / Engine Selector */}
        <div className="text-center mb-2">
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-4 font-semibold">Select Engine Style</p>
          <ProviderSelector selected={provider} onChange={setProvider} />
        </div>

        {/* Translation Card */}
        <div className="bg-surface border border-border rounded-3xl shadow-2xl relative">
          
          {/* Controls Bar */}
          <div className="h-16 border-b border-border bg-surfaceHighlight/30 flex items-center justify-between px-2 sm:px-6 rounded-t-3xl relative z-20">
            <div className="flex-1 flex justify-start">
              <LanguageDropdown selected={sourceLang} onChange={setSourceLang} />
            </div>
            
            <button 
              onClick={handleSwapLanguages}
              className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all active:scale-95"
            >
              <ArrowRightLeft size={18} />
            </button>
            
            <div className="flex-1 flex justify-end">
              <LanguageDropdown selected={targetLang} onChange={setTargetLang} excludeAuto align="right" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row h-[500px] md:h-[400px] rounded-b-3xl overflow-hidden relative z-10">
            
            {/* Source Input */}
            <div className="flex-1 p-6 relative group border-b md:border-b-0 md:border-r border-border">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type to translate..."
                dir={inputDir}
                className="w-full h-full bg-transparent resize-none border-none outline-none text-lg sm:text-2xl text-white placeholder-gray-600 font-light leading-relaxed scrollbar-thin"
                spellCheck="false"
              />
              {inputText && (
                <button 
                  onClick={() => { setInputText(''); setResult(null); inputRef.current?.focus(); }}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-300 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
               <div className="absolute bottom-4 left-6 text-xs text-gray-600">
                {inputText.length} chars
              </div>
            </div>

            {/* Target Output */}
            <div className="flex-1 p-6 bg-surfaceHighlight/10 relative">
              {isLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-r-2 border-purple-500 rounded-full animate-spin animation-delay-200"></div>
                  </div>
                  <span className="text-sm text-gray-500 animate-pulse">Processing via {provider}...</span>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                   <div 
                      dir={result?.translatedText ? outputDir : 'ltr'} 
                      className={`w-full flex-1 text-lg sm:text-2xl font-medium leading-relaxed overflow-y-auto scrollbar-thin ${!result?.translatedText ? 'text-gray-700' : 'text-primaryGlow'}`}
                    >
                     {result?.translatedText || "Translation will appear here..."}
                   </div>
                   
                   {/* Extra Info: Transliteration */}
                   {result?.pronunciation && (
                     <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-sm text-gray-400 font-mono italic">{result.pronunciation}</p>
                     </div>
                   )}

                   {/* Alternatives */}
                   {result?.alternatives && result.alternatives.length > 0 && (
                     <div className="mt-2 flex flex-wrap gap-2">
                        {result.alternatives.map((alt, i) => (
                          <span key={i} className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded-md cursor-pointer hover:bg-white/10 transition-colors" onClick={() => copyToClipboard(alt)}>
                            {alt}
                          </span>
                        ))}
                     </div>
                   )}

                   {/* Output Actions */}
                   {result?.translatedText && (
                     <div className="mt-4 flex items-center justify-end gap-2">
                       <button onClick={() => copyToClipboard(result.translatedText)} className="p-2 text-gray-500 hover:text-white transition-colors" title="Copy">
                         <Copy size={18} />
                       </button>
                       <button className="p-2 text-gray-500 hover:text-white transition-colors" title="Listen">
                         <Volume2 size={18} />
                       </button>
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
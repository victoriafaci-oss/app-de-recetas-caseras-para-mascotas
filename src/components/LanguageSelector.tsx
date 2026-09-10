import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { Language } from '../types';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  idPrefix?: string;
  compact?: boolean;
  align?: 'left' | 'right';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  idPrefix = 'lang', 
  compact = false,
  align = 'right'
}) => {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        id={`${idPrefix}-btn`}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-full border border-stone-200/90 dark:border-stone-800 bg-stone-100/90 dark:bg-[#121B16] text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-[#E8B84A] hover:border-stone-300 dark:hover:border-stone-700 font-bold transition-all shadow-2xs cursor-pointer ${
          compact ? 'px-2 py-1 text-[11px]' : 'h-8 sm:h-9 px-2.5 sm:px-3 text-xs'
        }`}
        title="Cambiar idioma / Change language"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="font-mono text-xs uppercase">{currentLang.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1.5 w-48 rounded-2xl bg-white dark:bg-[#14221B] border border-[#E8DCCB] dark:border-[#D4AF37]/30 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100`}
        >
          <div className="px-3 py-1 text-[10px] uppercase font-bold text-stone-400 dark:text-[#E8B84A]/70 tracking-wider">
            Idiomas / Languages
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  id={`${idPrefix}-opt-${lang.code}`}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-amber-500/15 text-amber-900 dark:text-[#F3E5AB] font-bold' 
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#1A2E25]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 uppercase font-mono">({lang.code})</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

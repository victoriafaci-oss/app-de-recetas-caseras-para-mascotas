import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { Language } from '../types';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  idPrefix?: string;
  compact?: boolean;
  align?: 'left' | 'right' | 'center';
  dropDirection?: 'up' | 'down';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  idPrefix = 'lang', 
  compact = false,
  align = 'right',
  dropDirection = 'down',
}) => {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const alignClass = 
    align === 'left' ? 'left-0' : 
    align === 'center' ? 'left-1/2 -translate-x-1/2' : 
    'right-0';

  const positionClass = 
    dropDirection === 'up' 
      ? 'bottom-full mb-1.5' 
      : 'top-full mt-1.5';

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        id={`${idPrefix}-btn`}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-full border border-stone-200/90 dark:border-stone-800 bg-white/95 dark:bg-[#121B16] text-stone-700 dark:text-stone-300 hover:text-amber-700 dark:hover:text-[#E8B84A] hover:border-stone-300 dark:hover:border-stone-700 font-bold transition-all shadow-2xs cursor-pointer select-none ${
          compact ? 'px-2 py-1 text-[11px]' : 'h-8 sm:h-9 px-2.5 sm:px-3 text-xs'
        }`}
        title="Cambiar idioma / Change language / Changer de langue"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="font-mono text-xs uppercase font-extrabold">{currentLang.code}</span>
        <ChevronDown className={`w-3 h-3 text-stone-400 dark:text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Invisible backdrop for reliable outside clicks across devices */}
          <div 
            className="fixed inset-0 z-40 bg-black/10 dark:bg-black/25 backdrop-blur-[0.5px]"
            onClick={() => setIsOpen(false)}
          />

          <div 
            className={`absolute ${alignClass} ${positionClass} w-52 rounded-2xl bg-white dark:bg-[#14221B] border border-[#E8DCCB] dark:border-[#D4AF37]/35 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5`}
          >
            <div className="px-3 py-1 text-[10px] uppercase font-extrabold text-stone-400 dark:text-[#E8B84A]/80 tracking-wider flex items-center justify-between border-b border-stone-100 dark:border-stone-800/80 mb-1">
              <span>Idiomas / Languages</span>
              <Globe className="w-3 h-3 text-[#B8860B] dark:text-[#D4AF37]" />
            </div>
            <div className="max-h-64 overflow-y-auto py-0.5 space-y-0.5 px-1">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    id={`${idPrefix}-opt-${lang.code}`}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-[#B8860B]/15 dark:bg-[#D4AF37]/20 text-[#8B6508] dark:text-[#F3E5AB] font-bold' 
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#1A2E25]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <div className="flex flex-col">
                        <span className="font-medium text-xs leading-tight">{lang.nativeName}</span>
                        <span className="text-[10px] text-stone-400 dark:text-stone-500 leading-tight">({lang.name})</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37] stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

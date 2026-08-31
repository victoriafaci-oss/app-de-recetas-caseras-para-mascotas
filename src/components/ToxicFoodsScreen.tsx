import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOXIC_FOODS_CATALOG } from '../data/mockData';
import { ToxicFood } from '../types';
import { 
  ShieldAlert, 
  Search, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  PhoneCall, 
  Sparkles, 
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

export const ToxicFoodsScreen: React.FC = () => {
  const { language, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'lethal' | 'high' | 'moderate'>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<'all' | 'dog' | 'cat'>('all');

  const filteredItems = TOXIC_FOODS_CATALOG.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.toxicCompound.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSeverity = selectedSeverity === 'all' || item.severity === selectedSeverity;
    const matchesSpecies = selectedSpecies === 'all' || item.speciesAffected === 'all' || item.speciesAffected === selectedSpecies;
    return matchesSearch && matchesSeverity && matchesSpecies;
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-rose-50/90 via-stone-50 to-amber-50/60 dark:bg-gradient-to-br dark:from-rose-950 dark:via-stone-900 dark:to-[#121B15] border border-rose-200 dark:border-rose-500/30 text-stone-900 dark:text-white shadow-md dark:shadow-xl transition-colors duration-300">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            {language === 'es' ? 'Directorio de Seguridad & Toxicología' : 'Safety & Toxicology Directory'}
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
            {t('toxicTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-normal dark:font-light">
            {t('toxicSubtitle')}
          </p>
        </div>
      </div>

      {/* Emergency Hotline Alert Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/20 text-xs text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-800 dark:text-amber-400 shrink-0">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-sm block">{t('toxicEmergencyBannerTitle')}</span>
            <span>{t('toxicEmergencyBannerText')}</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 shadow-xs">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 dark:text-stone-400" />
          <input
            type="text"
            placeholder={t('toxicSearch')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden"
          />
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedSeverity('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedSeverity === 'all'
                ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-950 shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            {t('severityAll')} ({TOXIC_FOODS_CATALOG.length})
          </button>
          <button
            onClick={() => setSelectedSeverity('lethal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedSeverity === 'lethal'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-500/20'
            }`}
          >
            {t('severityLethal')}
          </button>
          <button
            onClick={() => setSelectedSeverity('high')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedSeverity === 'high'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-500/10 text-amber-900 dark:text-amber-400 border border-amber-500/20'
            }`}
          >
            {t('severityHigh')}
          </button>
          <button
            onClick={() => setSelectedSeverity('moderate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedSeverity === 'moderate'
                ? 'bg-yellow-600 text-white shadow-xs'
                : 'bg-yellow-500/10 text-yellow-900 dark:text-yellow-400 border border-yellow-500/20'
            }`}
          >
            {t('severityModerate')}
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((food) => {
          const isLethal = food.severity === 'lethal';
          const isHigh = food.severity === 'high';

          return (
            <div
              key={food.id}
              className={`rounded-2xl p-6 transition-all duration-200 border flex flex-col justify-between space-y-4 ${
                isLethal
                  ? 'bg-gradient-to-br from-white to-rose-50/50 dark:from-[#151012] dark:to-[#0F0A0C] border-rose-500/40 shadow-sm'
                  : isHigh
                  ? 'bg-gradient-to-br from-white to-amber-50/50 dark:from-[#14120E] dark:to-[#0F0D0A] border-amber-500/40 shadow-sm'
                  : 'bg-white dark:bg-[#121B15] border-stone-200 dark:border-stone-800'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-600 dark:text-stone-400">
                      {t('affectsTo')}: {food.speciesAffected === 'all' ? (language === 'es' ? '🐕 Perros y 🐈 Gatos' : '🐕 Dogs & 🐈 Cats') : food.speciesAffected === 'dog' ? (language === 'es' ? '🐕 Perros' : '🐕 Dogs') : (language === 'es' ? '🐈 Gatos' : '🐈 Cats')}
                    </span>
                    <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                      {food.name}
                    </h3>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 italic">
                      {food.scientificOrCommon}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 border ${
                    isLethal
                      ? 'bg-rose-600/15 text-rose-800 dark:text-rose-300 border-rose-600/30'
                      : isHigh
                      ? 'bg-amber-600/15 text-amber-900 dark:text-amber-300 border-amber-600/30'
                      : 'bg-yellow-600/15 text-yellow-900 dark:text-yellow-300 border-yellow-600/30'
                  }`}>
                    {isLethal ? (language === 'es' ? '💀 Nivel Letal' : '💀 Lethal Level') : isHigh ? (language === 'es' ? '⚠️ Riesgo Alto' : '⚠️ High Risk') : (language === 'es' ? '⚡ Moderado' : '⚡ Moderate')}
                  </span>
                </div>

                {/* Toxic Compound */}
                <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-black/30 border border-stone-200 dark:border-stone-800/80 text-xs text-stone-800 dark:text-stone-200 font-mono mb-3">
                  <span className="font-bold text-rose-700 dark:text-rose-400">{t('toxicCompound')}:</span> {food.toxicCompound}
                </div>

                {/* Symptoms */}
                <div className="space-y-1 text-xs text-stone-700 dark:text-stone-300 mb-3">
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">{t('clinicalSymptoms')}:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {food.symptoms.map((sym, idx) => (
                      <li key={idx}>{sym}</li>
                    ))}
                  </ul>
                </div>

                {/* Action */}
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-950 dark:text-rose-300">
                  <span className="font-bold block mb-0.5">{t('emergencyProtocol')}:</span>
                  <span>{food.emergencyAction}</span>
                </div>
              </div>

              {/* Safe Alternative */}
              {food.safeAlternatives && (
                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-start gap-2 text-xs text-emerald-950 dark:text-emerald-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-800 dark:text-emerald-400">{t('safeAlternative')}: </span>
                    <span>{food.safeAlternatives}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

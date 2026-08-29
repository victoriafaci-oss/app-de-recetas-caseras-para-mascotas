import React from 'react';
import { useApp } from '../context/AppContext';
import { playLuxuryChime } from '../utils/alertsAndAudio';
import { BellRing, Check, X, Volume2, Sparkles } from 'lucide-react';

export const AlarmModal: React.FC = () => {
  const { activeAlarm, dismissAlarm, toggleEventCompleted } = useApp();

  if (!activeAlarm) return null;

  const handleComplete = () => {
    toggleEventCompleted(activeAlarm.id);
    dismissAlarm();
  };

  const handleReplayChime = () => {
    playLuxuryChime('reminder');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121B15] border-2 border-amber-500 dark:border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.3)] text-stone-900 dark:text-stone-100 text-center relative overflow-hidden">
        
        {/* Decorative Golden Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Ringing Bell Icon Animation */}
        <div className="mx-auto mb-4 w-18 h-18 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 dark:from-[#D4AF37] dark:to-amber-700 p-0.5 shadow-xl flex items-center justify-center animate-bounce">
          <div className="w-full h-full bg-stone-900 rounded-[22px] flex items-center justify-center text-white dark:text-[#F3E5AB]">
            <BellRing className="w-8 h-8 animate-pulse text-[#D4AF37]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-900 dark:text-[#D4AF37] border border-amber-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Aviso Clínico de Salud & Nutrición
        </div>

        <h3 className="font-editorial text-2xl font-bold text-stone-900 dark:text-[#F3E5AB] mb-1">
          {activeAlarm.title}
        </h3>

        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 mb-3">
          Para: {activeAlarm.petName} &bull; Horario: {activeAlarm.time}
        </p>

        {activeAlarm.dosage && (
          <div className="p-3 rounded-xl bg-stone-100 dark:bg-[#0E1511] border border-stone-200 dark:border-[#D4AF37]/20 text-xs text-stone-700 dark:text-stone-300 font-medium mb-3">
            <span className="font-bold text-amber-700 dark:text-[#D4AF37]">Dosis / Instrucción:</span> {activeAlarm.dosage}
          </div>
        )}

        {activeAlarm.notes && (
          <p className="text-xs text-stone-700 dark:text-stone-300 mb-5 italic">
            "{activeAlarm.notes}"
          </p>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleComplete}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-[#D4AF37] dark:hover:bg-[#E5C358] text-white dark:text-stone-950 transition-all shadow-md"
          >
            <Check className="w-4 h-4" />
            Marcar Realizado
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={handleReplayChime}
              className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              title="Escuchar Alarma de nuevo"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={dismissAlarm}
              className="flex-1 py-3 px-3 rounded-xl text-xs font-semibold border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Posponer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

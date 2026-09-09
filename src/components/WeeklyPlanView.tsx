import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { generateWeeklyDietPlan, getCurrentWeekDates } from '../utils/dietPlanner';
import { DayDietPlan, DailyMealItem, DailySnackItem, DailyDessertItem } from '../types';
import { 
  CalendarRange, 
  Utensils, 
  Cookie, 
  IceCream, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  Sparkles, 
  ChefHat, 
  Info, 
  Eye, 
  Check, 
  X, 
  ChevronRight, 
  Calendar, 
  Scale, 
  Award,
  Printer,
  Heart,
  ChevronLeft,
  StickyNote,
  Edit3,
  Trash2,
  Plus,
  PenLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HighPerformanceExerciseAlert } from './HighPerformanceExerciseAlert';

export const WeeklyPlanView: React.FC = () => {
  const { 
    selectedPet, 
    pets, 
    selectPet, 
    weeklyTracking, 
    setMealStatus, 
    setExerciseStatus, 
    setDayNote,
    getTrackingForDay,
    t, 
    language,
    setActiveTab,
    showToast
  } = useApp();

  const weekDates = useMemo(() => getCurrentWeekDates(), []);

  const [avatarError, setAvatarError] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() => {
    const idx = weekDates.findIndex(d => d.isToday);
    return idx >= 0 ? idx : 0;
  });

  const [inspectingItem, setInspectingItem] = useState<{
    type: 'dish' | 'snack' | 'dessert';
    title: string;
    portionLabel: string;
    kcal?: number;
    ingredients: string[];
    description: string;
    clinicalBenefits?: string[];
    instructions?: string[];
    chefTip?: string;
  } | null>(null);

  const [exerciseModalDateKey, setExerciseModalDateKey] = useState<string | null>(null);
  const [customExerciseMin, setCustomExerciseMin] = useState<number>(30);
  const [customExerciseNotes, setCustomExerciseNotes] = useState<string>('');

  // Day Annotation modal state
  const [annotationModalDayIndex, setAnnotationModalDayIndex] = useState<number | null>(null);
  const [annotationText, setAnnotationText] = useState<string>('');

  const openAnnotationModal = (idx: number) => {
    const dateObj = weekDates[idx];
    if (!dateObj) return;
    const tracking = getTrackingForDay(selectedPet.id, dateObj.dateStr);
    setAnnotationText(tracking.dayNote || '');
    setAnnotationModalDayIndex(idx);
  };

  const handleSaveAnnotation = () => {
    if (annotationModalDayIndex === null) return;
    const dateObj = weekDates[annotationModalDayIndex];
    if (!dateObj) return;
    setDayNote(selectedPet.id, dateObj.dateStr, annotationText.trim());
    showToast(
      language === 'es'
        ? (annotationText.trim() ? '📝 ¡Anotación guardada con éxito!' : 'Anotación eliminada')
        : (annotationText.trim() ? '📝 Note saved successfully!' : 'Note removed'),
      'success'
    );
    setAnnotationModalDayIndex(null);
  };

  const handleDeleteAnnotation = () => {
    if (annotationModalDayIndex === null) return;
    const dateObj = weekDates[annotationModalDayIndex];
    if (!dateObj) return;
    setDayNote(selectedPet.id, dateObj.dateStr, '');
    showToast(
      language === 'es' ? 'Anotación eliminada' : 'Note deleted',
      'info'
    );
    setAnnotationModalDayIndex(null);
  };

  const toggleChip = (chip: string) => {
    setAnnotationText(prev => {
      if (prev.includes(chip)) {
        return prev.replace(chip, '').replace(/\n\s*\n+/g, '\n').trim();
      }
      return prev ? `${prev}\n• ${chip}` : `• ${chip}`;
    });
  };

  const quickNoteChips = useMemo(() => {
    return language === 'es' ? [
      '🥣 Comió todo con ganas',
      '🐾 Digestión y heces perfectas',
      '💧 Buena hidratación',
      '⚡ Muy activo y animado',
      '⏳ Comió más lento de lo normal',
      '🍗 Le encantó el plato 1',
      '🥩 Premio / Snack extra dado',
      '💊 Medicación/Suplemento al día',
      '⚠️ Heces algo blandas',
      '💤 Día tranquilo y descansado'
    ] : [
      '🥣 Ate everything with appetite',
      '🐾 Perfect digestion & stool',
      '💧 Well hydrated',
      '⚡ High energy & playful',
      '⏳ Ate slower than usual',
      '🍗 Loved meal 1',
      '🥩 Extra healthy treat given',
      '💊 Medication/Supplement taken',
      '⚠️ Softer stools observed',
      '💤 Calm and well rested'
    ];
  }, [language]);

  // Generate 7-day dynamic personalized plan for the selected pet
  const weeklyPlan: DayDietPlan[] = useMemo(() => {
    return generateWeeklyDietPlan(selectedPet, language);
  }, [selectedPet, language]);

  const activeDay = weeklyPlan[selectedDayIndex] || weeklyPlan[0];
  const activeDateInfo = weekDates[selectedDayIndex] || weekDates[0];
  const activeDayTracking = getTrackingForDay(selectedPet.id, activeDateInfo.dateStr);

  // Calculate week compliance statistics
  const weekStats = useMemo(() => {
    let totalItemsPlanned = 0;
    let totalGivenCount = 0;
    let totalNotGivenCount = 0;
    let daysWithExerciseCount = 0;

    weekDates.forEach(dateObj => {
      const tracking = getTrackingForDay(selectedPet.id, dateObj.dateStr);
      
      const mealKeys: ('dish1Given' | 'dish2Given' | 'snack1Given' | 'snack2Given' | 'dessert1Given' | 'dessert2Given')[] = [
        'dish1Given', 'dish2Given', 'snack1Given', 'snack2Given', 'dessert1Given', 'dessert2Given'
      ];

      mealKeys.forEach(k => {
        totalItemsPlanned++;
        if (tracking[k] === true) totalGivenCount++;
        else if (tracking[k] === false) totalNotGivenCount++;
      });

      if (tracking.exerciseCompleted) {
        daysWithExerciseCount++;
      }
    });

    const evaluatedCount = totalGivenCount + totalNotGivenCount;
    const adherencePercent = evaluatedCount > 0 ? Math.round((totalGivenCount / evaluatedCount) * 100) : 100;

    return {
      totalItemsPlanned,
      totalGivenCount,
      totalNotGivenCount,
      adherencePercent,
      daysWithExerciseCount,
    };
  }, [selectedPet.id, weekDates, weeklyTracking, getTrackingForDay]);

  const handlePrint = () => {
    window.print();
  };

  const activeDateFormatted = language === 'es' 
    ? `${activeDateInfo.dayFullNameEs}, ${activeDateInfo.dayNumber} de ${activeDateInfo.monthFullNameEs || activeDateInfo.monthName} de ${activeDateInfo.year || 2026}`
    : `${activeDateInfo.dayFullNameEn}, ${activeDateInfo.monthFullNameEn || activeDateInfo.monthName} ${activeDateInfo.dayNumber}, ${activeDateInfo.year || 2026}`;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="weekly-plan-container">
      {/* Top Header & Pet Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 dark:bg-[#0c1813]/90 backdrop-blur-md p-5 rounded-3xl border border-[#E8DCCB] dark:border-[#D4AF37]/20 shadow-sm">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setActiveTab('pet_profile')}
            className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border-2 border-[#D4AF37] shrink-0 shadow-inner cursor-pointer hover:scale-105 transition-transform"
            title={language === 'es' ? 'Ver Ficha de la Mascota' : 'View Pet Profile'}
          >
            {selectedPet.avatarUrl && !avatarError ? (
              <img 
                src={selectedPet.avatarUrl} 
                alt={selectedPet.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                {selectedPet.avatarIcon || (selectedPet.species === 'cat' ? '🐈' : '🐕')}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-stone-900 dark:text-[#F3E5AB]">
                {t('weeklyPlanTitle')}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#B8860B]/15 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#F3E5AB] border border-[#B8860B]/30 dark:border-[#D4AF37]/40">
                {selectedPet.name} ({selectedPet.weightKg} kg)
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
              {t('weeklyPlanSubtitle')}
            </p>
          </div>
        </div>

        {/* Action Controls & Pet Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {pets.length > 1 && (
            <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800/80 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-700">
              {pets.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectPet(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    p.id === selectedPet.id
                      ? 'bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handlePrint}
            id="btn-print-weekly-plan"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-stone-800/90 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-xs font-bold shadow-xs transition-all"
            title={language === 'es' ? 'Imprimir Plan Semanal' : 'Print Weekly Plan'}
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'es' ? 'Imprimir' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Week Adherence Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">
              {weekStats.totalGivenCount}
            </div>
            <div className="text-[11px] font-semibold text-emerald-800/70 dark:text-emerald-400">
              {language === 'es' ? 'Servidos (Verde)' : 'Served (Green)'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-rose-950/30 border border-rose-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-xs">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-rose-700 dark:text-rose-300">
              {weekStats.totalNotGivenCount}
            </div>
            <div className="text-[11px] font-semibold text-rose-800/70 dark:text-rose-400">
              {language === 'es' ? 'No dados (Rojo)' : 'Not served (Red)'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-amber-700 dark:text-amber-300">
              {weekStats.daysWithExerciseCount} / 7
            </div>
            <div className="text-[11px] font-semibold text-amber-800/70 dark:text-amber-400">
              {language === 'es' ? 'Días con Ejercicio' : 'Days with Exercise'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-500/10 dark:bg-purple-950/30 border border-purple-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-purple-700 dark:text-purple-300">
              {weekStats.adherencePercent}%
            </div>
            <div className="text-[11px] font-semibold text-purple-800/70 dark:text-purple-400">
              {language === 'es' ? 'Cumplimiento Dieta' : 'Diet Adherence'}
            </div>
          </div>
        </div>
      </div>

      {/* Week Calendar Day Selector Bar */}
      <div className="bg-white/90 dark:bg-[#0c1813]/90 backdrop-blur-md p-3 rounded-3xl border border-[#E8DCCB] dark:border-[#D4AF37]/20 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#D4AF37] px-2 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {language === 'es' ? 'Semana en Curso (7 Días Equilibrados)' : 'Current Week (7 Balanced Days)'}
          </span>
          <span className="text-[11px] text-stone-500 font-normal">
            {language === 'es' ? 'Haz clic en un día para ver o marcar platos' : 'Click a day to view or mark meals'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {weekDates.map((dateObj, idx) => {
            const isSelected = idx === selectedDayIndex;
            const dayDiet = weeklyPlan[idx] || weeklyPlan[0];
            const tracking = getTrackingForDay(selectedPet.id, dateObj.dateStr);

            // Compute given status summary for this specific day
            const statuses = [
              tracking.dish1Given,
              tracking.dish2Given,
              tracking.snack1Given,
              tracking.snack2Given,
              tracking.dessert1Given,
              tracking.dessert2Given,
            ];
            const givenCount = statuses.filter(s => s === true).length;
            const notGivenCount = statuses.filter(s => s === false).length;
            const hasNote = Boolean(tracking.dayNote && tracking.dayNote.trim().length > 0);

            return (
              <button
                key={dateObj.dateStr}
                onClick={() => setSelectedDayIndex(idx)}
                id={`btn-select-day-${idx}`}
                className={`relative p-3 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between min-h-[108px] cursor-pointer ${
                  isSelected
                    ? 'bg-[#B8860B] dark:bg-[#183126] text-white dark:text-[#F3E5AB] border-[#B8860B] dark:border-[#D4AF37] shadow-md scale-[1.02]'
                    : 'bg-stone-50 dark:bg-stone-900/60 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-stone-800 hover:border-[#D4AF37]/50'
                }`}
              >
                {dateObj.isToday && (
                  <span className={`absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    isSelected ? 'bg-amber-300 text-stone-950' : 'bg-[#B8860B] text-white'
                  }`}>
                    {t('todayLabel')}
                  </span>
                )}

                <div>
                  <div className="text-xs font-black uppercase leading-none">
                    {language === 'es' ? dateObj.dayFullNameEs : dateObj.dayFullNameEn}
                  </div>
                  <div className={`text-[11px] font-bold mt-1 ${isSelected ? 'text-amber-100 dark:text-[#D4AF37]' : 'text-stone-500 dark:text-stone-400'}`}>
                    {dateObj.dayNumber} {dateObj.monthName}
                  </div>
                </div>

                {/* Day Note Indicator / Quick Add Button */}
                <div className="my-1.5">
                  {hasNote ? (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        openAnnotationModal(idx);
                      }}
                      className={`group/note relative px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border shadow-2xs ${
                        isSelected
                          ? 'bg-amber-300 text-stone-950 border-amber-400 hover:bg-amber-200'
                          : 'bg-amber-500/15 dark:bg-[#F3E5AB]/20 text-amber-950 dark:text-[#F3E5AB] border-amber-500/30 dark:border-[#D4AF37]/40 hover:bg-amber-500/25'
                      }`}
                      title={`${language === 'es' ? 'Anotación guardada' : 'Saved note'}: ${tracking.dayNote}`}
                    >
                      <StickyNote className="w-3 h-3 text-amber-600 dark:text-[#D4AF37] shrink-0" />
                      <span className="truncate flex-1 font-bold">{tracking.dayNote}</span>
                      <span className="shrink-0 text-[9px] font-black underline opacity-80 group-hover/note:opacity-100">
                        {language === 'es' ? 'Ver' : 'View'}
                      </span>
                    </div>
                  ) : (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        openAnnotationModal(idx);
                      }}
                      className={`w-full py-0.5 px-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all border border-dashed cursor-pointer ${
                        isSelected
                          ? 'border-amber-200/60 text-amber-100 hover:bg-white/10 hover:border-amber-200'
                          : 'border-stone-300 dark:border-stone-700 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:border-stone-400'
                      }`}
                      title={language === 'es' ? 'Escribir anotación para este día' : 'Write note for this day'}
                    >
                      <PenLine className="w-2.5 h-2.5" />
                      <span>{language === 'es' ? '+ Anotar' : '+ Note'}</span>
                    </div>
                  )}
                </div>

                {/* Micro indicators for dishes, exercise & note */}
                <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Dados" />
                    <span className="text-[10px] font-bold">{givenCount}</span>
                    {notGivenCount > 0 && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-rose-500" title="No dados" />
                        <span className="text-[10px] font-bold text-rose-300">{notGivenCount}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasNote && (
                      <span
                        className={`text-[11px] flex items-center ${isSelected ? 'text-amber-300' : 'text-[#B8860B] dark:text-[#D4AF37]'}`}
                        title={language === 'es' ? 'Tiene anotación guardada' : 'Has saved note'}
                      >
                        📝
                      </span>
                    )}
                    {tracking.exerciseCompleted && (
                      <span className="text-[10px] font-extrabold text-amber-300 flex items-center">
                        🏃
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Selected Day Detail View */}
      <div className="space-y-6">
        {/* Day Focus Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] dark:bg-[#0f1f18] p-4 rounded-2xl border border-[#E8DCCB] dark:border-[#D4AF37]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B8860B]/15 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#D4AF37] flex items-center justify-center font-bold">
              <CalendarRange className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-stone-900 dark:text-[#F3E5AB]">
                  {activeDateFormatted}
                </h2>
                {activeDateInfo.isToday && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-xs">
                    {t('todayLabel')}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                {language === 'es' ? '2 Platos principales + 2 Snacks funcionales + 2 Postres digestivos' : '2 Main meals + 2 Functional snacks + 2 Digestive desserts'}
              </p>
            </div>
          </div>

          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {language === 'es' ? 'Verde = Dado' : 'Green = Served'}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> {language === 'es' ? 'Rojo = No dado' : 'Red = Not served'}
            </span>
          </div>
        </div>

        {/* Day Annotation Card */}
        {activeDayTracking.dayNote ? (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:from-[#D4AF37]/15 dark:to-transparent p-4 rounded-2xl border border-amber-300/60 dark:border-[#D4AF37]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                <StickyNote className="w-4 h-4" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-[#F3E5AB]">
                    {language === 'es' ? 'Anotación del día' : 'Day Note'}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                    {language === 'es' ? 'Guardada' : 'Saved'}
                  </span>
                </div>
                <p className="text-sm font-medium text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed">
                  {activeDayTracking.dayNote}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => openAnnotationModal(selectedDayIndex)}
                className="px-3 py-1.5 rounded-xl bg-[#F7E7CE] dark:bg-[#F3E5AB] hover:bg-[#ebd7b8] text-stone-950 text-xs font-black flex items-center gap-1.5 border border-[#E5D2B3] dark:border-[#D4AF37]/50 shadow-2xs transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-stone-950" />
                <span>{language === 'es' ? 'Modificar' : 'Edit'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDayNote(selectedPet.id, activeDateInfo.dateStr, '');
                  showToast(language === 'es' ? 'Anotación eliminada' : 'Note deleted', 'info');
                }}
                className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                title={language === 'es' ? 'Eliminar anotación' : 'Delete note'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 px-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#0c1813]/60 border border-[#E8DCCB] dark:border-[#D4AF37]/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-stone-600 dark:text-stone-400">
              <StickyNote className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37] shrink-0" />
              <span>
                {language === 'es' 
                  ? '¿Quieres dejar alguna anotación para este día? (apetito, digestión, observaciones...)' 
                  : 'Want to add a note for this day? (appetite, digestion, observations...)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => openAnnotationModal(selectedDayIndex)}
              className="px-3 py-1.5 rounded-xl bg-[#F7E7CE] dark:bg-[#F3E5AB] hover:bg-[#ebd7b8] text-stone-950 text-xs font-black flex items-center gap-1.5 border border-[#E5D2B3] dark:border-[#D4AF37]/50 shadow-2xs transition-all cursor-pointer shrink-0"
            >
              <PenLine className="w-3.5 h-3.5 text-stone-950" />
              <span>{language === 'es' ? 'Anotar cosas' : 'Add note'}</span>
            </button>
          </div>
        )}

        {/* Section 1: 2 Platos Recomendados del Día */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
              {t('recommendedDishes')}
            </h3>
            <span className="text-xs text-stone-500">
              {language === 'es' ? '2 platos adaptados según peso y necesidades' : '2 tailored main meals'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dish 1 */}
            <MealCard
              title={activeDay.dish1.title}
              timingLabel={t('dishMorning')}
              timingIcon="🌅"
              portionGrams={activeDay.dish1.portionGrams}
              kcal={activeDay.dish1.kcal}
              ingredients={activeDay.dish1.ingredients}
              description={activeDay.dish1.description}
              instructions={activeDay.dish1.instructions}
              status={activeDayTracking.dish1Given}
              onSetStatus={(status) => setMealStatus(selectedPet.id, activeDateInfo.dateStr, 'dish1', status)}
              onInspect={() => setInspectingItem({
                type: 'dish',
                title: activeDay.dish1.title,
                portionLabel: `${activeDay.dish1.portionGrams}g`,
                kcal: activeDay.dish1.kcal,
                ingredients: activeDay.dish1.ingredients.map(ing => ing.grams > 0 ? `${ing.name} (${ing.grams}g)` : ing.name),
                description: activeDay.dish1.description,
                clinicalBenefits: activeDay.dish1.clinicalBenefits,
                instructions: activeDay.dish1.instructions,
                chefTip: activeDay.dish1.chefTip,
              })}
              language={language}
              t={t}
            />

            {/* Dish 2 */}
            <MealCard
              title={activeDay.dish2.title}
              timingLabel={t('dishNight')}
              timingIcon="🌙"
              portionGrams={activeDay.dish2.portionGrams}
              kcal={activeDay.dish2.kcal}
              ingredients={activeDay.dish2.ingredients}
              description={activeDay.dish2.description}
              instructions={activeDay.dish2.instructions}
              status={activeDayTracking.dish2Given}
              onSetStatus={(status) => setMealStatus(selectedPet.id, activeDateInfo.dateStr, 'dish2', status)}
              onInspect={() => setInspectingItem({
                type: 'dish',
                title: activeDay.dish2.title,
                portionLabel: `${activeDay.dish2.portionGrams}g`,
                kcal: activeDay.dish2.kcal,
                ingredients: activeDay.dish2.ingredients.map(ing => ing.grams > 0 ? `${ing.name} (${ing.grams}g)` : ing.name),
                description: activeDay.dish2.description,
                clinicalBenefits: activeDay.dish2.clinicalBenefits,
                instructions: activeDay.dish2.instructions,
                chefTip: activeDay.dish2.chefTip,
              })}
              language={language}
              t={t}
            />
          </div>
        </div>

        {/* Section 2: 2 Snacks Permitidos del Día */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Cookie className="w-4 h-4 text-amber-500" />
              {t('permittedSnacks')}
            </h3>
            <span className="text-xs text-stone-500">
              {language === 'es' ? '100% seguros y bajos en grasa' : 'Safe & functional low-fat treats'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Snack 1 */}
            <SnackDessertCard
              itemType="snack"
              indexLabel="Snack 1"
              title={activeDay.snack1.title}
              portion={activeDay.snack1.portion}
              benefits={activeDay.snack1.benefits}
              ingredients={activeDay.snack1.ingredients}
              description={activeDay.snack1.description}
              status={activeDayTracking.snack1Given}
              onSetStatus={(status) => setMealStatus(selectedPet.id, activeDateInfo.dateStr, 'snack1', status)}
              onInspect={() => setInspectingItem({
                type: 'snack',
                title: activeDay.snack1.title,
                portionLabel: activeDay.snack1.portion,
                ingredients: activeDay.snack1.ingredients,
                description: activeDay.snack1.description,
                clinicalBenefits: [activeDay.snack1.benefits],
              })}
              language={language}
              t={t}
            />

            {/* Snack 2 */}
            <SnackDessertCard
              itemType="snack"
              indexLabel="Snack 2"
              title={activeDay.snack2.title}
              portion={activeDay.snack2.portion}
              benefits={activeDay.snack2.benefits}
              ingredients={activeDay.snack2.ingredients}
              description={activeDay.snack2.description}
              status={activeDayTracking.snack2Given}
              onSetStatus={(status) => setMealStatus(selectedPet.id, activeDateInfo.dateStr, 'snack2', status)}
              onInspect={() => setInspectingItem({
                type: 'snack',
                title: activeDay.snack2.title,
                portionLabel: activeDay.snack2.portion,
                ingredients: activeDay.snack2.ingredients,
                description: activeDay.snack2.description,
                clinicalBenefits: [activeDay.snack2.benefits],
              })}
              language={language}
              t={t}
            />
          </div>
        </div>

        {/* Section 3: 2 Postres Permitidos del Día */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <IceCream className="w-4 h-4 text-purple-500" />
              {t('permittedDesserts')}
            </h3>
            <span className="text-xs text-stone-500">
              {language === 'es' ? 'Gelatinas de colágeno y probióticos' : 'Collagen jellies & natural probiotics'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dessert 1 */}
            <SnackDessertCard
              itemType="dessert"
              indexLabel="Postre 1"
              title={activeDay.dessert1.title}
              portion={activeDay.dessert1.portion}
              benefits={activeDay.dessert1.benefits}
              ingredients={activeDay.dessert1.ingredients}
              description={activeDay.dessert1.description}
              status={activeDayTracking.dessert1Given}
              onSetStatus={(status) => setMealStatus(selectedPet.id, activeDateInfo.dateStr, 'dessert1', status)}
              onInspect={() => setInspectingItem({
                type: 'dessert',
                title: activeDay.dessert1.title,
                portionLabel: activeDay.dessert1.portion,
                ingredients: activeDay.dessert1.ingredients,
                description: activeDay.dessert1.description,
                clinicalBenefits: [activeDay.dessert1.benefits],
              })}
              language={language}
              t={t}
            />

            {/* Dessert 2 */}
            <SnackDessertCard
              itemType="dessert"
              indexLabel="Postre 2"
              title={activeDay.dessert2.title}
              portion={activeDay.dessert2.portion}
              benefits={activeDay.dessert2.benefits}
              ingredients={activeDay.dessert2.ingredients}
              description={activeDay.dessert2.description}
              status={activeDayTracking.dessert2Given}
              onSetStatus={(status) => setMealStatus(selectedPet.id, activeDateInfo.dateStr, 'dessert2', status)}
              onInspect={() => setInspectingItem({
                type: 'dessert',
                title: activeDay.dessert2.title,
                portionLabel: activeDay.dessert2.portion,
                ingredients: activeDay.dessert2.ingredients,
                description: activeDay.dessert2.description,
                clinicalBenefits: [activeDay.dessert2.benefits],
              })}
              language={language}
              t={t}
            />
          </div>
        </div>

        {/* Section 4: Ejercicio Realizado Diario */}
        <div className="p-5 rounded-3xl bg-white/90 dark:bg-[#0c1813]/90 border border-[#E8DCCB] dark:border-[#D4AF37]/20 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 dark:text-[#F3E5AB]">
                  {t('exerciseCompleted')} &bull; {language === 'es' ? activeDay.exerciseTarget.activityTypeEs : activeDay.exerciseTarget.activityTypeEn}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {language === 'es' ? 'Meta recomendada:' : 'Recommended target:'} <span className="font-bold text-stone-800 dark:text-stone-200">{activeDay.exerciseTarget.durationMin} min</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextState = !activeDayTracking.exerciseCompleted;
                  setExerciseStatus(
                    selectedPet.id, 
                    activeDateInfo.dateStr, 
                    nextState, 
                    nextState ? activeDay.exerciseTarget.durationMin : 0
                  );
                }}
                className={`flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  activeDayTracking.exerciseCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-500/20'
                }`}
              >
                {activeDayTracking.exerciseCompleted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{language === 'es' ? `Realizado (${activeDayTracking.exerciseDurationMin || activeDay.exerciseTarget.durationMin}m)` : `Done (${activeDayTracking.exerciseDurationMin || activeDay.exerciseTarget.durationMin}m)`}</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>{language === 'es' ? 'Marcar como Hecho' : 'Mark as Done'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setExerciseModalDateKey(activeDateInfo.dateStr);
                  setCustomExerciseMin(activeDayTracking.exerciseDurationMin || activeDay.exerciseTarget.durationMin);
                  setCustomExerciseNotes(activeDayTracking.exerciseNotes || '');
                }}
                className="py-2 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 text-xs font-bold"
                title={language === 'es' ? 'Personalizar minutos/notas' : 'Custom duration/notes'}
              >
                📝 {language === 'es' ? 'Detallar' : 'Edit'}
              </button>
            </div>
          </div>

          {/* Critical digestive & activity warning */}
          <HighPerformanceExerciseAlert pet={selectedPet} language={language} variant="compact" />

          <div className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            <span className="font-bold text-stone-800 dark:text-stone-200">
              {language === 'es' ? 'Indicación de ejercicio:' : 'Exercise notes:'}
            </span>{' '}
            {language === 'es' ? activeDay.exerciseTarget.notesEs : activeDay.exerciseTarget.notesEn}
            {activeDayTracking.exerciseNotes && (
              <div className="mt-2 pt-2 border-t border-stone-200/60 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                📝 {language === 'es' ? 'Notas del dueño:' : 'Owner notes:'} {activeDayTracking.exerciseNotes}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Week Master Overview Grid (Visión Semanal Resumen a un Golpe de Vista) */}
      <div className="bg-white/90 dark:bg-[#0c1813]/90 backdrop-blur-md p-5 rounded-3xl border border-[#E8DCCB] dark:border-[#D4AF37]/20 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-stone-900 dark:text-[#F3E5AB] flex items-center gap-2">
              <CalendarRange className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
              {t('weeklyOverviewTitle')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t('weeklyOverviewSubtitle')}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#B8860B]/15 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#F3E5AB]">
            7 / 7 {language === 'es' ? 'Días' : 'Days'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 font-bold">
                <th className="py-2.5 px-3">{language === 'es' ? 'Día & Fecha' : 'Day & Date'}</th>
                <th className="py-2.5 px-3">{t('dishMorning')}</th>
                <th className="py-2.5 px-3">{t('dishNight')}</th>
                <th className="py-2.5 px-3">{t('permittedSnacks')}</th>
                <th className="py-2.5 px-3">{t('permittedDesserts')}</th>
                <th className="py-2.5 px-3">{t('exerciseCompleted')}</th>
                <th className="py-2.5 px-3">{language === 'es' ? 'Anotación' : 'Notes'}</th>
                <th className="py-2.5 px-3 text-right">{language === 'es' ? 'Acción' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {weekDates.map((dateObj, idx) => {
                const day = weeklyPlan[idx] || weeklyPlan[0];
                const tracking = getTrackingForDay(selectedPet.id, dateObj.dateStr);
                const isDaySelected = idx === selectedDayIndex;

                return (
                  <tr 
                    key={dateObj.dateStr}
                    className={`hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors ${
                      dateObj.isToday ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        {language === 'es' ? dateObj.dayFullNameEs : dateObj.dayFullNameEn}
                        {dateObj.isToday && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#B8860B] text-white">
                            {t('todayLabel')}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">
                        {dateObj.dayNumber} {dateObj.monthName}
                      </div>
                    </td>

                    {/* Dish 1 Status Badge */}
                    <td className="py-3 px-3">
                      <StatusBadge
                        status={tracking.dish1Given}
                        title={day.dish1.title}
                        onToggle={(status) => setMealStatus(selectedPet.id, dateObj.dateStr, 'dish1', status)}
                        language={language}
                      />
                    </td>

                    {/* Dish 2 Status Badge */}
                    <td className="py-3 px-3">
                      <StatusBadge
                        status={tracking.dish2Given}
                        title={day.dish2.title}
                        onToggle={(status) => setMealStatus(selectedPet.id, dateObj.dateStr, 'dish2', status)}
                        language={language}
                      />
                    </td>

                    {/* Snacks Status Badges */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge
                          status={tracking.snack1Given}
                          title={day.snack1.title}
                          onToggle={(status) => setMealStatus(selectedPet.id, dateObj.dateStr, 'snack1', status)}
                          language={language}
                          compact
                        />
                        <StatusBadge
                          status={tracking.snack2Given}
                          title={day.snack2.title}
                          onToggle={(status) => setMealStatus(selectedPet.id, dateObj.dateStr, 'snack2', status)}
                          language={language}
                          compact
                        />
                      </div>
                    </td>

                    {/* Desserts Status Badges */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge
                          status={tracking.dessert1Given}
                          title={day.dessert1.title}
                          onToggle={(status) => setMealStatus(selectedPet.id, dateObj.dateStr, 'dessert1', status)}
                          language={language}
                          compact
                        />
                        <StatusBadge
                          status={tracking.dessert2Given}
                          title={day.dessert2.title}
                          onToggle={(status) => setMealStatus(selectedPet.id, dateObj.dateStr, 'dessert2', status)}
                          language={language}
                          compact
                        />
                      </div>
                    </td>

                    {/* Exercise Status */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => {
                          const nextState = !tracking.exerciseCompleted;
                          setExerciseStatus(
                            selectedPet.id, 
                            dateObj.dateStr, 
                            nextState, 
                            nextState ? day.exerciseTarget.durationMin : 0
                          );
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          tracking.exerciseCompleted
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        {tracking.exerciseCompleted ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>{tracking.exerciseDurationMin || day.exerciseTarget.durationMin}m</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-stone-400" />
                            <span>{day.exerciseTarget.durationMin}m</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Day Note Cell */}
                    <td className="py-3 px-3">
                      {tracking.dayNote ? (
                        <button
                          type="button"
                          onClick={() => openAnnotationModal(idx)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-950 dark:text-amber-200 border border-amber-500/30 hover:bg-amber-500/25 max-w-[150px] truncate cursor-pointer"
                          title={`${language === 'es' ? 'Modificar anotación' : 'Edit note'}: ${tracking.dayNote}`}
                        >
                          <StickyNote className="w-3 h-3 text-[#B8860B] dark:text-[#D4AF37] shrink-0" />
                          <span className="truncate">{tracking.dayNote}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openAnnotationModal(idx)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                          title={language === 'es' ? 'Añadir anotación para este día' : 'Add note for this day'}
                        >
                          <Plus className="w-3 h-3" />
                          <span>{language === 'es' ? 'Anotar' : 'Note'}</span>
                        </button>
                      )}
                    </td>

                    {/* Inspect Day Button */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedDayIndex(idx);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`p-1.5 rounded-xl transition-all ${
                          isDaySelected
                            ? 'bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                        }`}
                        title={language === 'es' ? 'Ver detalle del día' : 'View day details'}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Recipe Inspection Modal */}
      <AnimatePresence>
        {inspectingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0e1d17] border border-[#E8DCCB] dark:border-[#D4AF37]/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#B8860B]/15 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#D4AF37]">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-stone-900 dark:text-[#F3E5AB]">
                      {inspectingItem.title}
                    </h3>
                    <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-[#B8860B] dark:text-[#D4AF37]">
                        {inspectingItem.portionLabel} {language === 'es' ? 'por ración' : 'per serving'}
                      </span>
                      {inspectingItem.kcal && (
                        <>
                          •
                          <span>{inspectingItem.kcal} kcal</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setInspectingItem(null)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rationale / Description */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  {language === 'es' ? 'Beneficio Nutricional:' : 'Nutritional Benefit:'}
                </span>{' '}
                {inspectingItem.description}
              </div>

              {/* Clinical Benefits if present */}
              {inspectingItem.clinicalBenefits && inspectingItem.clinicalBenefits.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {inspectingItem.clinicalBenefits.map((b, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      ✓ {b}
                    </span>
                  ))}
                </div>
              )}

              {/* Ingredients */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-2">
                  {language === 'es' ? 'Ingredientes Porcionados' : 'Portioned Ingredients'}
                </h4>
                <ul className="space-y-1.5">
                  {inspectingItem.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37]" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions if available */}
              {inspectingItem.instructions && inspectingItem.instructions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-2">
                    {language === 'es' ? 'Preparación Rápida' : 'Preparation Instructions'}
                  </h4>
                  <ol className="space-y-2">
                    {inspectingItem.instructions.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        <span className="w-4 h-4 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Chef Tip */}
              {inspectingItem.chefTip && (
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200">
                  <span className="font-bold">👨‍🍳 Tip:</span> {inspectingItem.chefTip}
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => setInspectingItem(null)}
                  className="w-full py-2.5 rounded-2xl bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold text-xs shadow-md transition-all hover:opacity-90"
                >
                  {t('closeRecipeModal')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Exercise Modal */}
      <AnimatePresence>
        {exerciseModalDateKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0e1d17] border border-[#E8DCCB] dark:border-[#D4AF37]/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                <h3 className="text-base font-black text-stone-900 dark:text-[#F3E5AB] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-500" />
                  {t('logExerciseBtn')}
                </h3>
                <button
                  onClick={() => setExerciseModalDateKey(null)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {language === 'es' ? 'Minutos caminados / ejercitados' : 'Minutes exercised'}
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    step="5"
                    value={customExerciseMin}
                    onChange={(e) => setCustomExerciseMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {language === 'es' ? 'Notas de comportamiento o ruta' : 'Behavior or walk notes'}
                  </label>
                  <textarea
                    rows={3}
                    value={customExerciseNotes}
                    onChange={(e) => setCustomExerciseNotes(e.target.value)}
                    placeholder={language === 'es' ? 'Paseo en parque, ritmo alegre...' : 'Park walk, energetic pace...'}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setExerciseModalDateKey(null)}
                  className="flex-1 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs"
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    setExerciseStatus(selectedPet.id, exerciseModalDateKey, true, customExerciseMin, customExerciseNotes);
                    setExerciseModalDateKey(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                >
                  {language === 'es' ? 'Guardar Ejercicio' : 'Save Exercise'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Day Annotation Modal */}
      <AnimatePresence>
        {annotationModalDayIndex !== null && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setAnnotationModalDayIndex(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0e1d17] border border-[#E8DCCB] dark:border-[#D4AF37]/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-[#FAF7F2] dark:bg-[#16271F] border-b border-[#E8DCCB] dark:border-[#D4AF37]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 dark:bg-[#D4AF37]/20 text-[#B8860B] dark:text-[#D4AF37] flex items-center justify-center shrink-0">
                    <StickyNote className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-stone-900 dark:text-[#F3E5AB]">
                      {language === 'es' ? 'Anotación del Día' : 'Day Note & Observations'}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {weekDates[annotationModalDayIndex] && (
                        language === 'es'
                          ? `${weekDates[annotationModalDayIndex].dayFullNameEs}, ${weekDates[annotationModalDayIndex].dayNumber} de ${weekDates[annotationModalDayIndex].monthName} • ${selectedPet.name}`
                          : `${weekDates[annotationModalDayIndex].dayFullNameEn}, ${weekDates[annotationModalDayIndex].monthName} ${weekDates[annotationModalDayIndex].dayNumber} • ${selectedPet.name}`
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAnnotationModalDayIndex(null)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-5 space-y-4">
                {/* Quick Chips */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2">
                    {language === 'es' ? 'Atajos rápidos (pulsa para añadir):' : 'Quick tags (tap to insert):'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {quickNoteChips.map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        type="button"
                        onClick={() => toggleChip(chip)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          annotationText.includes(chip)
                            ? 'bg-amber-500/20 text-amber-950 dark:text-[#F3E5AB] border-amber-500/40 font-bold shadow-2xs'
                            : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Area */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1.5">
                    {language === 'es' ? 'Texto de la anotación:' : 'Note text:'}
                  </label>
                  <textarea
                    value={annotationText}
                    onChange={(e) => setAnnotationText(e.target.value)}
                    rows={4}
                    placeholder={
                      language === 'es'
                        ? 'Ej: Hoy comió con muchas ganas. Heces firmes y digestión excelente. Tuvo mucha energía en el paseo...'
                        : 'E.g.: Ate with high appetite today. Good stool and digestion. Energetic during morning walk...'
                    }
                    className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 resize-none"
                    autoFocus
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    {language === 'es' 
                      ? 'La anotación se guardará para este día y verás un distintivo en el calendario semanal.' 
                      : 'Note will be saved for this day with a badge in the weekly calendar.'}
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 bg-[#FAF7F2] dark:bg-[#16271F] border-t border-[#E8DCCB] dark:border-[#D4AF37]/20 flex items-center justify-between gap-2">
                {annotationModalDayIndex !== null && getTrackingForDay(selectedPet.id, weekDates[annotationModalDayIndex]?.dateStr || '').dayNote ? (
                  <button
                    type="button"
                    onClick={handleDeleteAnnotation}
                    className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{language === 'es' ? 'Eliminar nota' : 'Delete note'}</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAnnotationModalDayIndex(null)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    {language === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAnnotation}
                    className="px-4 py-2 rounded-xl bg-[#F7E7CE] dark:bg-[#F3E5AB] hover:bg-[#ebd7b8] text-stone-950 text-xs font-black flex items-center gap-1.5 border border-[#E5D2B3] dark:border-[#D4AF37]/50 shadow-xs transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-stone-950" />
                    <span>{language === 'es' ? 'Guardar anotación' : 'Save note'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Meal Card Component (Plato 1 y Plato 2)
interface MealCardProps {
  title: string;
  timingLabel: string;
  timingIcon: string;
  portionGrams: number;
  kcal: number;
  ingredients: { name: string; grams: number; category: string }[];
  description: string;
  instructions: string[];
  status: boolean | null;
  onSetStatus: (status: boolean | null) => void;
  onInspect: () => void;
  language: string;
  t: (key: any) => string;
}

const MealCard: React.FC<MealCardProps> = ({
  title,
  timingLabel,
  timingIcon,
  portionGrams,
  kcal,
  ingredients,
  description,
  status,
  onSetStatus,
  onInspect,
  language,
  t,
}) => {
  return (
    <div className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
      status === true
        ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 shadow-sm'
        : status === false
        ? 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/40 shadow-sm'
        : 'bg-white/90 dark:bg-[#0c1813]/90 border-[#E8DCCB] dark:border-[#D4AF37]/20 shadow-xs'
    }`}>
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#B8860B] dark:text-[#D4AF37] uppercase tracking-wider mb-1">
            <span>{timingIcon}</span>
            <span>{timingLabel}</span>
          </div>
          <h4 className="text-base font-black text-stone-900 dark:text-[#F3E5AB] leading-snug">
            {title}
          </h4>
        </div>

        {/* Status Indicator Pill */}
        <div className="shrink-0">
          {status === true && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('statusGivenYes')}</span>
            </span>
          )}
          {status === false && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-xs">
              <XCircle className="w-3.5 h-3.5" />
              <span>{t('statusGivenNo')}</span>
            </span>
          )}
          {status === null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
              <Clock className="w-3.5 h-3.5" />
              <span>{t('statusPending')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
          <Scale className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
          <span>{portionGrams} g {language === 'es' ? 'ración' : 'portion'}</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
        <div className="flex items-center gap-1.5 font-semibold text-stone-600 dark:text-stone-300">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>{kcal} kcal</span>
        </div>
      </div>

      {/* Key Ingredients Preview */}
      <div className="text-xs text-stone-600 dark:text-stone-400">
        <span className="font-bold text-stone-800 dark:text-stone-200">
          {language === 'es' ? 'Ingredientes clave:' : 'Key ingredients:'}
        </span>{' '}
        {ingredients.slice(0, 3).map(i => i.name).join(', ')}...
      </div>

      {/* Dual Controls: Green (Sí se dio) / Red (No se dio) / Inspect (Ver) */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800/80">
        {/* Yes Button (Green) - Smaller tab */}
        <button
          onClick={() => onSetStatus(status === true ? null : true)}
          className={`flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            status === true
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
          }`}
        >
          <Check className="w-3 h-3 shrink-0" />
          <span className="truncate">{language === 'es' ? 'Sí se dio' : 'Served (Yes)'}</span>
        </button>

        {/* No Button (Red) - Smaller tab */}
        <button
          onClick={() => onSetStatus(status === false ? null : false)}
          className={`flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            status === false
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/20'
          }`}
        >
          <X className="w-3 h-3 shrink-0" />
          <span className="truncate">{language === 'es' ? 'No se dio' : 'Not served'}</span>
        </button>

        {/* Inspect Recipe - 'Ver' Button with Champagne background and black text */}
        <button
          onClick={onInspect}
          className="py-1 px-2.5 sm:px-3 rounded-lg bg-[#F7E7CE] dark:bg-[#F3E5AB] hover:bg-[#ebd7b8] active:bg-[#dfc8a5] text-stone-950 border border-[#E5D2B3] dark:border-[#D4AF37]/50 shadow-2xs text-[11px] font-black transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer"
          title={t('ingredientsAndRecipe')}
        >
          <Eye className="w-3 h-3 text-stone-950 shrink-0" />
          <span className="text-stone-950 font-black tracking-wide">{language === 'es' ? 'Ver' : 'View'}</span>
        </button>
      </div>
    </div>
  );
};

// Snack & Dessert Card Component
interface SnackDessertCardProps {
  itemType: 'snack' | 'dessert';
  indexLabel: string;
  title: string;
  portion: string;
  benefits: string;
  ingredients: string[];
  description: string;
  status: boolean | null;
  onSetStatus: (status: boolean | null) => void;
  onInspect: () => void;
  language: string;
  t: (key: any) => string;
}

const SnackDessertCard: React.FC<SnackDessertCardProps> = ({
  itemType,
  indexLabel,
  title,
  portion,
  benefits,
  description,
  status,
  onSetStatus,
  onInspect,
  language,
}) => {
  const isSnack = itemType === 'snack';

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${
      status === true
        ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40'
        : status === false
        ? 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/40'
        : 'bg-white/80 dark:bg-[#0c1813]/80 border-stone-200/80 dark:border-stone-800'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            isSnack 
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400' 
              : 'bg-purple-500/15 text-purple-700 dark:text-purple-400'
          }`}>
            {indexLabel}
          </span>
          <h5 className="text-sm font-bold text-stone-900 dark:text-[#F3E5AB] mt-1.5 leading-snug">
            {title}
          </h5>
        </div>

        <div className="text-right text-[11px] font-semibold text-stone-500 dark:text-stone-400">
          <span className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-[10px]">
            {portion}
          </span>
        </div>
      </div>

      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
        {description}
      </p>

      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
        ✓ {benefits}
      </div>

      {/* Control Buttons: Smaller tabs & Champagne 'Ver' button */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
        <button
          onClick={() => onSetStatus(status === true ? null : true)}
          className={`flex-1 py-1 px-1.5 sm:px-2 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            status === true
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
          }`}
        >
          <Check className="w-3 h-3 shrink-0" />
          <span className="truncate">{language === 'es' ? 'Sí se dio' : 'Given'}</span>
        </button>

        <button
          onClick={() => onSetStatus(status === false ? null : false)}
          className={`flex-1 py-1 px-1.5 sm:px-2 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            status === false
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400'
          }`}
        >
          <X className="w-3 h-3 shrink-0" />
          <span className="truncate">{language === 'es' ? 'No se dio' : 'No'}</span>
        </button>

        <button
          onClick={onInspect}
          className="py-1 px-2.5 sm:px-3 rounded-lg bg-[#F7E7CE] dark:bg-[#F3E5AB] hover:bg-[#ebd7b8] active:bg-[#dfc8a5] text-stone-950 border border-[#E5D2B3] dark:border-[#D4AF37]/50 shadow-2xs text-[10px] sm:text-[11px] font-black transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer"
          title={language === 'es' ? 'Ver detalles' : 'View details'}
        >
          <Eye className="w-3 h-3 text-stone-950 shrink-0" />
          <span className="text-stone-950 font-black tracking-wide">{language === 'es' ? 'Ver' : 'View'}</span>
        </button>
      </div>
    </div>
  );
};

// Compact Status Badge for Master Table
interface StatusBadgeProps {
  status: boolean | null;
  title: string;
  onToggle: (status: boolean | null) => void;
  language: string;
  compact?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, title, onToggle, compact = false }) => {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => {
          if (status === null) onToggle(true);
          else if (status === true) onToggle(false);
          else onToggle(null);
        }}
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
          status === true
            ? 'bg-emerald-500 text-white shadow-xs'
            : status === false
            ? 'bg-rose-500 text-white shadow-xs'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
        }`}
        title={`${title} - Haz clic para cambiar (Verde / Rojo / Pendiente)`}
      >
        {status === true ? (
          <Check className="w-3 h-3 stroke-[3]" />
        ) : status === false ? (
          <X className="w-3 h-3 stroke-[3]" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-stone-400" />
        )}
        {!compact && <span className="truncate max-w-[120px]">{title}</span>}
      </button>
    </div>
  );
};

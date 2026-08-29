import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMER, getConditionClinicalAlerts } from '../utils/nutrition';
import { AddPetModal } from './AddPetModal';
import { 
  HeartPulse, 
  CalendarDays, 
  BookOpen, 
  Bot, 
  PlusCircle, 
  Sparkles, 
  Droplet, 
  Flame, 
  Utensils, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Clock,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    pets, 
    selectedPetId, 
    selectPet, 
    setActiveTab, 
    events, 
    toggleEventCompleted,
    t,
    language 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);

  const selectedPet = pets.find(p => p.id === selectedPetId) || pets[0];
  const pendingEvents = events.filter(e => !e.completed).slice(0, 3);

  const hubNavigationCards = [
    {
      id: 'recipes' as const,
      title: language === 'es' ? 'Recetario Casero & Escalador' : 'Homemade Recipes & Scaler',
      subtitle: language === 'es' ? 'Cocina Natural & Batch Cooking' : 'Natural Cooking & Batch Prep',
      description: language === 'es' 
        ? 'Catálogo de recetas balanceadas para perros y gatos, caldos con colágeno y cálculo automático de porciones para cocinar varios días.'
        : 'Catalog of balanced recipes for dogs and cats, bone broths with collagen, and automatic multi-day batch cooking portion scaler.',
      icon: BookOpen,
      badge: language === 'es' ? 'Cocina & Porciones' : 'Cooking & Portions',
      color: 'from-amber-500/15 via-amber-500/5 to-transparent text-amber-700 dark:text-[#D4AF37] border-amber-500/30 dark:border-[#D4AF37]/35',
      iconBg: 'bg-amber-600/10 dark:bg-[#D4AF37]/15 text-amber-700 dark:text-[#D4AF37]'
    },
    {
      id: 'pet_profile' as const,
      title: language === 'es' ? 'Ficha de Salud & Cálculo RER/MER' : 'Health Chart & RER/MER Calculation',
      subtitle: language === 'es' ? 'Energía & Metabolismo' : 'Energy & Metabolism',
      description: language === 'es' 
        ? 'Cálculo metabólico exacto de calorías diarias (Ley de Kleiber), condición corporal BCS, control de peso e hidratación personalizada.'
        : 'Exact daily metabolic calorie calculation (Kleiber\'s Law), BCS body condition score, weight tracker and hydration goals.',
      icon: HeartPulse,
      badge: language === 'es' ? 'Fórmula Clínica' : 'Clinical Formula',
      color: 'from-rose-500/15 via-rose-500/5 to-transparent text-rose-700 dark:text-rose-400 border-rose-500/30 dark:border-rose-500/30',
      iconBg: 'bg-rose-600/10 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400'
    },
    {
      id: 'agenda' as const,
      title: language === 'es' ? 'Agenda & Avisos con Alarma' : 'Medical Agenda & Reminders with Alarm',
      subtitle: language === 'es' ? 'Pastillas, Paseos & Veterinario' : 'Pills, Walks & Vet Care',
      description: language === 'es' 
        ? 'Planificación de medicación, paseos, avisos sonoros con sintetizador de alarma y sincronización directa con Google Calendar.'
        : 'Medication scheduling, walks, sound alarms with Web Audio synthesis and direct Google Calendar synchronization.',
      icon: CalendarDays,
      badge: pendingEvents.length > 0 ? `${pendingEvents.length} ${language === 'es' ? 'Pendientes' : 'Pending'}` : (language === 'es' ? 'Recordatorios' : 'Reminders'),
      color: 'from-emerald-500/15 via-emerald-500/5 to-transparent text-emerald-800 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-500/30',
      iconBg: 'bg-emerald-600/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400'
    },
    {
      id: 'concierge' as const,
      title: language === 'es' ? 'NutriIA Asistente Inteligente' : 'NutriAI Intelligent Assistant',
      subtitle: language === 'es' ? 'Asesoría Nutricional con Gemini' : 'Nutritional Advisory with Gemini',
      description: language === 'es' 
        ? 'Consultas nutricionales sobre ingredientes seguros, adaptación personalizada de recetas caseras y sugerencias dietéticas inmediatas.'
        : 'Nutritional inquiries regarding safe ingredients, custom recipe adaptations and immediate dietary guidance.',
      icon: Bot,
      badge: 'Gemini AI',
      color: 'from-indigo-500/15 via-indigo-500/5 to-transparent text-indigo-700 dark:text-indigo-400 border-indigo-500/30 dark:border-indigo-500/30',
      iconBg: 'bg-indigo-600/10 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400'
    },
    {
      id: 'toxic_foods' as const,
      title: language === 'es' ? 'Alimentos Prohibidos & Tóxicos' : 'Forbidden & Toxic Foods Directory',
      subtitle: language === 'es' ? 'Toxicología & Sustitutos Seguros' : 'Toxicology & Safe Substitutes',
      description: language === 'es' 
        ? 'Guía de emergencia rápida de sustancias nocivas (chocolate, uvas, cebolla), síntomas de intoxicación y sustitutos 100% seguros.'
        : 'Emergency toxicology guide of harmful compounds (chocolate, grapes, onion), intoxication signs and 100% safe substitutes.',
      icon: ShieldAlert,
      badge: language === 'es' ? 'Seguridad & Salud' : 'Safety & Health',
      color: 'from-red-500/15 via-red-500/5 to-transparent text-red-700 dark:text-red-400 border-red-500/30 dark:border-red-500/30',
      iconBg: 'bg-red-600/10 dark:bg-red-500/15 text-red-700 dark:text-red-400'
    },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-stone-200 dark:border-[#D4AF37]/30 bg-gradient-to-br from-stone-900 via-[#121B15] to-stone-950 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/40 mb-3">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>{t('appSubtitle')}</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.15] mb-3">
            {t('appTitle')}
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl font-light">
            {language === 'es'
              ? 'Formulación gastronómica casera para perros y gatos, cálculo exacto de gasto calórico (RER/MER), monitorización de hidratación con caldos de médula, agenda médica y asistencia con inteligencia artificial.'
              : 'Homemade culinary formulations for dogs and cats, exact calorie energy calculations (RER/MER), hydration tracking with collagen broths, medical agenda and AI-powered assistance.'}
          </p>

          {/* Quick Stats Banner */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span><strong>{pets.length} / 4</strong> {language === 'es' ? 'Mascotas registradas' : 'Pets registered'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              <span><strong>{events.filter(e => !e.completed).length}</strong> {language === 'es' ? 'Avisos pendientes' : 'Pending reminders'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: ALL APP NAVIGATION OPTIONS AS PROMINENT TILES (INSIDE HOME) */}
      <section className="space-y-4" id="section-home-options">
        <div>
          <h2 className="font-editorial text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
            {language === 'es' ? 'Opciones y Secciones de la Aplicación' : 'Application Options & Modules'}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
            {language === 'es'
              ? 'Seleccione cualquier módulo para acceder a las herramientas especializadas de cocina, salud y cuidados.'
              : 'Select any module to access specialized tools for cooking, health management, and daily care.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hubNavigationCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className={`group relative rounded-2xl p-6 bg-white dark:bg-[#121B15] border hover:border-amber-500 dark:hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between border-stone-200 dark:border-stone-800`}
                id={`card-hub-${card.id}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${card.iconBg} border border-current/20 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                      {card.badge}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-[#D4AF37]">
                    {card.subtitle}
                  </span>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 dark:text-[#F3E5AB] mt-1 mb-2 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-bold text-amber-800 dark:text-[#D4AF37]">
                  <span>{language === 'es' ? 'Abrir Sección' : 'Open Section'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: MULTI-MASCOTA PROFILES GRID (MAX 4) */}
      <section className="space-y-4" id="section-multi-pet">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              {language === 'es' ? 'Perfiles de Mascotas' : 'Pet Profiles'}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
              {language === 'es'
                ? 'Haga clic en una mascota para seleccionarla y ver su requerimiento nutricional diario.'
                : 'Click on a pet to select it and review its daily nutritional requirements.'}
            </p>
          </div>

          {pets.length < 4 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-700 hover:bg-amber-800 dark:bg-[#D4AF37] dark:hover:bg-[#E5C358] text-white dark:text-stone-950 transition-all shadow-xs"
              id="btn-add-pet-home"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('addPet')} ({pets.length}/4)</span>
            </button>
          )}
        </div>

        {/* Pet Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pets.map((pet) => {
            const isSelected = pet.id === selectedPetId;
            const merData = calculateMER(pet);
            const alertData = getConditionClinicalAlerts(pet.clinicalCondition, pet.species);

            return (
              <div
                key={pet.id}
                onClick={() => {
                  selectPet(pet.id);
                }}
                className={`relative rounded-2xl p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between group border ${
                  isSelected
                    ? 'bg-white dark:bg-[#121B15] border-emerald-600 dark:border-[#D4AF37] shadow-xl ring-2 ring-emerald-600/30 dark:ring-[#D4AF37]/30 scale-[1.01]'
                    : 'bg-stone-50/90 dark:bg-[#0E1511]/90 border-stone-200 dark:border-stone-800/80 hover:border-amber-600/40 dark:hover:border-[#D4AF37]/40 hover:shadow-md'
                }`}
                id={`pet-card-${pet.id}`}
              >
                {/* Species badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      {pet.avatarIcon || (pet.species === 'dog' ? '🐕' : '🐈')}
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 dark:text-stone-400">
                        {pet.species === 'dog' ? (language === 'es' ? 'Perro' : 'Dog') : (language === 'es' ? 'Gato' : 'Cat')}
                      </span>
                      <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB] leading-tight">
                        {pet.name}
                      </h3>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white dark:bg-[#D4AF37] dark:text-stone-950">
                      {language === 'es' ? 'Activo' : 'Active'}
                    </span>
                  )}
                </div>

                {/* Avatar image preview */}
                {pet.avatarUrl && (
                  <div className="w-full h-32 rounded-xl overflow-hidden mb-3 border border-stone-200 dark:border-stone-800 relative group-hover:opacity-95 transition-opacity">
                    <img
                      src={pet.avatarUrl}
                      alt={pet.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white font-semibold">
                      <span>{pet.breed}</span>
                      <span>{pet.ageYears} {t('ageYears')}</span>
                    </div>
                  </div>
                )}

                {/* Pet Quick Nutrition Metrics */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-stone-200 dark:border-stone-800/80">
                    <span className="text-stone-600 dark:text-stone-400">{t('weight')}:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{pet.weightKg} kg</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-stone-200 dark:border-stone-800/80">
                    <span className="text-stone-600 dark:text-stone-400">{t('mer')}:</span>
                    <span className="font-bold text-amber-700 dark:text-[#D4AF37]">{merData.mer} kcal/{language === 'es' ? 'día' : 'day'}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-stone-200 dark:border-stone-800/80">
                    <span className="text-stone-600 dark:text-stone-400">{t('dailyFoodPortion')}:</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-400">{merData.dailyFoodGrams} g/{language === 'es' ? 'día' : 'day'}</span>
                  </div>
                </div>

                {/* Open Profile Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectPet(pet.id);
                    setActiveTab('pet_profile');
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                  <span>{t('editPet')}</span>
                </button>
              </div>
            );
          })}

          {/* Add Pet Slot Card if < 4 */}
          {pets.length < 4 && (
            <div
              onClick={() => setShowAddModal(true)}
              className="rounded-2xl p-6 border-2 border-dashed border-stone-300 dark:border-[#D4AF37]/30 hover:border-amber-500 dark:hover:border-[#D4AF37] bg-stone-50/50 dark:bg-[#0A0F0D]/40 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[260px] group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-[#D4AF37] group-hover:scale-110 transition-transform mb-3">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-stone-800 dark:text-stone-200 mb-1">
                {language === 'es' ? 'Añadir Nueva Mascota' : 'Add New Pet'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-[200px] leading-relaxed">
                {language === 'es' ? 'Configure un nuevo perfil canino o felino (hasta 4 mascotas).' : 'Configure a new dog or cat profile (up to 4 pets).'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: QUICK TODAY'S SNAPSHOT (HYDRATION & PENDING ALERTS) */}
      {selectedPet && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Hydration & Broth Quick Tracker */}
          <div className="lg:col-span-1 rounded-2xl p-5 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-500" />
                  <h3 className="font-editorial text-base font-bold text-stone-900 dark:text-[#F3E5AB]">
                    {language === 'es' ? `Hidratación de ${selectedPet.name}` : `${selectedPet.name}'s Hydration`}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('pet_profile')}
                  className="text-xs text-emerald-800 dark:text-[#D4AF37] font-semibold hover:underline"
                >
                  {language === 'es' ? 'Detalles' : 'Details'}
                </button>
              </div>

              {(() => {
                const totalConsumed = (selectedPet.todayWaterMl || 0) + (selectedPet.todayBrothMl || 0);
                const target = selectedPet.todayWaterTargetMl || Math.round(selectedPet.weightKg * (selectedPet.species === 'dog' ? 55 : 50));
                const pct = Math.min(100, Math.round((totalConsumed / target) * 100));

                return (
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="text-stone-600 dark:text-stone-400">{language === 'es' ? 'Total bebido hoy:' : 'Total consumed today:'}</span>
                      <span className="font-bold text-stone-900 dark:text-[#F3E5AB]">
                        {totalConsumed} ml <span className="text-stone-500 dark:text-stone-400 font-normal">/ {target} ml meta</span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-950 dark:text-blue-300">
                        <span className="block font-bold">{t('freshWater')}:</span>
                        <span>{selectedPet.todayWaterMl || 0} ml</span>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-300">
                        <span className="block font-bold">{t('boneBroth')}:</span>
                        <span>{selectedPet.todayBrothMl || 0} ml</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <span className="text-[11px] text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                {language === 'es' ? 'Los caldos aportan colágeno y electrolitos bioactivos.' : 'Broths provide collagen and bioactive electrolytes.'}
              </span>
            </div>
          </div>

          {/* Pending Agenda Alerts */}
          <div className="lg:col-span-2 rounded-2xl p-5 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <h3 className="font-editorial text-base font-bold text-stone-900 dark:text-[#F3E5AB]">
                    {language === 'es' ? 'Próximos Avisos y Rutinas Médicas' : 'Upcoming Reminders & Medical Routines'}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('agenda')}
                  className="text-xs text-emerald-800 dark:text-[#D4AF37] font-semibold hover:underline"
                >
                  {language === 'es' ? 'Ver Toda la Agenda' : 'View Full Agenda'}
                </button>
              </div>

              {pendingEvents.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500 dark:text-stone-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  {language === 'es' ? '¡Todas las tomas y rutinas médicas del día están al día!' : 'All daily care reminders and medication doses are completed!'}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-[#0E1511] border border-stone-200 dark:border-stone-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] font-bold px-2 py-1 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                          {evt.time}
                        </span>
                        <div>
                          <div className="font-bold text-stone-900 dark:text-[#F3E5AB]">
                            {evt.title}
                          </div>
                          <div className="text-[11px] text-stone-600 dark:text-stone-400">
                            {evt.petName} {evt.dosage ? `• ${evt.dosage}` : ''}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleEventCompleted(evt.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-900 dark:text-emerald-300 border border-emerald-600/30 transition-colors shrink-0"
                      >
                        {t('markComplete')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400">
              <span>{language === 'es' ? 'Sincronizable con Google Calendar y formato .ics' : 'Syncable with Google Calendar and .ics format'}</span>
              <button
                onClick={() => setActiveTab('toxic_foods')}
                className="text-amber-700 dark:text-[#D4AF37] font-semibold hover:underline flex items-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{t('navToxicFoods')}</span>
              </button>
            </div>
          </div>

        </section>
      )}

      {/* Add Pet Modal */}
      <AddPetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Bell, 
  Volume2, 
  PlusCircle, 
  Settings, 
  Globe, 
  X, 
  Check,
  ChevronDown,
  Home,
  HeartPulse,
  BookOpen,
  CalendarDays,
  Bot,
  ShieldAlert,
  Trash2,
  Database,
  Plus,
  CreditCard
} from 'lucide-react';
import { AddPetModal } from './AddPetModal';

export const Header: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    language,
    setLanguage,
    t,
    pets, 
    selectedPetId, 
    selectPet, 
    deletePet,
    events, 
    triggerAlarmTest, 
    activeTab,
    setActiveTab,
    clearAllDataToBlank,
    loadSampleReferenceData,
    subscription,
    setShowPaymentModal
  } = useApp();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPetDropdown, setShowPetDropdown] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const pendingEventsCount = events.filter(e => !e.completed).length;
  const currentPet = pets.find(p => p.id === selectedPetId) || pets[0];

  const handleTestAlarmClick = () => {
    const sampleEvent = events.find(e => !e.completed) || events[0] || {
      id: 'test-alarm',
      petId: currentPet?.id || 'pet-1',
      petName: currentPet?.name || 'Charlie',
      title: language === 'es' ? 'Cena & Condroprotector Articular' : "Charlie's Mealtime & Joint Support",
      category: 'medication',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dosage: language === 'es' ? '1 ración fresca (200g) + 1 comprimido' : '1 fresh portion (200g) + 1 capsule',
      notes: language === 'es' ? 'Administrar con caldo de huesos tibio.' : 'Administer with warm bone broth.',
      completed: false,
      alarmSound: true,
      recurrence: 'daily'
    };
    triggerAlarmTest(sampleEvent);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-colors duration-300 backdrop-blur-xl border-b bg-[#FAF7F2]/95 dark:bg-[#07130E]/95 border-[#E8DCCB] dark:border-[#D4AF37]/25 shadow-xs">
        
        {/* ========================================================================= */}
        {/* ROW 1: BRAND IDENTITY & PRIMARY PET / NUTRI IA SHORTCUTS                  */}
        {/* ========================================================================= */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 border-b border-[#E8DCCB]/60 dark:border-[#D4AF37]/15 sm:border-b-0">
          
          {/* Left: Brand Identity with Home Casita Icon */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <button 
              onClick={() => setActiveTab('home')}
              id="header-brand-pawlove"
              className="flex items-center gap-1.5 sm:gap-2 text-left group shrink-0"
              title={language === 'es' ? 'PAWLOVE • Ir a Inicio' : 'PAWLOVE • Go to Home'}
            >
              {/* Home Casita Icon next to title */}
              <div className={`p-1.5 sm:p-2 rounded-xl transition-all duration-200 ${
                activeTab === 'home'
                  ? 'bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs scale-105'
                  : 'bg-white dark:bg-[#112019] text-stone-700 dark:text-[#F3E5AB] border border-[#E8DCCB] dark:border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}>
                <Home className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>

              {theme === 'dark' ? (
                <span className="font-editorial text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-[0.1em] sm:tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] drop-shadow-sm">
                  PAWLOVE
                </span>
              ) : (
                <span className="font-editorial text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#B8860B]">
                  PAW<span className="text-stone-900">LOVE</span>
                </span>
              )}
            </button>

            <span className="hidden lg:inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
            <span className="hidden lg:inline-block text-[11px] font-semibold tracking-wider uppercase text-stone-500 dark:text-[#D4AF37]/80">
              {language === 'es' ? 'Nutrición Natural & Cuidados Caseros' : 'Homemade Precision Nutrition'}
            </span>
          </div>

          {/* Right on Row 1: NutriIA & Pet Selector + Desktop Utility Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* NutriIA Assistant Button */}
            <button
              onClick={() => setActiveTab('concierge')}
              id="header-btn-nutria"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shadow-xs select-none shrink-0 ${
                activeTab === 'concierge'
                  ? 'bg-gradient-to-r from-[#B8860B] to-emerald-700 text-white shadow-md ring-2 ring-[#D4AF37]/50 scale-102'
                  : 'bg-white dark:bg-[#112019] text-stone-800 dark:text-[#F3E5AB] border border-[#E8DCCB] dark:border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-amber-50/50 dark:hover:bg-[#16271F]'
              }`}
              title={language === 'es' ? 'NutriIA • Asistente Veterinario con IA' : 'NutriIA • AI Pet Nutrition Assistant'}
            >
              <Bot className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === 'concierge' ? 'text-white' : 'text-[#B8860B] dark:text-[#D4AF37]'}`} />
              <span className="font-bold text-xs whitespace-nowrap">Nutri IA</span>
              <span className="hidden xs:inline-block px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-emerald-500 text-white shadow-2xs">
                AI
              </span>
            </button>

            {/* Active Pet Pill / Dropdown */}
            {pets.length > 0 ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowPetDropdown(!showPetDropdown)}
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-xs font-bold text-stone-800 dark:text-[#F3E5AB] shadow-xs hover:border-[#D4AF37] transition-all"
                  title={currentPet?.name}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-amber-100 dark:bg-stone-800 shrink-0">
                    {currentPet?.avatarUrl && !avatarError ? (
                      <img 
                        src={currentPet.avatarUrl} 
                        alt={currentPet.name}
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs flex items-center justify-center h-full">
                        {currentPet?.avatarIcon || (currentPet?.species === 'cat' ? '🐈' : '🐕')}
                      </span>
                    )}
                  </div>
                  <span className="max-w-[65px] sm:max-w-[90px] truncate text-xs">{currentPet?.name || 'Mascota'}</span>
                  <ChevronDown className="w-3 h-3 text-[#B8860B] dark:text-[#D4AF37]" />
                </button>

                {/* Dropdown Menu */}
                {showPetDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-2 py-1 flex items-center justify-between">
                      <span>{language === 'es' ? 'Mascotas Activas' : 'Active Pets'}</span>
                      <span className="font-mono">{pets.length}/4</span>
                    </div>
                    
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {pets.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            selectPet(p.id);
                            setShowPetDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                            p.id === currentPet?.id
                              ? 'bg-amber-50 dark:bg-[#1B2F25] text-amber-900 dark:text-[#F3E5AB]'
                              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#16271F]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span>{p.avatarIcon || (p.species === 'dog' ? '🐕' : '🐈')}</span>
                            <span className="truncate">{p.name}</span>
                          </div>
                          {p.id === currentPet?.id && <Check className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37] shrink-0" />}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-800 space-y-1">
                      {/* 1. Crear Perfil */}
                      {pets.length < 4 && (
                        <button
                          onClick={() => {
                            setShowPetDropdown(false);
                            setShowAddPetModal(true);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#B8860B] dark:text-[#D4AF37] hover:bg-amber-50/60 dark:hover:bg-[#16271F] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{language === 'es' ? 'Crear perfil de mascota' : 'Create pet profile'}</span>
                        </button>
                      )}

                      {/* 2. Borrar Perfil */}
                      {currentPet && (
                        <button
                          onClick={() => {
                            setShowPetDropdown(false);
                            setShowDeleteConfirmModal(true);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="truncate">{language === 'es' ? `Borrar perfil de ${currentPet.name}` : `Delete ${currentPet.name}`}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAddPetModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-stone-950 font-bold text-xs shadow-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Crear perfil' : 'Create profile'}</span>
              </button>
            )}

            {/* Desktop-only Utility Buttons (On mobile they appear in Row 2) */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              
              {/* Notification Bell Badge */}
              <button
                onClick={() => setActiveTab('agenda')}
                className="relative p-2 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-stone-700 dark:text-[#F3E5AB] hover:scale-105 active:scale-95 transition-all shadow-xs shrink-0"
                title={language === 'es' ? 'Avisos y agenda médica' : 'Reminders & agenda'}
                id="header-btn-agenda-bell-desktop"
              >
                <Bell className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                {pendingEventsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold text-[9px] flex items-center justify-center shadow-xs">
                    {pendingEventsCount}
                  </span>
                )}
              </button>

              {/* Language Selector (ES / EN) */}
              <button
                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                className="px-2.5 py-1.5 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-xs font-bold text-stone-800 dark:text-[#F3E5AB] hover:scale-105 active:scale-95 transition-all shadow-xs flex items-center gap-1 shrink-0"
                title={language === 'es' ? 'Cambiar a English' : 'Switch to Español'}
                id="header-btn-language-desktop"
              >
                <Globe className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
                <span className="font-mono">{language.toUpperCase()}</span>
              </button>

              {/* Theme Switcher Toggle Button (Light/Dark) */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-stone-700 dark:text-[#F3E5AB] hover:scale-105 active:scale-95 transition-all shadow-xs shrink-0"
                title={theme === 'dark' ? t('themeLight') : t('themeDark')}
                id="header-btn-theme-desktop"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#D4AF37]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#B8860B]" />
                )}
              </button>

              {/* Settings & Data Utilities */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-stone-700 dark:text-[#F3E5AB] hover:scale-105 active:scale-95 transition-all shadow-xs shrink-0"
                title={language === 'es' ? 'Ajustes y gestión de datos' : 'Settings & Data'}
                id="header-btn-settings-desktop"
              >
                <Settings className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
              </button>

            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* ROW 2 (MOBILE ONLY): PHONE CONTROLS (CLARO/OSCURO, AJUSTES, IDIOMA, AGENDA)*/}
        {/* ========================================================================= */}
        <div className="flex sm:hidden max-w-7xl mx-auto px-3 py-1.5 items-center justify-between gap-1.5 bg-[#F4EFE6]/90 dark:bg-[#0A1712]/90 border-b border-[#E8DCCB]/80 dark:border-[#D4AF37]/15">
          
          {/* 1. Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            id="mobile-btn-language"
            className="flex-1 py-1 px-2 rounded-xl bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-[11px] font-bold text-stone-800 dark:text-[#F3E5AB] flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all"
            title={language === 'es' ? 'Cambiar a English' : 'Switch to Español'}
          >
            <Globe className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
            <span className="font-mono">{language === 'es' ? 'ES' : 'EN'}</span>
          </button>

          {/* 2. Light / Dark Theme Toggle (Claro / Oscuro) */}
          <button
            onClick={toggleTheme}
            id="mobile-btn-theme"
            className="flex-1 py-1 px-2 rounded-xl bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-[11px] font-bold text-stone-800 dark:text-[#F3E5AB] flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all"
            title={theme === 'dark' ? t('themeLight') : t('themeDark')}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{language === 'es' ? 'Claro' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>{language === 'es' ? 'Oscuro' : 'Dark'}</span>
              </>
            )}
          </button>

          {/* 3. Agenda & Alarms Bell */}
          <button
            onClick={() => setActiveTab('agenda')}
            id="mobile-btn-agenda"
            className={`flex-1 py-1 px-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all relative ${
              activeTab === 'agenda'
                ? 'bg-[#B8860B] text-white border-[#B8860B]'
                : 'bg-white dark:bg-[#112019] border-[#E8DCCB] dark:border-[#D4AF37]/30 text-stone-800 dark:text-[#F3E5AB]'
            }`}
            title={language === 'es' ? 'Agenda de avisos y recordatorios' : 'Reminders & agenda'}
          >
            <Bell className={`w-3.5 h-3.5 ${activeTab === 'agenda' ? 'text-white' : 'text-[#B8860B] dark:text-[#D4AF37]'}`} />
            <span>{language === 'es' ? 'Agenda' : 'Agenda'}</span>
            {pendingEventsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] flex items-center justify-center font-extrabold ml-0.5">
                {pendingEventsCount}
              </span>
            )}
          </button>

          {/* 4. Settings Modal Launcher */}
          <button
            onClick={() => setShowSettingsModal(true)}
            id="mobile-btn-settings"
            className="flex-1 py-1 px-2 rounded-xl bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-[11px] font-bold text-stone-800 dark:text-[#F3E5AB] flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all"
            title={language === 'es' ? 'Ajustes y gestión de datos' : 'Settings & Data'}
          >
            <Settings className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
            <span>{language === 'es' ? 'Ajustes' : 'Settings'}</span>
          </button>

        </div>

      </header>

      {/* Delete Pet Confirmation Modal */}
      {showDeleteConfirmModal && currentPet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                {language === 'es' ? '¿Borrar perfil de mascota?' : 'Delete pet profile?'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                {language === 'es' 
                  ? `Se eliminará el perfil de "${currentPet.name}" y sus registros de peso y comidas.` 
                  : `Profile of "${currentPet.name}" will be deleted.`}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  deletePet(currentPet.id);
                  setShowDeleteConfirmModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 transition-colors"
              >
                {language === 'es' ? 'Sí, borrar' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings / Utilities Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
                <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                  {language === 'es' ? 'Ajustes & Gestión de Datos' : 'Settings & Data Controls'}
                </h3>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              
              {/* Language Switch Section */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-[#16271F] border border-[#E8DCCB] dark:border-[#D4AF37]/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900 dark:text-[#F3E5AB]">
                    {language === 'es' ? 'Idioma de la Aplicación' : 'Application Language'}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {language === 'es' ? 'Cambia todos los textos al instante' : 'Dynamically updates all titles'}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-stone-200/70 dark:bg-stone-800 p-1 rounded-xl">
                  <button
                    onClick={() => setLanguage('es')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                      language === 'es' ? 'bg-[#B8860B] text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    ES
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                      language === 'en' ? 'bg-[#B8860B] text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Modalidad de pagos (Payment Mode) as specifically requested */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-[#16271F] border border-amber-300/80 dark:border-[#D4AF37]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-[#F3E5AB]">
                    <CreditCard className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                    <span>{language === 'es' ? 'Modalidad de pagos' : 'Payment Mode'}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                    {subscription ? (language === 'es' ? 'Tarifa Activa' : 'Active Plan') : 'Activa'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs pt-0.5">
                  <div className="text-stone-700 dark:text-stone-300 font-semibold text-xs">
                    {subscription?.planTitle || (language === 'es' ? 'Acceso Completo Activo' : 'Active Full Access')}
                  </div>
                  <div className="text-[#B8860B] dark:text-[#D4AF37] font-bold">
                    {subscription?.isLifetime 
                      ? (language === 'es' ? 'Vitalicio' : 'Lifetime') 
                      : subscription ? `${subscription.amountEur.toFixed(2)} €` : '0,00 €'}
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                  {language === 'es'
                    ? 'Consulta tu modalidad de pago activa o cambia de tarifa a mensual, anual o vitalicia en cualquier momento.'
                    : 'Review your active subscription plan or switch tariffs anytime to monthly, annual or lifetime.'}
                </p>

                <button
                  onClick={() => {
                    setShowSettingsModal(false);
                    setShowPaymentModal(true);
                  }}
                  id="btn-settings-payment-mode"
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4AF37] hover:opacity-95 text-stone-950 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Cambiar o Gestionar Tarifa' : 'Change or Manage Plan'}</span>
                </button>
              </div>

              {/* Data Slates: Empty Slate vs Sample Data */}
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#16271F] border border-stone-200 dark:border-stone-800 space-y-2.5">
                <div className="font-bold text-stone-900 dark:text-[#F3E5AB] flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                  <span>{language === 'es' ? 'Modo de Datos (Demo vs Real)' : 'Data Slate (Demo vs Real)'}</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {language === 'es' 
                    ? 'Puede limpiar los datos inventados para introducir sus propios datos reales o cargar un ejemplo.'
                    : 'Clear invented demo data to input your real pet metrics or load reference samples.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    onClick={() => {
                      clearAllDataToBlank();
                      setShowSettingsModal(false);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{language === 'es' ? 'Modo Vacío (Datos Reales)' : 'Clear to Empty Slate'}</span>
                  </button>

                  <button
                    onClick={() => {
                      loadSampleReferenceData();
                      setShowSettingsModal(false);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-[#1B2F25] text-amber-900 dark:text-[#F3E5AB] border border-amber-200 dark:border-[#D4AF37]/40 font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'es' ? 'Cargar Ejemplo' : 'Load Sample'}</span>
                  </button>
                </div>
              </div>

              {/* Sound Test */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-[#16271F] border border-[#E8DCCB] dark:border-[#D4AF37]/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900 dark:text-[#F3E5AB]">
                    {language === 'es' ? 'Tono Acústico de Alarma' : 'Acoustic Chime Test'}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {language === 'es' ? 'Sintetizador armónico Web Audio' : 'Web Audio harmonic chime'}
                  </div>
                </div>
                <button
                  onClick={handleTestAlarmClick}
                  className="px-3 py-1.5 rounded-xl bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold flex items-center gap-1.5 shadow-xs hover:opacity-90 transition-opacity"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Probar' : 'Play'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Add Pet Modal */}
      {showAddPetModal && (
        <AddPetModal isOpen={showAddPetModal} onClose={() => setShowAddPetModal(false)} />
      )}
    </>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Bell, 
  Download, 
  Upload, 
  Volume2, 
  PlusCircle, 
  Settings, 
  Globe, 
  X, 
  Check,
  Home,
  Menu,
  HeartPulse,
  CalendarDays,
  BookOpen,
  Bot,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

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
    events, 
    triggerAlarmTest, 
    exportAllData, 
    importAllData,
    activeTab,
    setActiveTab,
    goToHome
  } = useApp();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  const pendingEventsCount = events.filter(e => !e.completed).length;
  const currentPet = pets.find(p => p.id === selectedPetId) || pets[0];

  const handleImportSubmit = () => {
    if (importAllData(importJsonText)) {
      setShowSettingsModal(false);
      setImportJsonText('');
    }
  };

  const handleTestAlarmClick = () => {
    const sampleEvent = events.find(e => !e.completed) || events[0] || {
      id: 'test-alarm',
      petId: currentPet?.id || 'pet-1',
      petName: currentPet?.name || 'Mascota',
      title: language === 'es' ? 'Toma de Condroprotector & Caldo de Médula' : 'Chondroprotector & Bone Broth Serving',
      category: 'medication',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dosage: language === 'es' ? '1 comprimido con 100ml de caldo tibio' : '1 tablet with 100ml of warm broth',
      notes: language === 'es' ? 'Recordatorio de prueba con sintetizador Web Audio.' : 'Test reminder with Web Audio synthesizer.',
      completed: false,
      alarmSound: true,
      recurrence: 'daily'
    };
    triggerAlarmTest(sampleEvent);
  };

  const navMenuItems = [
    { 
      id: 'home' as const, 
      label: t('navHome'), 
      sub: language === 'es' ? 'Panel central & cuidados' : 'Central hub & daily care',
      icon: Home,
      color: 'text-amber-600 dark:text-[#D4AF37]'
    },
    { 
      id: 'pet_profile' as const, 
      label: t('navPetProfile'), 
      sub: language === 'es' ? 'Cálculo RER/MER & peso' : 'RER/MER calculation & weight',
      icon: HeartPulse,
      color: 'text-rose-600 dark:text-rose-400'
    },
    { 
      id: 'agenda' as const, 
      label: t('navAgenda'), 
      sub: language === 'es' ? 'Recordatorios & alarmas' : 'Reminders & alarms',
      icon: CalendarDays,
      badge: pendingEventsCount > 0 ? pendingEventsCount : undefined,
      color: 'text-emerald-600 dark:text-emerald-400'
    },
    { 
      id: 'recipes' as const, 
      label: t('navRecipes'), 
      sub: language === 'es' ? 'Cocina casera & escalador' : 'Home cooking & portion scaler',
      icon: BookOpen,
      color: 'text-amber-700 dark:text-[#D4AF37]'
    },
    { 
      id: 'concierge' as const, 
      label: t('navConcierge'), 
      sub: language === 'es' ? 'Asistente veterinario IA' : 'Veterinary AI assistant',
      icon: Bot,
      color: 'text-indigo-600 dark:text-indigo-400',
      isAi: true
    },
    { 
      id: 'toxic_foods' as const, 
      label: t('navToxicFoods'), 
      sub: language === 'es' ? 'Guía de alimentos prohibidos' : 'Forbidden & toxic foods',
      icon: ShieldAlert,
      color: 'text-red-600 dark:text-red-400'
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full transition-colors duration-300 border-b backdrop-blur-md bg-white/90 dark:bg-[#0A0F0D]/95 border-stone-200 dark:border-[#D4AF37]/20 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-2">
        
        {/* Left Side: 3-Lines Menu + Home Icon Button + Brand Title & Subtitle */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* 3-Lines Hamburger Menu Button */}
          <button
            onClick={() => setShowMenuDrawer(prev => !prev)}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all flex items-center justify-center ${
              showMenuDrawer 
                ? 'bg-amber-600 dark:bg-[#D4AF37] text-white dark:text-stone-950 border-amber-600 dark:border-[#D4AF37] shadow-xs' 
                : 'bg-stone-50 dark:bg-[#121B15] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#D4AF37]/30 hover:bg-stone-100 dark:hover:bg-[#1C2820]'
            }`}
            title={language === 'es' ? 'Abrir menú de navegación' : 'Open navigation menu'}
            id="btn-nav-hamburger"
          >
            {showMenuDrawer ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Quick Home Casita Button */}
          <button
            onClick={goToHome}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all flex items-center justify-center ${
              activeTab === 'home'
                ? 'bg-emerald-800 dark:bg-[#1C2820] text-white dark:text-[#F3E5AB] border-emerald-900 dark:border-[#D4AF37]/50 shadow-xs'
                : 'bg-stone-50 dark:bg-[#121B15] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#D4AF37]/30 hover:bg-stone-100 dark:hover:bg-[#1C2820]'
            }`}
            title={t('goToHome')}
            id="btn-header-home-icon"
          >
            <Home className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* App Title and Subtitle */}
          <div 
            onClick={goToHome}
            className="flex flex-col cursor-pointer group select-none"
            id="app-brand-logo"
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-editorial text-base sm:text-lg md:text-xl font-bold tracking-tight text-stone-900 dark:text-[#F3E5AB] group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                {t('appTitle')}
              </h1>
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-stone-600 dark:text-stone-400">
              {t('appSubtitle')}
            </span>
          </div>

        </div>

        {/* Center Pet Selector Quick Switcher (Visible on desktop/tablets) */}
        {pets.length > 0 && (
          <div className="hidden lg:flex items-center relative">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/25 shadow-xs">
              {pets.map((p) => {
                const isSelected = p.id === selectedPetId;
                return (
                  <button
                    key={p.id}
                    onClick={() => selectPet(p.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'bg-white dark:bg-[#1C2820] text-emerald-900 dark:text-[#F3E5AB] shadow-xs border border-emerald-600/30 dark:border-[#D4AF37]/40'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    <span className="text-sm">{p.avatarIcon || (p.species === 'dog' ? '🐕' : '🐈')}</span>
                    <span className="max-w-[100px] truncate">{p.name}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#D4AF37] animate-pulse"></span>
                    )}
                  </button>
                );
              })}
              {pets.length < 4 && (
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-2 py-1.5 text-xs text-amber-700 dark:text-[#D4AF37] hover:bg-amber-500/10 rounded-lg transition-colors flex items-center gap-1"
                  title={t('addPet')}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">+ {t('addPet')}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Controls: Theme Mode, Language Switcher, Agenda Badge, Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Quick Theme Toggle Button (Applies across all pages) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-stone-200 dark:border-[#D4AF37]/35 bg-stone-50 dark:bg-[#121B15] text-stone-800 dark:text-[#F3E5AB] hover:bg-stone-100 dark:hover:bg-[#1A261E] transition-all shadow-xs"
            title={theme === 'dark' ? t('themeLight') : t('themeDark')}
            id="btn-theme-toggle"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-[#D4AF37]" />
                <span className="hidden md:inline text-xs font-bold text-[#D4AF37]">
                  {t('themeLight')}
                </span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-emerald-800" />
                <span className="hidden md:inline text-xs font-bold text-emerald-900">
                  {t('themeDark')}
                </span>
              </>
            )}
          </button>

          {/* Quick Language Switcher Toggle */}
          <div className="flex items-center rounded-xl border border-stone-200 dark:border-[#D4AF37]/30 bg-stone-50 dark:bg-[#121B15] p-0.5 text-xs font-bold shadow-xs">
            <button
              onClick={() => setLanguage('es')}
              className={`px-2 py-1 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                language === 'es'
                  ? 'bg-amber-600 dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="Español"
              id="btn-lang-es"
            >
              <span>🇪🇸</span>
              <span className="hidden sm:inline">ES</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-amber-600 dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="English"
              id="btn-lang-en"
            >
              <span>🇬🇧</span>
              <span className="hidden sm:inline">EN</span>
            </button>
          </div>

          {/* Agenda Quick Counter Alert */}
          <button
            onClick={() => setActiveTab('agenda')}
            className="relative p-2 sm:p-2.5 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 border border-stone-200 dark:border-stone-800 transition-colors"
            title={t('navAgenda')}
            id="btn-header-agenda"
          >
            <Bell className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            {pendingEventsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white dark:text-stone-950 font-bold text-[10px] flex items-center justify-center shadow-xs">
                {pendingEventsCount}
              </span>
            )}
          </button>

          {/* Settings Menu Trigger */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 border border-stone-200 dark:border-stone-800 transition-colors"
            title={t('settings')}
            id="btn-header-settings"
          >
            <Settings className="w-4 h-4 text-amber-600 dark:text-[#D4AF37]" />
            <span className="hidden xl:inline text-xs font-semibold">{t('settings')}</span>
          </button>

        </div>
      </div>

      {/* Slide-Down Navigation Menu (Opened via 3-lines menu button) */}
      {showMenuDrawer && (
        <div className="border-t border-stone-200 dark:border-[#D4AF37]/20 bg-white/98 dark:bg-[#0E1511]/98 backdrop-blur-md shadow-xl transition-all animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                {t('allSections')}
              </span>
              <button 
                onClick={() => setShowMenuDrawer(false)}
                className="text-xs font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span>{t('close')}</span>
              </button>
            </div>

            {/* Menu Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {navMenuItems.map(item => {
                const isCurrent = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMenuDrawer(false);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isCurrent
                        ? 'bg-amber-50 dark:bg-[#1A261E] border-amber-500 dark:border-[#D4AF37] shadow-xs'
                        : 'bg-stone-50/80 dark:bg-[#121B15] border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-[#18231C]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-white dark:bg-stone-900 shadow-2xs border border-stone-200 dark:border-stone-800 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-bold ${isCurrent ? 'text-amber-900 dark:text-[#F3E5AB]' : 'text-stone-900 dark:text-stone-100'}`}>
                            {item.label}
                          </span>
                          {item.isAi && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                              IA
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          {item.sub}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-600 text-white dark:text-stone-950">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pet Switcher in Drawer for mobile */}
            {pets.length > 0 && (
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 lg:hidden">
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400 block mb-2">
                  {t('activeContext')}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {pets.map(p => {
                    const isSelected = p.id === selectedPetId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          selectPet(p.id);
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-800 text-white dark:bg-[#D4AF37] dark:text-stone-950 shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        <span>{p.avatarIcon || (p.species === 'dog' ? '🐕' : '🐈')}</span>
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* FULL SETTINGS MODAL: Language, Dark/Light mode, Sound Alarm Test, Backup & Restore */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121B15] border-2 border-stone-200 dark:border-[#D4AF37]/40 shadow-2xl text-stone-900 dark:text-stone-100 max-h-[90vh] overflow-y-auto space-y-5">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#F3E5AB] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-500 dark:text-[#D4AF37]" />
                  {t('settingsTitle')}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  {t('settingsSubtitle')}
                </p>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Translator & Theme Side-by-Side in Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Language Switcher / Traductor */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A0F0D] border border-stone-200 dark:border-[#D4AF37]/25 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600 dark:text-[#D4AF37]" />
                  <span className="text-xs font-bold text-stone-800 dark:text-[#F3E5AB]">
                    {t('language')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLanguage('es')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      language === 'es'
                        ? 'bg-amber-600 dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs border border-amber-600'
                        : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <span>🇪🇸</span>
                    <span>Español</span>
                    {language === 'es' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setLanguage('en')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      language === 'en'
                        ? 'bg-amber-600 dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs border border-amber-600'
                        : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                    {language === 'en' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="block text-[10px] text-stone-600 dark:text-stone-400">
                  {language === 'es' ? 'Interfaz e IA en Español' : 'Interface & AI in English'}
                </span>
              </div>

              {/* Theme Mode Toggle (Oscuro / Claro) */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A0F0D] border border-stone-200 dark:border-[#D4AF37]/25 space-y-2.5">
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-[#D4AF37]" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-600" />
                  )}
                  <span className="text-xs font-bold text-stone-800 dark:text-[#F3E5AB]">
                    {t('theme')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      theme === 'dark'
                        ? 'bg-[#1C2820] text-[#F3E5AB] border border-[#D4AF37] shadow-xs'
                        : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Oscuro</span>
                    {theme === 'dark' && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </button>

                  <button
                    onClick={() => { if (theme !== 'light') toggleTheme(); }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      theme === 'light'
                        ? 'bg-emerald-800 text-white shadow-xs border border-emerald-900'
                        : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Claro</span>
                    {theme === 'light' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="block text-[10px] text-stone-600 dark:text-stone-400">
                  {theme === 'dark' ? 'Modo Oscuro Elegante' : 'Modo Claro Cálido'}
                </span>
              </div>

            </div>

            {/* Section 2: Sound Alarm Live Test */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-600 dark:text-[#D4AF37]" />
                  {t('testAlarmBtn')}
                </span>
                <p className="text-[11px] text-stone-700 dark:text-stone-300">
                  {language === 'es' 
                    ? 'Sintetizador armónico Web Audio sin archivos externos.' 
                    : 'Harmonic Web Audio synthesizer without external files.'}
                </p>
              </div>
              <button
                onClick={handleTestAlarmClick}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 dark:bg-[#D4AF37] dark:hover:bg-[#E5C358] text-white dark:text-stone-950 transition-colors shadow-xs"
              >
                {t('testAlarmBtn')}
              </button>
            </div>

            {/* Section 3: Backup & Restore */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A0F0D] border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-stone-900 dark:text-[#F3E5AB]">
                  {t('backupSection')}
                </span>
              </div>
              
              <button
                onClick={() => {
                  exportAllData();
                }}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-[#D4AF37] dark:hover:bg-[#E5C358] text-white dark:text-stone-950 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                {t('exportBackup')}
              </button>

              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                  {t('importBackup')}:
                </label>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder={t('importPlaceholder')}
                  className="w-full h-20 p-2 text-xs font-mono rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
                <button
                  onClick={handleImportSubmit}
                  disabled={!importJsonText.trim()}
                  className="w-full py-2 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-900 dark:bg-stone-800 dark:hover:bg-stone-700 text-white transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {t('importSubmit')}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                {t('close')}
              </button>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};

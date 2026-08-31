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
  ChevronDown
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
    setActiveTab
  } = useApp();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPetDropdown, setShowPetDropdown] = useState(false);
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
    <header className="sticky top-0 z-30 w-full transition-colors duration-300 backdrop-blur-xl border-b bg-[#FAF7F2]/90 dark:bg-[#07130E]/90 border-[#E8DCCB] dark:border-[#D4AF37]/20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Authentic Brand Title (PetPinnacle in Light / PETWELL in Dark) */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-baseline gap-1 text-left group"
          >
            {theme === 'dark' ? (
              <span className="font-editorial text-2xl font-bold tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] drop-shadow-sm">
                PETWELL
              </span>
            ) : (
              <span className="font-editorial text-2xl font-bold tracking-tight">
                <span className="text-[#B8860B]">Pet</span>
                <span className="text-stone-900">Pinnacle</span>
              </span>
            )}
          </button>

          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
          <span className="hidden sm:inline-block text-[11px] font-semibold tracking-wider uppercase text-stone-500 dark:text-[#D4AF37]/80">
            {language === 'es' ? 'Nutrición de Precisión' : 'Precision Care'}
          </span>
        </div>

        {/* Right: Sleek Minimalist Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Pet Pill / Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPetDropdown(!showPetDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-xs font-bold text-stone-800 dark:text-[#F3E5AB] shadow-xs hover:border-[#D4AF37] transition-all"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-amber-100 dark:bg-stone-800">
                <img 
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80" 
                  alt={currentPet?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="max-w-[80px] truncate">{currentPet?.name || 'Charlie'}</span>
              <ChevronDown className="w-3 h-3 text-[#B8860B] dark:text-[#D4AF37]" />
            </button>

            {/* Dropdown Menu */}
            {showPetDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-2 py-1">
                  {language === 'es' ? 'Seleccionar Mascota' : 'Select Pet'}
                </div>
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
                    <span>{p.name}</span>
                    {p.id === currentPet?.id && <Check className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell Badge */}
          <button
            onClick={() => setActiveTab('agenda')}
            className="relative p-2 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-stone-700 dark:text-[#F3E5AB] hover:scale-105 transition-all shadow-xs"
            title={language === 'es' ? 'Avisos y agenda' : 'Reminders & agenda'}
          >
            <Bell className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
            {pendingEventsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold text-[9px] flex items-center justify-center shadow-xs">
                {pendingEventsCount}
              </span>
            )}
          </button>

          {/* Theme Switcher Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-stone-700 dark:text-[#F3E5AB] hover:scale-105 transition-all shadow-xs"
            title={theme === 'dark' ? t('themeLight') : t('themeDark')}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#D4AF37]" />
            ) : (
              <Moon className="w-4 h-4 text-[#B8860B]" />
            )}
          </button>

          {/* Language Selector (ES / EN) */}
          <button
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="px-2.5 py-1.5 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-xs font-bold text-stone-800 dark:text-[#F3E5AB] hover:scale-105 transition-all shadow-xs flex items-center gap-1"
            title="Switch language / Cambiar idioma"
          >
            <Globe className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Utilities & Settings Modal Launcher */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-full bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 text-stone-700 dark:text-[#F3E5AB] hover:scale-105 transition-all shadow-xs"
            title={language === 'es' ? 'Configuración y datos' : 'Settings & data'}
          >
            <Settings className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
          </button>

        </div>

      </div>

      {/* Settings / Utilities Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#112019] border border-[#E8DCCB] dark:border-[#D4AF37]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#B8860B] dark:text-[#D4AF37]" />
                <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                  {language === 'es' ? 'Opciones & Copias de Seguridad' : 'Settings & Data Backup'}
                </h3>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Sound Test */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-[#16271F] border border-[#E8DCCB] dark:border-[#D4AF37]/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900 dark:text-[#F3E5AB]">
                    {language === 'es' ? 'Tono Acústico de Alta Fidelidad' : 'Luxury Chime Alarm Test'}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {language === 'es' ? 'Sintetizador armónico Web Audio' : 'Web Audio harmonic chime generator'}
                  </div>
                </div>
                <button
                  onClick={handleTestAlarmClick}
                  className="px-3 py-1.5 rounded-xl bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Probar' : 'Play'}</span>
                </button>
              </div>

              {/* Data Export */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#16271F] border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900 dark:text-[#F3E5AB]">
                    {language === 'es' ? 'Exportar Datos JSON' : 'Export JSON Data'}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {language === 'es' ? 'Descarga mascotas, dietas y agenda' : 'Download pets, recipes and calendar'}
                  </div>
                </div>
                <button
                  onClick={exportAllData}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 text-white dark:bg-stone-700 font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Exportar' : 'Export'}</span>
                </button>
              </div>

              {/* Data Import */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#16271F] border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="font-bold text-stone-900 dark:text-[#F3E5AB]">
                  {language === 'es' ? 'Importar Datos JSON' : 'Import JSON Data'}
                </div>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder={language === 'es' ? 'Pega aquí el código JSON...' : 'Paste JSON backup here...'}
                  className="w-full h-16 p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 text-xs font-mono"
                />
                <button
                  onClick={handleImportSubmit}
                  disabled={!importJsonText.trim()}
                  className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Restaurar Copia' : 'Restore Backup'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </header>
  );
};

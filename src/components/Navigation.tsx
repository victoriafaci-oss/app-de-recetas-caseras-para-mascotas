import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  HeartPulse, 
  CalendarDays, 
  BookOpen, 
  Bot, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface NavItem {
  id: 'home' | 'pet_profile' | 'agenda' | 'recipes' | 'concierge' | 'toxic_foods';
  label: string;
  subLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  isAi?: boolean;
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, events, t, language } = useApp();

  const pendingEventsCount = events.filter(e => !e.completed).length;

  const navItems: NavItem[] = [
    { 
      id: 'home', 
      label: t('navHome'), 
      subLabel: language === 'es' ? 'Multi-Mascota' : 'Multi-Pet', 
      icon: Home 
    },
    { 
      id: 'pet_profile', 
      label: t('navPetProfile'), 
      subLabel: language === 'es' ? 'RER & Hábitos' : 'RER & Habits', 
      icon: HeartPulse 
    },
    { 
      id: 'agenda', 
      label: t('navAgenda'), 
      subLabel: language === 'es' ? 'Pastillas & Citas' : 'Pills & Appointments', 
      icon: CalendarDays, 
      badge: pendingEventsCount > 0 ? pendingEventsCount : undefined 
    },
    { 
      id: 'recipes', 
      label: t('navRecipes'), 
      subLabel: language === 'es' ? 'Escalador Raciones' : 'Portion Scaler', 
      icon: BookOpen 
    },
    { 
      id: 'concierge', 
      label: t('navConcierge'), 
      subLabel: language === 'es' ? 'Veterinaria IA' : 'Veterinary AI', 
      icon: Bot, 
      isAi: true 
    },
    { 
      id: 'toxic_foods', 
      label: t('navToxicFoods'), 
      subLabel: language === 'es' ? 'Directorio Tóxicos' : 'Toxicology Guide', 
      icon: ShieldAlert 
    },
  ];

  return (
    <>
      {/* Desktop Navigation Rail (Left Sidebar) */}
      <aside 
        className="hidden md:flex flex-col w-64 shrink-0 min-h-[calc(100vh-4.5rem)] border-r border-stone-200 dark:border-[#D4AF37]/20 bg-stone-50/70 dark:bg-[#0A0F0D]/70 p-4 sticky top-18 z-20"
        id="desktop-navigation-rail"
      >
        <div className="text-[10px] font-bold uppercase tracking-widest text-stone-700 dark:text-emerald-400/80 px-3 mb-3">
          Atelier de Alta Cocina & Salud
        </div>

        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                id={`nav-link-${item.id}`}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-emerald-800 dark:bg-[#121B15] text-white dark:text-[#F3E5AB] shadow-md border border-emerald-700 dark:border-[#D4AF37]/50'
                    : 'text-stone-700 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-[#16211A] hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-white/15 dark:bg-[#D4AF37]/20 text-white dark:text-[#D4AF37]' 
                      : 'bg-stone-200 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 group-hover:text-amber-700 dark:group-hover:text-[#D4AF37]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-none flex items-center gap-1.5">
                      {item.label}
                      {item.isAi && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-emerald-500 text-white shadow-xs">
                          AI
                        </span>
                      )}
                    </div>
                    {item.subLabel && (
                      <div className={`text-[10px] mt-0.5 ${isActive ? 'text-emerald-100 dark:text-[#D4AF37]/80' : 'text-stone-700 dark:text-stone-400'}`}>
                        {item.subLabel}
                      </div>
                    )}
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Small Bottom Atelier Badge */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent border border-amber-500/20 dark:border-[#D4AF37]/20 mt-auto">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-800 dark:text-[#D4AF37]" />
            <span className="text-[11px] font-bold text-stone-900 dark:text-[#F3E5AB]">Nutrición de Precisión</span>
          </div>
          <p className="text-[10px] text-stone-700 dark:text-stone-300 leading-relaxed">
            Fórmulas clínicas RER/MER y balance calórico avalado por estándares veterinarios.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A0F0D]/95 backdrop-blur-md border-t border-stone-200 dark:border-[#D4AF37]/20 px-2 py-1.5 flex items-center justify-around shadow-lg"
        id="mobile-bottom-nav"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors relative min-w-[52px] ${
                isActive
                  ? 'text-emerald-800 dark:text-[#F3E5AB]'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[9px] flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] mt-0.5 tracking-tight font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label.split(' ')[0]}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-emerald-700 dark:bg-[#D4AF37] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};

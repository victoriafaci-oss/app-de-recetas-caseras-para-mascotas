import React from 'react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';
import { 
  Home, 
  HeartPulse, 
  CalendarRange,
  BookOpen, 
  CalendarDays, 
  Bot, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
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
      subLabel: language === 'es' ? 'Hábitos & Panel' : 'Habits & Hub', 
      icon: Home 
    },
    { 
      id: 'pet_profile', 
      label: t('navPetProfile'), 
      subLabel: language === 'es' ? 'RER & Metabolismo' : 'RER & Metabolism', 
      icon: HeartPulse 
    },
    { 
      id: 'weekly_plan', 
      label: t('navWeeklyPlan'), 
      subLabel: language === 'es' ? 'Dieta 7 Días & Control' : '7-Day Diet & Check', 
      icon: CalendarRange 
    },
    { 
      id: 'recipes', 
      label: t('navRecipes'), 
      subLabel: language === 'es' ? 'Recetas & Escalador' : 'Recipes & Scaler', 
      icon: BookOpen 
    },
    { 
      id: 'agenda', 
      label: t('navAgenda'), 
      subLabel: language === 'es' ? 'Tomas & Calendario' : 'Pills & Calendar', 
      icon: CalendarDays, 
      badge: pendingEventsCount > 0 ? pendingEventsCount : undefined 
    },
    { 
      id: 'concierge', 
      label: t('navConcierge'), 
      subLabel: language === 'es' ? 'Consultoría & IA' : 'Pet Care & AI', 
      icon: Bot, 
      isAi: true 
    },
    { 
      id: 'toxic_foods', 
      label: t('navToxicFoods'), 
      subLabel: language === 'es' ? 'Alimentos Prohibidos' : 'Toxic Foods Guide', 
      icon: ShieldAlert 
    },
  ];

  return (
    <>
      {/* Desktop Navigation Rail (Left Sidebar) */}
      <aside 
        className="hidden md:flex flex-col w-64 shrink-0 min-h-[calc(100vh-4rem)] border-r border-[#E8DCCB] dark:border-[#D4AF37]/20 bg-[#FAF7F2]/60 dark:bg-[#07130E]/60 backdrop-blur-md p-4 sticky top-16 z-20 transition-colors duration-300"
        id="desktop-navigation-rail"
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B8860B] dark:text-[#D4AF37] px-3 mb-3">
          {language === 'es' ? 'Atelier Nutricional' : 'Nutritional Atelier'}
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
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#B8860B] dark:bg-[#162920] text-white dark:text-[#F3E5AB] shadow-md border border-[#996515] dark:border-[#D4AF37]/50'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-[#B8860B]/10 dark:hover:bg-[#112019] hover:text-stone-900 dark:hover:text-[#F3E5AB]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-white/20 dark:bg-[#D4AF37]/20 text-white dark:text-[#D4AF37]' 
                      : 'bg-white dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 group-hover:text-[#B8860B] dark:group-hover:text-[#D4AF37] border border-stone-200/60 dark:border-stone-700/60'
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
                      <div className={`text-[10px] mt-0.5 ${isActive ? 'text-amber-100 dark:text-[#D4AF37]/80' : 'text-stone-500 dark:text-stone-400'}`}>
                        {item.subLabel}
                      </div>
                    )}
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-stone-950 shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Precision Nutrition Badge */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#112019]/90 border border-[#E8DCCB] dark:border-[#D4AF37]/20 mt-auto shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#D4AF37]" />
            <span className="text-[11px] font-bold text-stone-900 dark:text-[#F3E5AB]">
              {language === 'es' ? 'Fórmula Kleiber & FEDIAF' : 'Kleiber & FEDIAF Formula'}
            </span>
          </div>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed">
            {language === 'es' 
              ? 'Control calórico y de agua para el bienestar integral de tu mascota.'
              : 'Caloric & hydration control designed for optimal pet vitality.'}
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar Matching Luxury Mobile Mockups */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#07130E]/95 backdrop-blur-xl border-t border-[#E8DCCB] dark:border-[#D4AF37]/25 px-3 py-2 flex items-center justify-around shadow-2xl transition-colors duration-300"
        id="mobile-bottom-nav"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all duration-200 relative min-w-[50px] ${
                isActive
                  ? 'text-[#B8860B] dark:text-[#F3E5AB] scale-105'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-[#B8860B]/15 dark:bg-[#D4AF37]/20 border border-[#B8860B]/30 dark:border-[#D4AF37]/40 shadow-xs' 
                  : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-[#B8860B] dark:text-[#D4AF37]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 font-bold text-[9px] flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] mt-0.5 tracking-tight font-medium ${isActive ? 'font-bold text-stone-900 dark:text-[#F3E5AB]' : ''}`}>
                {item.label.split(' ')[0]}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] mt-0.5 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};

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
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#07130E]/95 backdrop-blur-xl border-t border-[#E8DCCB] dark:border-[#D4AF37]/25 px-2 py-1.5 flex items-center justify-around shadow-2xl transition-colors duration-300"
      id="mobile-bottom-nav"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-200 relative min-w-[44px] cursor-pointer ${
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
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.5] text-[#B8860B] dark:text-[#D4AF37]' : 'stroke-2'}`} />
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white font-bold text-[8px] flex items-center justify-center shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[8.5px] mt-0.5 tracking-tight font-medium ${isActive ? 'font-bold text-stone-900 dark:text-[#F3E5AB]' : ''}`}>
              {item.label.split(' ')[0]}
            </span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-[#B8860B] dark:bg-[#D4AF37] mt-0.5 animate-pulse"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

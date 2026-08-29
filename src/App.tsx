import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { PetProfileScreen } from './components/PetProfileScreen';
import { AgendaScreen } from './components/AgendaScreen';
import { RecipesScreen } from './components/RecipesScreen';
import { ToxicFoodsScreen } from './components/ToxicFoodsScreen';
import { NutriIAChatScreen } from './components/NutriIAChatScreen';
import { AlarmModal } from './components/AlarmModal';
import { PageReturnHeader } from './components/PageReturnHeader';
import { Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, toast } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'pet_profile':
        return <PetProfileScreen />;
      case 'agenda':
        return <AgendaScreen />;
      case 'recipes':
        return <RecipesScreen />;
      case 'concierge':
        return <NutriIAChatScreen />;
      case 'toxic_foods':
        return <ToxicFoodsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900 dark:bg-[#0A0F0D] dark:text-stone-100 transition-colors duration-300 antialiased selection:bg-amber-500/30 selection:text-amber-900 dark:selection:text-[#F3E5AB]">
      {/* Top Main Atelier Header */}
      <Header />

      {/* Main App Container with Side Navigation Rail & Dynamic Screens */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar / Rail */}
        <Navigation />

        {/* Dynamic Screen Viewport with Navigation Return Controls */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 max-w-full">
          <PageReturnHeader />
          {renderActiveScreen()}
        </main>
      </div>

      {/* Global Interactive Alarm Sound & Visual Reminder Popup Modal */}
      <AlarmModal />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className={`flex items-center gap-2.5 py-3 px-4 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 text-emerald-100 border-emerald-500/40 shadow-emerald-950/40'
              : toast.type === 'warning'
              ? 'bg-amber-900/90 text-amber-100 border-amber-500/40 shadow-amber-950/40'
              : 'bg-stone-900/90 text-stone-100 border-[#D4AF37]/30 shadow-black/40'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

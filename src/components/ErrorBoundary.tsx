import React, { Component, ErrorInfo, ReactNode } from 'react';
import { safeStorage } from '../utils/safeStorage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in PawLove application:', error, errorInfo);
    // Auto-repair common storage corruption safely
    try {
      const storedPets = safeStorage.getItem('nutripet_pets_v1');
      if (storedPets) {
        const parsed = JSON.parse(storedPets);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          safeStorage.removeItem('nutripet_pets_v1');
        }
      }
    } catch {
      safeStorage.removeItem('nutripet_pets_v1');
    }
  }

  private handleOpenApp = () => {
    try {
      safeStorage.removeItem('nutripet_pets_v1');
      safeStorage.removeItem('nutripet_weekly_tracking_v1');
      safeStorage.setItem('nutripet_view_v1', 'app');
    } catch {
      // ignore
    }
    window.location.href = '/?view=app';
  };

  private handleGoHome = () => {
    try {
      safeStorage.removeItem('nutripet_view_v1');
      safeStorage.removeItem('nutripet_pets_v1');
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0A0F0D] text-[#EDE8DF] text-center font-sans">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mb-4 text-3xl shadow-xl shadow-amber-500/10">
            🐾
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#E8B84A] mb-2 font-serif">PawLove Mascotas</h1>
          <p className="text-sm text-stone-300 max-w-md mb-6 leading-relaxed">
            Se ha restaurado la sesión de la aplicación. Haz clic abajo para abrir la app o reiniciar la pantalla sin errores.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleOpenApp}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#C49A45] text-[#0A0F0D] font-bold text-sm transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              Abrir Aplicación
            </button>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
              }}
              className="px-5 py-2.5 rounded-xl border border-stone-700 bg-stone-900/80 hover:bg-stone-800 text-stone-300 font-medium text-sm transition-all cursor-pointer"
            >
              Reintentar
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="px-4 py-2.5 rounded-xl border border-stone-800 bg-stone-950/60 hover:bg-stone-900 text-stone-400 hover:text-stone-200 text-xs transition-all cursor-pointer"
            >
              Ir a Portada
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

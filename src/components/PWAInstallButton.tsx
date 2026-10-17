import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed and running standalone, do not show button
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
        <Check className="w-3.5 h-3.5" />
        <span>PWA Instalada</span>
      </div>
    );
  }

  return (
    <>
      {isInstallable && (
        <button
          onClick={install}
          className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold px-3 py-1.5 text-xs md:text-sm shadow-md transition-all transform active:scale-95 cursor-pointer"
          title="Instalar como aplicación en este dispositivo"
        >
          <Download className="w-4 h-4 text-stone-900" />
          <span>Instalar App</span>
        </button>
      )}

      {isIOS && !isInstallable && (
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-3 py-1.5 text-xs transition-colors cursor-pointer border border-stone-200"
        >
          <Smartphone className="w-3.5 h-3.5 text-stone-600" />
          <span>Instalar en iOS</span>
        </button>
      )}

      {/* Manual installation hint button if browser hasn't fired beforeinstallprompt */}
      {!isInstallable && !isIOS && (
        <button
          onClick={() => setShowIOSGuide(true)}
          className="hidden sm:flex items-center gap-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium px-2.5 py-1 text-xs transition cursor-pointer border border-stone-200"
          title="Cómo agregar a la pantalla de inicio"
        >
          <Download className="w-3.5 h-3.5 text-stone-500" />
          <span>Instalar PWA</span>
        </button>
      )}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-stone-900 text-base">Instalar Ubuntu Quest</h3>
                  <p className="text-xs text-stone-500">Úsala sin conexión como app nativa</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-stone-600">
              <div className="flex items-start gap-3 bg-amber-50/70 p-3 rounded-xl border border-amber-100">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold">1</span>
                <p className="text-xs">
                  En Safari o Chrome, pulsa el botón <strong>Compartir</strong> <span className="inline-block px-1 bg-stone-200 rounded text-[10px]">⬆️ / ⋮</span> en la barra del navegador.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-amber-50/70 p-3 rounded-xl border border-amber-100">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold">2</span>
                <p className="text-xs">
                  Desplázate hacia abajo y selecciona <strong>"Agregar a pantalla de inicio"</strong> o <strong>"Instalar aplicación"</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold">3</span>
                <p className="text-xs text-emerald-800">
                  ¡Listo! Se creará el ícono en tu pantalla para abrir el aula con un solo toque, incluso sin internet.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};

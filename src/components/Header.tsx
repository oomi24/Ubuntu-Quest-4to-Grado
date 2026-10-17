import React, { useState } from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { sounds } from '../lib/soundEffects';
import { Volume2, VolumeX, Copy, Check, BookOpen, Database, Users, Sparkles } from 'lucide-react';
import { Sala } from '../types/database';

interface HeaderProps {
  sala: Sala | null;
  rol: 'maestra' | 'estudiante' | null;
  estudianteNombre?: string;
  onOpenCodex: () => void;
  onOpenSupabaseModal: () => void;
  onResetRole?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sala,
  rol,
  estudianteNombre,
  onOpenCodex,
  onOpenSupabaseModal,
  onResetRole
}) => {
  const [soundActive, setSoundActive] = useState(sounds.enabled);
  const [copiedCode, setCopiedCode] = useState(false);

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setSoundActive(sounds.enabled);
    if (sounds.enabled) {
      sounds.playSuccessChime();
    }
  };

  const copyRoomCode = () => {
    if (!sala?.codigo) return;
    navigator.clipboard.writeText(sala.codigo);
    setCopiedCode(true);
    sounds.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Logo & Philosophy */}
        <div 
          onClick={onResetRole}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Ir al inicio"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🌍</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-base sm:text-lg text-stone-900 tracking-tight">
                Ubuntu Quest
              </span>
              <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 text-[10px] font-bold rounded-md uppercase">
                4to Grado
              </span>
            </div>
            <p className="text-[11px] text-amber-700 font-medium hidden xs:block">
              "Soy porque somos"
            </p>
          </div>
        </div>

        {/* Room Info & Status */}
        {sala && (
          <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200/70 rounded-2xl px-2.5 py-1">
            <div className="flex items-center gap-1.5 text-xs text-amber-900 font-semibold">
              <span className="hidden sm:inline text-amber-700 text-[11px]">Código:</span>
              <span className="font-mono tracking-wider bg-white px-2 py-0.5 rounded-lg border border-amber-300 font-bold text-teal-800">
                {sala.codigo}
              </span>
            </div>
            <button
              onClick={copyRoomCode}
              className="p-1 rounded-lg text-amber-700 hover:bg-amber-200/60 transition cursor-pointer"
              title="Copiar código de la sala"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* User / Role Badge */}
          {rol && (
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
              {rol === 'maestra' ? (
                <>
                  <span className="text-sm">👩‍🏫</span>
                  <span>Maestra {sala?.maestra_nombre ? `(${sala.maestra_nombre})` : ''}</span>
                </>
              ) : (
                <>
                  <span className="text-sm">🎒</span>
                  <span>{estudianteNombre || 'Estudiante'}</span>
                </>
              )}
            </div>
          )}

          {/* Class Codex Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenCodex();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 transition cursor-pointer"
            title="Ver el Códice Digital / Libro de la Clase"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">Códice de Clase</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              soundActive
                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                : 'bg-stone-100 border-stone-200 text-stone-400 hover:bg-stone-200'
            }`}
            title={soundActive ? 'Silenciar sonidos' : 'Activar sonidos amigables'}
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Supabase & Vercel Info button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenSupabaseModal();
            }}
            className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 transition cursor-pointer"
            title="Arquitectura Supabase y Despliegue en Vercel"
          >
            <Database className="w-4 h-4 text-emerald-600" />
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};

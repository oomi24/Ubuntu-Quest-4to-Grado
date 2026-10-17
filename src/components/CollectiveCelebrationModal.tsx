import React from 'react';
import { Sala, Estudiante } from '../types/database';
import { sounds } from '../lib/soundEffects';
import { Sparkles, Users, Award, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CollectiveCelebrationModalProps {
  isOpen: boolean;
  sala: Sala | null;
  estudiantes: Estudiante[];
  totalLogros: number;
  onReturnToLobby: () => void;
  onOpenCodex: () => void;
}

export const CollectiveCelebrationModal: React.FC<CollectiveCelebrationModalProps> = ({
  isOpen,
  sala,
  estudiantes,
  totalLogros,
  onReturnToLobby,
  onOpenCodex
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-2 border-amber-300 text-center space-y-5 animate-in zoom-in-95">
        {/* Glow Baobab Icon */}
        <div className="relative inline-block mx-auto">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 animate-pulse-ring">
            🌳
          </div>
          <span className="absolute -top-1 -right-1 text-2xl">✨</span>
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider inline-block mb-2">
            ¡Misión Colectiva Cumplida!
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">
            ¡El Círculo de 4to Grado Triunfó!
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-sm mx-auto leading-relaxed">
            En Ubuntu no hay primeros ni últimos: todos cruzamos la meta tomados de la mano.
          </p>
        </div>

        {/* Collective Milestones Stats Card */}
        <div className="grid grid-cols-2 gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-left">
          <div className="p-3 bg-white rounded-xl border border-amber-100">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">
              Retos Resueltos en Equipo
            </span>
            <span className="text-2xl font-heading font-bold text-teal-800">
              {totalLogros || 20} / 20
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-amber-100">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">
              Compañeros Aportando
            </span>
            <span className="text-2xl font-heading font-bold text-amber-800">
              {estudiantes.length} alumnos
            </span>
          </div>
        </div>

        {/* Proverb Quote */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs sm:text-sm text-teal-900 italic font-serif">
          "Si quieres ir rápido, camina solo. Si quieres llegar lejos, camina acompañado."
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenCodex();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-heading font-bold text-xs sm:text-sm border border-teal-200 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>Ver Códice / Memoria</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onReturnToLobby();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-heading font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Volver a la Sala</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

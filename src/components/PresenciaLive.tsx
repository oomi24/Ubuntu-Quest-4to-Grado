import React, { useState } from 'react';
import { usePresence } from '../hooks/usePresence';
import { Users, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { sounds } from '../lib/soundEffects';

interface PresenciaLiveProps {
  salaId?: string;
  estudianteId?: string;
  compact?: boolean;
}

export const PresenciaLive: React.FC<PresenciaLiveProps> = ({
  salaId,
  estudianteId,
  compact = false
}) => {
  const { presenciasArray, totalConectados, totalActivos, totalReflexionando } = usePresence(
    salaId,
    estudianteId
  );
  const [expanded, setExpanded] = useState(!compact);

  if (totalConectados === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-stone-100 border border-stone-200 text-stone-500 text-xs">
        <Users className="w-3.5 h-3.5" />
        <span>Esperando compañeros...</span>
      </div>
    );
  }

  const renderStatusDot = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <span className="w-2 h-2 rounded-full bg-emerald-500" title="Activo" />;
      case 'reflexionando':
        return (
          <span
            className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"
            title="En pausa de reflexión Ubuntu"
          />
        );
      case 'ausente':
      default:
        return <span className="w-2 h-2 rounded-full bg-stone-300" title="Ausente temporalmente" />;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xs transition-all overflow-hidden">
      {/* Barra superior con resumen */}
      <div
        onClick={() => {
          sounds.playClick();
          setExpanded(!expanded);
        }}
        className="flex items-center justify-between px-3.5 py-2 cursor-pointer hover:bg-stone-50 transition"
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-heading font-bold text-xs text-stone-800">
            {totalConectados} {totalConectados === 1 ? 'compañero conectado' : 'compañeros en el Círculo'}
          </span>
          {totalReflexionando > 0 && (
            <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              {totalReflexionando} reflexionando
            </span>
          )}
        </div>

        <button type="button" className="text-stone-400 hover:text-stone-700">
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Lista de avatares desplegable */}
      {expanded && (
        <div className="px-3.5 pb-2.5 pt-1 border-t border-stone-100 flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
          {presenciasArray.map((p) => {
            const isMe = p.estudiante_id === estudianteId;
            return (
              <div
                key={p.estudiante_id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs transition border ${
                  isMe
                    ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-700 font-medium'
                }`}
                title={`Estado: ${p.estado}`}
              >
                <span className="text-sm">{p.avatar || '🦜'}</span>
                <span className="truncate max-w-[90px]">{p.estudiante_nombre}</span>
                {renderStatusDot(p.estado)}
                {isMe && <span className="text-[10px] text-teal-600 font-semibold">(Tú)</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

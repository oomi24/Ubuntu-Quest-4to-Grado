import React from 'react';
import { useReacciones, EMOJIS_DISPONIBLES } from '../hooks/useReacciones';
import { TipoObjetivoReaccion, EmojiReaccion } from '../types/database';
import { sounds } from '../lib/soundEffects';

interface ReaccionesBarProps {
  objetivoTipo: TipoObjetivoReaccion;
  objetivoId: string;
  estudianteId?: string;
  compact?: boolean;
}

export const ReaccionesBar: React.FC<ReaccionesBarProps> = ({
  objetivoTipo,
  objetivoId,
  estudianteId,
  compact = false
}) => {
  const { contadores, misReacciones, toggleEmoji, totalAportes } = useReacciones(
    objetivoTipo,
    objetivoId,
    estudianteId
  );

  const handleClick = (emoji: EmojiReaccion) => {
    sounds.playClick();
    toggleEmoji(emoji);
  };

  return (
    <div className="flex items-center flex-wrap gap-1.5 pt-1">
      {EMOJIS_DISPONIBLES.map((emoji) => {
        const count = contadores[emoji];
        const isSelected = misReacciones.has(emoji);

        return (
          <button
            key={emoji}
            type="button"
            onClick={() => handleClick(emoji)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer transform active:scale-95 ${
              isSelected
                ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs scale-105'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200'
            }`}
            title={isSelected ? 'Hiciste clic para reaccionar' : 'Reaccionar con apoyo'}
          >
            <span className="text-sm">{emoji}</span>
            {count > 0 && <span className="text-[11px] font-mono">{count}</span>}
          </button>
        );
      })}

      {totalAportes > 0 && !compact && (
        <span className="text-[10px] text-stone-400 font-medium pl-1">
          {totalAportes} {totalAportes === 1 ? 'abrazo Ubuntu' : 'abrazos Ubuntu'}
        </span>
      )}
    </div>
  );
};

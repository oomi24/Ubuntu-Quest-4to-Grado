import { useState, useEffect, useCallback, useMemo } from 'react';
import { realtimeManager, RoomSyncState } from '../lib/realtimeSync';
import { Reaccion, EmojiReaccion, TipoObjetivoReaccion } from '../types/database';

export const EMOJIS_DISPONIBLES: EmojiReaccion[] = ['👏', '❤️', '⭐', '🌟', '💡', '🌱'];

export function useReacciones(
  objetivoTipo: TipoObjetivoReaccion,
  objetivoId: string,
  estudianteId?: string
) {
  const [todasReacciones, setTodasReacciones] = useState<Reaccion[]>([]);

  useEffect(() => {
    const unsubscribe = realtimeManager.subscribe((state: RoomSyncState) => {
      setTodasReacciones(state.reacciones);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Filtrar reacciones solo para este objetivo específico
  const reaccionesObjetivo = useMemo(() => {
    return todasReacciones.filter(
      (r) => r.objetivo_tipo === objetivoTipo && r.objetivo_id === objetivoId
    );
  }, [todasReacciones, objetivoTipo, objetivoId]);

  // Contadores por cada emoji
  const contadores = useMemo(() => {
    const counts: Record<EmojiReaccion, number> = {
      '👏': 0,
      '❤️': 0,
      '⭐': 0,
      '🌟': 0,
      '💡': 0,
      '🌱': 0
    };

    reaccionesObjetivo.forEach((r) => {
      if (counts[r.emoji] !== undefined) {
        counts[r.emoji]++;
      }
    });

    return counts;
  }, [reaccionesObjetivo]);

  // Emojis que el estudiante actual ya ha reaccionado
  const misReacciones = useMemo(() => {
    if (!estudianteId) return new Set<EmojiReaccion>();
    return new Set(
      reaccionesObjetivo
        .filter((r) => r.estudiante_id === estudianteId)
        .map((r) => r.emoji)
    );
  }, [reaccionesObjetivo, estudianteId]);

  const toggleEmoji = useCallback(
    (emoji: EmojiReaccion) => {
      const actorId = estudianteId || 'maestra_reaccion';
      realtimeManager.toggleReaccion(objetivoTipo, objetivoId, actorId, emoji);
    },
    [objetivoTipo, objetivoId, estudianteId]
  );

  const totalAportes = reaccionesObjetivo.length;

  return {
    contadores,
    misReacciones,
    toggleEmoji,
    totalAportes
  };
}

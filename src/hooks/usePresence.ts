import { useEffect, useState, useCallback } from 'react';
import { realtimeManager, RoomSyncState } from '../lib/realtimeSync';
import { PresenciaSala, EstadoPresencia } from '../types/database';

export function usePresence(salaId?: string, estudianteId?: string) {
  const [presencias, setPresencias] = useState<Record<string, PresenciaSala>>({});
  const [estadoActual, setEstadoActual] = useState<EstadoPresencia>('activo');

  useEffect(() => {
    const unsubscribe = realtimeManager.subscribe((state: RoomSyncState) => {
      setPresencias(state.presencias);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Heartbeat y detector de inactividad (5 minutos = ausente)
  useEffect(() => {
    if (!estudianteId) return;

    let timeoutInactividad: NodeJS.Timeout;

    const registrarActividad = () => {
      realtimeManager.updatePresence(estudianteId, 'activo');
      setEstadoActual('activo');

      clearTimeout(timeoutInactividad);
      timeoutInactividad = setTimeout(() => {
        realtimeManager.updatePresence(estudianteId, 'ausente');
        setEstadoActual('ausente');
      }, 5 * 60 * 1000); // 5 minutos
    };

    registrarActividad();

    const eventos = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    const handleUserAction = () => {
      if (estadoActual !== 'reflexionando') {
        registrarActividad();
      }
    };

    eventos.forEach((ev) => window.addEventListener(ev, handleUserAction, { passive: true }));

    // Heartbeat cada 30 segundos
    const interval = setInterval(() => {
      if (estadoActual !== 'ausente') {
        realtimeManager.updatePresence(estudianteId, estadoActual);
      }
    }, 30000);

    return () => {
      clearTimeout(timeoutInactividad);
      clearInterval(interval);
      eventos.forEach((ev) => window.removeEventListener(ev, handleUserAction));
    };
  }, [estudianteId, estadoActual]);

  const cambiarEstado = useCallback((nuevoEstado: EstadoPresencia) => {
    if (!estudianteId) return;
    setEstadoActual(nuevoEstado);
    realtimeManager.updatePresence(estudianteId, nuevoEstado);
  }, [estudianteId]);

  const presenciasArray = Object.values(presencias);
  const totalActivos = presenciasArray.filter((p) => p.estado === 'activo').length;
  const totalReflexionando = presenciasArray.filter((p) => p.estado === 'reflexionando').length;
  const totalConectados = presenciasArray.length;

  return {
    presencias,
    presenciasArray,
    totalConectados,
    totalActivos,
    totalReflexionando,
    estadoActual,
    cambiarEstado
  };
}

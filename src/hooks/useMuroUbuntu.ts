import { useState, useEffect, useCallback, useMemo } from 'react';
import { realtimeManager, RoomSyncState } from '../lib/realtimeSync';
import { MensajeMuro, TipoMensajeMuro } from '../types/database';
import { validarMensajeUbuntu } from '../lib/filtroPalabras';

const RATE_LIMIT_SECONDS = 30;

export function useMuroUbuntu(
  salaId?: string, 
  estudianteId?: string, 
  estudianteNombre?: string, 
  avatar?: string,
  esMaestra: boolean = false
) {
  const [mensajes, setMensajes] = useState<MensajeMuro[]>([]);
  const [chatLibreHabilitado, setChatLibreHabilitado] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [errorFiltro, setErrorFiltro] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = realtimeManager.subscribe((state: RoomSyncState) => {
      setMensajes(state.mensajesMuro);
      setChatLibreHabilitado(Boolean(state.sala?.config_json?.chat_libre_habilitado));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Temporizador para el límite de 30 segundos entre envíos
  useEffect(() => {
    if (segundosRestantes <= 0) return;

    const timer = setInterval(() => {
      setSegundosRestantes((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [segundosRestantes]);

  // Publicar mensaje con filtro y límite de tiempo
  const publicarMensaje = useCallback(
    (contenido: string, tipo: TipoMensajeMuro, etapaOMateria?: string): boolean => {
      setErrorFiltro(null);

      if (!esMaestra && segundosRestantes > 0) {
        setErrorFiltro(`Por favor espera ${segundosRestantes} segundos antes de enviar otro aporte.`);
        return false;
      }

      // Si el chat libre está desactivado y el tipo es 'mensaje', sugerir 'idea', 'pregunta' o 'logro'
      if (!esMaestra && !chatLibreHabilitado && tipo === 'mensaje') {
        setErrorFiltro('La maestra ha configurado el Muro para aportes de tipo "Idea", "Pregunta" o "Logro".');
        return false;
      }

      // Validación con filtro de respeto Ubuntu
      const resultado = validarMensajeUbuntu(contenido);
      if (!resultado.esValido) {
        setErrorFiltro(resultado.motivo || 'Mensaje no válido según la filosofía Ubuntu.');
        return false;
      }

      const id = estudianteId || 'maestra_' + Date.now();
      const nombre = estudianteNombre || 'Maestra';
      const icono = avatar || (esMaestra ? '👩‍🏫' : '🦜');

      realtimeManager.postMuroMessage(id, nombre, icono, contenido, tipo, etapaOMateria);

      if (!esMaestra) {
        setSegundosRestantes(RATE_LIMIT_SECONDS);
      }

      return true;
    },
    [estudianteId, estudianteNombre, avatar, esMaestra, segundosRestantes, chatLibreHabilitado]
  );

  // Acciones de moderación de la maestra
  const alternarVisibilidad = useCallback((mensajeId: string, aprobado: boolean) => {
    realtimeManager.toggleAprobarMensaje(mensajeId, aprobado);
  }, []);

  const eliminarMensaje = useCallback((mensajeId: string) => {
    realtimeManager.deleteMensajeMuro(mensajeId);
  }, []);

  const alternarChatLibre = useCallback((habilitado: boolean) => {
    realtimeManager.setChatLibreHabilitado(habilitado);
  }, []);

  // Lista visible: la maestra ve todos con estado de moderación; los alumnos ven solo los aprobados
  const mensajesVisibles = useMemo(() => {
    if (esMaestra) return mensajes;
    return mensajes.filter((m) => m.aprobado);
  }, [mensajes, esMaestra]);

  return {
    mensajes: mensajesVisibles,
    todosLosMensajes: mensajes,
    chatLibreHabilitado,
    segundosRestantes,
    errorFiltro,
    limpiarError: () => setErrorFiltro(null),
    publicarMensaje,
    alternarVisibilidad,
    eliminarMensaje,
    alternarChatLibre
  };
}

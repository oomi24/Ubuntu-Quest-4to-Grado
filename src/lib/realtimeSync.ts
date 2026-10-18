import { supabase, isSupabaseConfigured } from './supabase';
import { 
  Sala, 
  Estudiante, 
  FaseSala, 
  MateriaTipo, 
  EtapaHistorica, 
  ProgresoHistoria, 
  RespuestaEjercicio,
  CuentoColaborativo,
  PresenciaSala,
  MensajeMuro,
  Reaccion,
  Votacion,
  Voto,
  TurnoDibujoColaborativo,
  EstadoPresencia,
  EmojiReaccion,
  TipoObjetivoReaccion
} from '../types/database';

export interface RoomSyncState {
  sala: Sala | null;
  estudiantes: Estudiante[];
  respuestas: RespuestaEjercicio[];
  progresoHistoria: ProgresoHistoria | null;
  cuentoColaborativo: CuentoColaborativo | null;
  presencias: Record<string, PresenciaSala>;
  mensajesMuro: MensajeMuro[];
  reacciones: Reaccion[];
  votacionActiva: Votacion | null;
  votos: Voto[];
  turnoDibujo: TurnoDibujoColaborativo | null;
  ultimoEvento?: {
    tipo: string;
    mensaje: string;
    timestamp: number;
  };
}

type Listener = (state: RoomSyncState) => void;

class RealtimeSyncManager {
  private channel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private currentRoomCode: string | null = null;
  private listeners: Set<Listener> = new Set();

  private state: RoomSyncState = {
    sala: null,
    estudiantes: [],
    respuestas: [],
    progresoHistoria: null,
    cuentoColaborativo: null,
    presencias: {},
    mensajesMuro: [],
    reacciones: [],
    votacionActiva: null,
    votos: [],
    turnoDibujo: null
  };

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('ubuntu_quest_realtime_sync');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.roomCode === this.currentRoomCode) {
            this.handleRemoteStateUpdate(event.data.state, event.data.eventInfo);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }

      // Fallback con eventos de storage de ventana
      window.addEventListener('storage', (e) => {
        if (e.key === `ubuntu_room_${this.currentRoomCode}` && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.handleRemoteStateUpdate(data.state, data.eventInfo);
          } catch {
            // ignorar
          }
        }
      });
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(eventInfo?: { tipo: string; mensaje: string }) {
    if (eventInfo) {
      this.state.ultimoEvento = {
        ...eventInfo,
        timestamp: Date.now()
      };
    }
    this.listeners.forEach((l) => l({ ...this.state }));
    this.persistAndBroadcast(eventInfo);
  }

  private persistAndBroadcast(eventInfo?: { tipo: string; mensaje: string }) {
    if (!this.currentRoomCode) return;

    const payload = {
      roomCode: this.currentRoomCode,
      state: this.state,
      eventInfo
    };

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch {
        // ignorar
      }
    }

    try {
      localStorage.setItem(`ubuntu_room_${this.currentRoomCode}`, JSON.stringify(payload));
    } catch {
      // ignorar
    }

    // Si Supabase está conectado, emitir evento en canal Realtime
    if (this.channel && isSupabaseConfigured) {
      try {
        this.channel.send({
          type: 'broadcast',
          event: 'room_update',
          payload
        });
      } catch {
        // ignorar
      }
    }
  }

  private handleRemoteStateUpdate(remoteState: RoomSyncState, eventInfo?: { tipo: string; mensaje: string }) {
    this.state = {
      ...remoteState,
      ultimoEvento: eventInfo ? { ...eventInfo, timestamp: Date.now() } : this.state.ultimoEvento
    };
    this.listeners.forEach((l) => l({ ...this.state }));
  }

  // Conectar o unirse a una sala
  public async joinRoom(roomCode: string, isTeacher: boolean = false): Promise<RoomSyncState> {
    this.currentRoomCode = roomCode.toUpperCase().trim();

    try {
      const saved = localStorage.getItem(`ubuntu_room_${this.currentRoomCode}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = parsed.state || this.state;
      }
    } catch {
      // ignorar
    }

    // Conectar canal Realtime de Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        if (this.channel) {
          supabase.removeChannel(this.channel);
        }

        this.channel = supabase.channel(`room:${this.currentRoomCode}`, {
          config: {
            broadcast: { self: false }
          }
        });

        this.channel
          .on('broadcast', { event: 'room_update' }, ({ payload }) => {
            if (payload && payload.state) {
              this.handleRemoteStateUpdate(payload.state, payload.eventInfo);
            }
          })
          .subscribe();
      } catch (err) {
        console.warn('Supabase Realtime error:', err);
      }
    }

    this.notify();
    return this.state;
  }

  // Crear una sala nueva por la maestra
  public createRoom(maestraNombre: string, codigoPersonalizado?: string): Sala {
    const code = codigoPersonalizado?.toUpperCase().trim() || 
      'UB-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    const nuevaSala: Sala = {
      id: 'sala_' + Date.now(),
      codigo: code,
      maestra_nombre: maestraNombre,
      fase_actual: 'espera',
      config_json: {
        meta_preguntas: 20,
        sonido_activo: true,
        chat_libre_habilitado: false, // Moderación: apagado por defecto
        modo_mapa_colaborativo: false
      },
      created_at: new Date().toISOString()
    };

    this.currentRoomCode = code;
    this.state = {
      sala: nuevaSala,
      estudiantes: [], // SOLO estudiantes reales
      respuestas: [],
      progresoHistoria: null,
      cuentoColaborativo: null,
      presencias: {},
      mensajesMuro: [],
      reacciones: [],
      votacionActiva: null,
      votos: [],
      turnoDibujo: null
    };

    this.notify({
      tipo: 'sala_creada',
      mensaje: `Sala creada con código: ${code}`
    });

    return nuevaSala;
  }

  // Unir un estudiante real a la sala
  public addStudent(nombre: string, avatar: string): Estudiante {
    const nuevo: Estudiante = {
      id: 'est_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      sala_id: this.state.sala?.id || 'sala_default',
      nombre,
      avatar,
      conectado: true,
      estado_presencia: 'activo',
      created_at: new Date().toISOString(),
      respuestas_aportadas: 0
    };

    this.state.estudiantes = [...this.state.estudiantes, nuevo];
    
    // Registrar presencia inicial
    this.state.presencias[nuevo.id] = {
      sala_id: nuevo.sala_id,
      estudiante_id: nuevo.id,
      estudiante_nombre: nuevo.nombre,
      avatar: nuevo.avatar,
      estado: 'activo',
      ultima_actividad: new Date().toISOString()
    };

    this.notify({
      tipo: 'estudiante_unido',
      mensaje: `¡${nombre} se unió al equipo!`
    });

    return nuevo;
  }

  // Cambiar fase de la sala (Acción de la maestra)
  public setFase(fase: FaseSala, options?: { materia?: MateriaTipo; etapa?: EtapaHistorica; zona?: string }) {
    if (!this.state.sala) return;

    this.state.sala = {
      ...this.state.sala,
      fase_actual: fase,
      materia_activa: options?.materia ?? this.state.sala.materia_activa,
      etapa_activa: options?.etapa ?? this.state.sala.etapa_activa,
      zona_activa: options?.zona ?? this.state.sala.zona_activa
    };

    if (fase === 'ejercicios_activos' && options?.materia) {
      this.state.respuestas = [];
    }

    this.notify({
      tipo: 'fase_cambiada',
      mensaje: `Fase actualizada a: ${fase}`
    });
  }

  // Enviar respuesta a ejercicio escolar (100% cooperativo)
  public submitAnswer(
    estudianteId: string, 
    estudianteNombre: string, 
    materia: MateriaTipo, 
    ejercicioId: number, 
    respuesta: number, 
    esCorrecta: boolean
  ) {
    const respuestaObj: RespuestaEjercicio = {
      id: 'resp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      sala_id: this.state.sala?.id || 'sala_default',
      estudiante_id: estudianteId,
      estudiante_nombre: estudianteNombre,
      materia,
      ejercicio_id: ejercicioId,
      respuesta_seleccionada: respuesta,
      es_correcta: esCorrecta,
      created_at: new Date().toISOString()
    };

    this.state.respuestas = [...this.state.respuestas, respuestaObj];

    const st = this.state.estudiantes.find((e) => e.id === estudianteId);
    if (st) {
      st.respuestas_aportadas = (st.respuestas_aportadas || 0) + 1;
      st.ultimo_aporte = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    this.notify({
      tipo: 'respuesta_enviada',
      mensaje: `${estudianteNombre} aportó una respuesta`
    });
  }

  // -------------------------------------------------------------------------
  // PRESENCIA EN TIEMPO REAL
  // -------------------------------------------------------------------------
  public updatePresence(estudianteId: string, estado: EstadoPresencia) {
    const est = this.state.estudiantes.find((e) => e.id === estudianteId);
    if (!est) return;

    this.state.presencias[estudianteId] = {
      sala_id: this.state.sala?.id || '',
      estudiante_id: estudianteId,
      estudiante_nombre: est.nombre,
      avatar: est.avatar,
      estado,
      ultima_actividad: new Date().toISOString()
    };

    this.notify();
  }

  // -------------------------------------------------------------------------
  // MURO UBUNTU (MENSAJES CORTOS Y MODERACIÓN)
  // -------------------------------------------------------------------------
  public postMuroMessage(
    estudianteId: string, 
    estudianteNombre: string, 
    avatar: string,
    contenido: string, 
    tipo: MensajeMuro['tipo'], 
    etapaOMateria?: string
  ): MensajeMuro {
    const nuevo: MensajeMuro = {
      id: 'muro_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      sala_id: this.state.sala?.id || 'sala_default',
      estudiante_id: estudianteId,
      estudiante_nombre: estudianteNombre,
      avatar,
      contenido: contenido.trim().slice(0, 140),
      tipo,
      etapa_o_materia: etapaOMateria,
      aprobado: true,
      created_at: new Date().toISOString()
    };

    this.state.mensajesMuro = [nuevo, ...this.state.mensajesMuro];

    this.notify({
      tipo: 'nuevo_mensaje_muro',
      mensaje: `${estudianteNombre} compartió un mensaje en el Muro`
    });

    return nuevo;
  }

  public toggleAprobarMensaje(mensajeId: string, aprobado: boolean) {
    this.state.mensajesMuro = this.state.mensajesMuro.map((m) => 
      m.id === mensajeId ? { ...m, aprobado } : m
    );
    this.notify({
      tipo: 'mensaje_moderado',
      mensaje: `Mensaje ${aprobado ? 'visible' : 'oculto por la maestra'}`
    });
  }

  public deleteMensajeMuro(mensajeId: string) {
    this.state.mensajesMuro = this.state.mensajesMuro.filter((m) => m.id !== mensajeId);
    this.notify({
      tipo: 'mensaje_eliminado',
      mensaje: 'Mensaje eliminado del Muro'
    });
  }

  // Configuración de moderación (Permitir o restringir chat libre)
  public setChatLibreHabilitado(habilitado: boolean) {
    if (this.state.sala) {
      this.state.sala.config_json = {
        ...this.state.sala.config_json,
        chat_libre_habilitado: habilitado
      };
      this.notify({
        tipo: 'config_cambiada',
        mensaje: `Chat libre ${habilitado ? 'activado' : 'desactivado'}`
      });
    }
  }

  // -------------------------------------------------------------------------
  // REACCIONES POSITIVAS
  // -------------------------------------------------------------------------
  public toggleReaccion(
    objetivoTipo: TipoObjetivoReaccion,
    objetivoId: string,
    estudianteId: string,
    emoji: EmojiReaccion
  ) {
    const index = this.state.reacciones.findIndex(
      (r) => r.objetivo_tipo === objetivoTipo && 
             r.objetivo_id === objetivoId && 
             r.estudiante_id === estudianteId && 
             r.emoji === emoji
    );

    if (index >= 0) {
      // Quitar reacción
      this.state.reacciones.splice(index, 1);
    } else {
      // Agregar reacción
      this.state.reacciones.push({
        id: 'reac_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        sala_id: this.state.sala?.id || '',
        objetivo_tipo: objetivoTipo,
        objetivo_id: objetivoId,
        estudiante_id: estudianteId,
        emoji,
        created_at: new Date().toISOString()
      });
    }

    this.notify({
      tipo: 'reaccion_actualizada',
      mensaje: `Reacción ${emoji} registrada`
    });
  }

  // -------------------------------------------------------------------------
  // VOTACIONES EN VIVO
  // -------------------------------------------------------------------------
  public createVotacion(pregunta: string, opciones: Array<{ id: string; texto: string; icono?: string }>): Votacion {
    const nueva: Votacion = {
      id: 'vot_' + Date.now(),
      sala_id: this.state.sala?.id || '',
      pregunta,
      opciones,
      activa: true,
      resultado_ganador: null,
      created_at: new Date().toISOString(),
      total_votos: 0
    };

    this.state.votacionActiva = nueva;
    this.state.votos = [];

    this.notify({
      tipo: 'votacion_iniciada',
      mensaje: `¡Nueva consulta grupal abierta: "${pregunta}"!`
    });

    return nueva;
  }

  public castVoto(votacionId: string, estudianteId: string, opcionId: string) {
    if (!this.state.votacionActiva || this.state.votacionActiva.id !== votacionId || !this.state.votacionActiva.activa) {
      return;
    }

    // Reemplazar o insertar voto único del estudiante
    const existingIndex = this.state.votos.findIndex((v) => v.estudiante_id === estudianteId);
    if (existingIndex >= 0) {
      this.state.votos[existingIndex].opcion_id = opcionId;
    } else {
      this.state.votos.push({
        id: 'v_' + Date.now(),
        votacion_id: votacionId,
        estudiante_id: estudianteId,
        opcion_id: opcionId,
        created_at: new Date().toISOString()
      });
    }

    this.state.votacionActiva.total_votos = this.state.votos.length;

    this.notify({
      tipo: 'voto_emitido',
      mensaje: 'Voto anónimo sumado al consenso'
    });
  }

  public castConsensusVote(elementoId: string, estudianteNombre: string) {
    if (this.state.votacionActiva?.activa) {
      this.castVoto(this.state.votacionActiva.id, estudianteNombre, elementoId);
    } else {
      this.notify({
        tipo: 'voto_emitido',
        mensaje: `${estudianteNombre} propuso una idea para el consenso histórico`
      });
    }
  }

  public closeVotacion(votacionId: string) {
    if (!this.state.votacionActiva || this.state.votacionActiva.id !== votacionId) return;

    // Calcular opción ganadora
    const counts: Record<string, number> = {};
    for (const v of this.state.votos) {
      counts[v.opcion_id] = (counts[v.opcion_id] || 0) + 1;
    }

    let maxVotos = -1;
    let ganador: string | null = null;
    let empate = false;

    for (const op of this.state.votacionActiva.opciones) {
      const c = counts[op.id] || 0;
      if (c > maxVotos) {
        maxVotos = c;
        ganador = op.id;
        empate = false;
      } else if (c === maxVotos && maxVotos > 0) {
        empate = true;
      }
    }

    this.state.votacionActiva.activa = false;
    this.state.votacionActiva.resultado_ganador = empate ? null : ganador;

    this.notify({
      tipo: 'votacion_cerrada',
      mensaje: 'Consulta grupal completada con éxito'
    });
  }

  // -------------------------------------------------------------------------
  // TURNO DE MAPA COLABORATIVO
  // -------------------------------------------------------------------------
  public setTurnoDibujo(turno: TurnoDibujoColaborativo | null) {
    this.state.turnoDibujo = turno;
    this.notify({
      tipo: 'turno_mapa_cambiado',
      mensaje: turno 
        ? `Turno de dibujo asignado a ${turno.estudiante_nombre}` 
        : 'Turno de dibujo liberado'
    });
  }

  // Progreso de Historia de Venezuela
  public updateHistoryDecision(
    etapa: EtapaHistorica,
    zona: string,
    datos: ProgresoHistoria['datos_json'],
    completado: boolean = false
  ) {
    const progreso: ProgresoHistoria = {
      id: 'prog_' + etapa + '_' + zona,
      sala_id: this.state.sala?.id || 'sala_default',
      etapa,
      zona,
      datos_json: datos,
      completado
    };

    this.state.progresoHistoria = progreso;

    if (completado && datos.cronica_narrada) {
      const fragmentos = this.state.cuentoColaborativo?.fragmentos_json || [];
      const nuevoFragmento = {
        autor: `Equipo ${this.state.sala?.codigo || '4to Grado'}`,
        texto: datos.cronica_narrada,
        timestamp: new Date().toLocaleDateString('es-VE')
      };

      this.state.cuentoColaborativo = {
        id: 'codice_' + Date.now(),
        sala_id: this.state.sala?.id || 'sala_default',
        etapa,
        texto_completo: (this.state.cuentoColaborativo?.texto_completo || '') + '\n\n' + datos.cronica_narrada,
        fragmentos_json: [...fragmentos, nuevoFragmento]
      };
    }

    this.notify({
      tipo: 'decision_historia',
      mensaje: `El grupo acordó una decisión en ${zona}`
    });
  }

  // Regresar al lobby
  public resetToLobby() {
    if (this.state.sala) {
      this.state.sala.fase_actual = 'espera';
      this.state.respuestas = [];
      this.notify({
        tipo: 'volver_lobby',
        mensaje: 'Regresamos todos al círculo de la sala'
      });
    }
  }

  public getState(): RoomSyncState {
    return { ...this.state };
  }
}

export const realtimeManager = new RealtimeSyncManager();

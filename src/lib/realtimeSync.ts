import { supabase, isSupabaseConfigured } from './supabase';
import { 
  Sala, 
  Estudiante, 
  FaseSala, 
  MateriaTipo, 
  EtapaHistorica, 
  ProgresoHistoria, 
  RespuestaEjercicio,
  CuentoColaborativo
} from '../types/database';

export interface RoomSyncState {
  sala: Sala | null;
  estudiantes: Estudiante[];
  respuestas: RespuestaEjercicio[];
  progresoHistoria: ProgresoHistoria | null;
  cuentoColaborativo: CuentoColaborativo | null;
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
    cuentoColaborativo: null
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

      // Also listen to window storage events as fallback
      window.addEventListener('storage', (e) => {
        if (e.key === `ubuntu_room_${this.currentRoomCode}` && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.handleRemoteStateUpdate(data.state, data.eventInfo);
          } catch {
            // ignore
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
        // ignore
      }
    }

    try {
      localStorage.setItem(`ubuntu_room_${this.currentRoomCode}`, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }

  private handleRemoteStateUpdate(remoteState: RoomSyncState, eventInfo?: { tipo: string; mensaje: string }) {
    this.state = {
      ...remoteState,
      ultimoEvento: eventInfo ? { ...eventInfo, timestamp: Date.now() } : this.state.ultimoEvento
    };
    this.listeners.forEach((l) => l({ ...this.state }));
  }

  // Connect to a room code
  public async joinRoom(roomCode: string, isTeacher: boolean = false): Promise<RoomSyncState> {
    this.currentRoomCode = roomCode.toUpperCase().trim();

    // Check if room state exists in localStorage
    try {
      const saved = localStorage.getItem(`ubuntu_room_${this.currentRoomCode}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = parsed.state || this.state;
      }
    } catch {
      // ignore
    }

    // Connect to Supabase Realtime Channel if configured
    if (isSupabaseConfigured && supabase) {
      try {
        if (this.channel) {
          supabase.removeChannel(this.channel);
        }

        this.channel = supabase.channel(`room:${this.currentRoomCode}`, {
          config: {
            broadcast: { self: false },
            presence: { key: isTeacher ? 'maestra' : 'estudiante_' + Date.now() }
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
        console.warn('Supabase Realtime connection error:', err);
      }
    }

    this.notify();
    return this.state;
  }

  // Teacher creates a room
  public createRoom(maestraNombre: string, customCode?: string): Sala {
    const code = customCode 
      ? customCode.toUpperCase().trim() 
      : 'UBUNTU-' + Math.floor(100 + Math.random() * 900);

    const nuevaSala: Sala = {
      id: 'sala_' + Date.now(),
      codigo: code,
      maestra_nombre: maestraNombre,
      fase_actual: 'espera',
      created_at: new Date().toISOString(),
      config_json: {
        meta_preguntas: 20,
        permite_simulados: true,
        sonido_activo: true
      }
    };

    this.currentRoomCode = code;
    this.state = {
      sala: nuevaSala,
      estudiantes: [],
      respuestas: [],
      progresoHistoria: null,
      cuentoColaborativo: null
    };

    this.notify({
      tipo: 'sala_creada',
      mensaje: `La maestra ${maestraNombre} abrió la sala con código ${code}`
    });

    return nuevaSala;
  }

  // Student joins room
  public addStudent(nombre: string, avatar: string): Estudiante {
    const existing = this.state.estudiantes.find(
      (e) => e.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
    );

    if (existing) {
      existing.conectado = true;
      existing.avatar = avatar;
      this.notify({
        tipo: 'estudiante_reconectado',
        mensaje: `${nombre} se reconectó a la sala`
      });
      return existing;
    }

    const nuevo: Estudiante = {
      id: 'est_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      sala_id: this.state.sala?.id || 'sala_default',
      nombre,
      avatar,
      conectado: true,
      created_at: new Date().toISOString(),
      respuestas_aportadas: 0
    };

    this.state.estudiantes = [...this.state.estudiantes, nuevo];
    this.notify({
      tipo: 'estudiante_unido',
      mensaje: `¡${nombre} se unió al equipo!`
    });

    return nuevo;
  }

  // Add simulated demo students for classroom simulation
  public toggleSimulatedStudents(enable: boolean) {
    if (!enable) {
      this.state.estudiantes = this.state.estudiantes.filter((e) => !e.id.startsWith('sim_'));
      this.notify({
        tipo: 'alumnos_simulados',
        mensaje: 'Alumnos de prueba retirados'
      });
      return;
    }

    const demoKids = [
      { nombre: 'Camila', avatar: '🦜' },
      { nombre: 'Mateo', avatar: '🐾' },
      { nombre: 'Valentina', avatar: '🌸' },
      { nombre: 'Sebastián', avatar: '🐆' },
      { nombre: 'Diego', avatar: '🛶' }
    ];

    const currentNames = new Set(this.state.estudiantes.map((e) => e.nombre));
    const toAdd: Estudiante[] = demoKids
      .filter((k) => !currentNames.has(k.nombre))
      .map((k, idx) => ({
        id: `sim_${idx}_` + Date.now(),
        sala_id: this.state.sala?.id || 'sala_default',
        nombre: k.nombre,
        avatar: k.avatar,
        conectado: true,
        created_at: new Date().toISOString(),
        respuestas_aportadas: 0
      }));

    this.state.estudiantes = [...this.state.estudiantes, ...toAdd];
    this.notify({
      tipo: 'alumnos_simulados',
      mensaje: '¡Aula virtual completa con 5 compañeros de prueba!'
    });
  }

  // Change room phase / activity (Teacher action)
  public setFase(fase: FaseSala, options?: { materia?: MateriaTipo; etapa?: EtapaHistorica; zona?: string }) {
    if (!this.state.sala) return;

    this.state.sala = {
      ...this.state.sala,
      fase_actual: fase,
      materia_activa: options?.materia ?? this.state.sala.materia_activa,
      etapa_activa: options?.etapa ?? this.state.sala.etapa_activa,
      zona_activa: options?.zona ?? this.state.sala.zona_activa
    };

    // If starting a new subject, reset answers if needed
    if (fase === 'ejercicios_activos' && options?.materia) {
      this.state.respuestas = [];
    }

    this.notify({
      tipo: 'fase_cambiada',
      mensaje: `Fase actualizada a: ${fase}`
    });
  }

  // Submit student exercise answer (Cooperative mechanic)
  public submitAnswer(estudianteId: string, estudianteNombre: string, materia: MateriaTipo, ejercicioId: number, respuesta: number, esCorrecta: boolean) {
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

    // Update student's answers count
    const st = this.state.estudiantes.find((e) => e.id === estudianteId);
    if (st) {
      st.respuestas_aportadas = (st.respuestas_aportadas || 0) + 1;
      st.ultimo_aporte = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    this.notify({
      tipo: 'respuesta_enviada',
      mensaje: `${estudianteNombre} aportó una respuesta`
    });

    // If simulated students are active, simulate 1-2 random teammate answers after a short delay
    const hasSimulated = this.state.estudiantes.some((e) => e.id.startsWith('sim_'));
    if (hasSimulated && esCorrecta) {
      setTimeout(() => {
        const simStudent = this.state.estudiantes.find((e) => e.id.startsWith('sim_') && e.id !== estudianteId);
        if (simStudent) {
          const simResp: RespuestaEjercicio = {
            id: 'resp_sim_' + Date.now(),
            sala_id: this.state.sala?.id || 'sala_default',
            estudiante_id: simStudent.id,
            estudiante_nombre: simStudent.nombre,
            materia,
            ejercicio_id: (ejercicioId % 20) + 1,
            respuesta_seleccionada: 1,
            es_correcta: true,
            created_at: new Date().toISOString()
          };
          simStudent.respuestas_aportadas = (simStudent.respuestas_aportadas || 0) + 1;
          this.state.respuestas = [...this.state.respuestas, simResp];
          this.notify({
            tipo: 'respuesta_enviada',
            mensaje: `${simStudent.nombre} aportó al equipo`
          });
        }
      }, 1500);
    }
  }

  // Update History Progress (Group consensus decision)
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

    // If completed chronicle, add to class codex (Códice de la clase)
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
      mensaje: `El grupo tomó una decisión en ${zona}`
    });
  }

  // Cast vote in consensus
  public castConsensusVote(optionId: string, studentName: string) {
    if (!this.state.progresoHistoria) {
      this.state.progresoHistoria = {
        id: 'prog_temp',
        sala_id: this.state.sala?.id || '',
        etapa: this.state.sala?.etapa_activa || 'precolombina',
        zona: this.state.sala?.zona_activa || 'andes_timoto',
        datos_json: {
          votos_consenso: {},
          aportes_estudiantes: []
        },
        completado: false
      };
    }

    const currentVotes = this.state.progresoHistoria.datos_json.votos_consenso || {};
    currentVotes[optionId] = (currentVotes[optionId] || 0) + 1;

    const aportes = this.state.progresoHistoria.datos_json.aportes_estudiantes || [];
    aportes.push({
      estudiante_nombre: studentName,
      aporte: `Votó por ${optionId}`
    });

    this.state.progresoHistoria.datos_json.votos_consenso = currentVotes;
    this.state.progresoHistoria.datos_json.aportes_estudiantes = aportes;

    this.notify({
      tipo: 'voto_consenso',
      mensaje: `${studentName} sumó su voz al acuerdo`
    });
  }

  // Reset room for new activity
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

  // Get current state snapshot
  public getState(): RoomSyncState {
    return { ...this.state };
  }
}

export const realtimeManager = new RealtimeSyncManager();

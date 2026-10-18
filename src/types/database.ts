export type FaseSala = 
  | 'espera' 
  | 'ejercicios_activos' 
  | 'historia_activa' 
  | 'celebracion' 
  | 'pausa';

export type MateriaTipo = 
  | 'lectura' 
  | 'matematica' 
  | 'ciencia' 
  | 'logica';

export type EtapaHistorica = 
  | 'precolombina' 
  | 'colonial' 
  | 'independencia' 
  | 'federacion' 
  | 'actualidad';

export type EstadoPresencia = 'activo' | 'reflexionando' | 'ausente';

export interface Estudiante {
  id: string;
  sala_id: string;
  nombre: string;
  avatar: string; // emoji o animal (turpial, chiguire, orquidea, jaguar, colibri)
  conectado: boolean;
  estado_presencia?: EstadoPresencia;
  created_at: string;
  ultimo_aporte?: string;
  respuestas_aportadas?: number;
}

export interface Sala {
  id: string;
  codigo: string;
  maestra_nombre: string;
  fase_actual: FaseSala;
  materia_activa?: MateriaTipo;
  etapa_activa?: EtapaHistorica;
  zona_activa?: string;
  created_at: string;
  config_json?: {
    meta_preguntas?: number;
    sonido_activo?: boolean;
    chat_libre_habilitado?: boolean; // Control de moderación docente
    modo_mapa_colaborativo?: boolean;
  };
}

export interface PreguntaEjercicio {
  id: number;
  materia: MateriaTipo;
  texto_base?: string;
  pregunta: string;
  opciones: string[];
  respuesta_correcta: number; // 0..3
  explicacion_ubuntu: string;
  tipo: 'literal' | 'inferencial' | 'operacion' | 'problema' | 'concepto' | 'acertijo';
}

export interface RespuestaEjercicio {
  id: string;
  sala_id: string;
  estudiante_id: string;
  estudiante_nombre?: string;
  materia: MateriaTipo;
  ejercicio_id: number;
  respuesta_seleccionada: number;
  es_correcta: boolean;
  created_at: string;
}

export interface ElementoZona {
  id: string;
  categoria: 'vivienda' | 'alimentacion' | 'trabajo' | 'organizacion' | 'creencias_tecnologia';
  titulo: string;
  descripcion: string;
  icono: string;
  impacto_ubuntu: string;
}

export interface ZonaHistorica {
  id: string;
  nombre: string;
  etapa: EtapaHistorica;
  region: 'Andes' | 'Llanos' | 'Costa/Caribe' | 'Guayana' | 'Occidente' | 'Centro' | 'Zulia' | 'Oriente';
  pueblos_o_personajes: string;
  descripcion_historica: string;
  mision_colaborativa: string;
  elementos: ElementoZona[];
  pregunta_reflexion: string;
}

export interface ProgresoHistoria {
  id: string;
  sala_id: string;
  etapa: EtapaHistorica;
  zona: string;
  datos_json: {
    nombre_aldea_o_proyecto?: string;
    vivienda_id?: string;
    alimentacion_id?: string;
    trabajo_id?: string;
    organizacion_id?: string;
    creencias_id?: string;
    decision_patriota?: string;
    ley_consensuada?: string;
    solucion_futuro?: string;
    cronica_narrada?: string;
    votos_consenso?: Record<string, number>;
    aportes_estudiantes?: Array<{ estudiante_nombre: string; aporte: string }>;
  };
  completado: boolean;
}

export interface CuentoColaborativo {
  id: string;
  sala_id: string;
  etapa?: EtapaHistorica;
  texto_completo: string;
  fragmentos_json: Array<{
    autor: string;
    texto: string;
    timestamp: string;
  }>;
}

export interface CoordPunto {
  x: number;
  y: number;
}

export interface MapaBase {
  id: string;
  sala_id: string;
  etapa: EtapaHistorica;
  nombre: string;
  imagen_url: string;
  imagen_width: number;
  imagen_height: number;
  publicado: boolean;
  created_at: string;
}

export interface ZonaMapa {
  id: string;
  mapa_base_id: string;
  sala_id: string;
  nombre: string;
  color: string;
  coords_json: CoordPunto[];
  etapa: EtapaHistorica;
  orden: number;
  autor_nombre?: string; // Para modo colaborativo entre alumnos
  created_at: string;
}

// ----------------------------------------------------------------------
// INTERACCIÓN REAL ENTRE ESTUDIANTES (PROMPT 2)
// ----------------------------------------------------------------------

export interface PresenciaSala {
  id?: string;
  sala_id: string;
  estudiante_id: string;
  estudiante_nombre: string;
  avatar: string;
  estado: EstadoPresencia;
  ultima_actividad: string;
}

export type TipoMensajeMuro = 'mensaje' | 'idea' | 'pregunta' | 'logro';

export interface MensajeMuro {
  id: string;
  sala_id: string;
  estudiante_id: string;
  estudiante_nombre: string;
  avatar?: string;
  contenido: string; // máx 140 caracteres
  tipo: TipoMensajeMuro;
  etapa_o_materia?: string;
  aprobado: boolean; // moderado por la maestra
  created_at: string;
}

export type EmojiReaccion = '👏' | '❤️' | '⭐' | '🌟' | '💡' | '🌱';

export type TipoObjetivoReaccion = 
  | 'muro_ubuntu' 
  | 'respuesta_ejercicio' 
  | 'fragmento_cuento' 
  | 'zona_mapa';

export interface Reaccion {
  id: string;
  sala_id: string;
  objetivo_tipo: TipoObjetivoReaccion;
  objetivo_id: string;
  estudiante_id: string;
  emoji: EmojiReaccion;
  created_at: string;
}

export interface OpcionVotacion {
  id: string;
  texto: string;
  icono?: string;
}

export interface Votacion {
  id: string;
  sala_id: string;
  pregunta: string;
  opciones: OpcionVotacion[];
  activa: boolean;
  resultado_ganador?: string | null;
  created_at: string;
  total_votos?: number;
}

export interface Voto {
  id: string;
  votacion_id: string;
  estudiante_id: string;
  opcion_id: string;
  created_at?: string;
}

export interface TurnoDibujoColaborativo {
  estudiante_id: string;
  estudiante_nombre: string;
  avatar: string;
  inicio_tiempo: string;
}

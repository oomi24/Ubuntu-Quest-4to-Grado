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

export interface Estudiante {
  id: string;
  sala_id: string;
  nombre: string;
  avatar: string; // emoji or animal avatar (e.g. turpial, chiguire, orquidea, jaguar, colibri)
  conectado: boolean;
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
    permite_simulados?: boolean;
    sonido_activo?: boolean;
  };
}

export interface PreguntaEjercicio {
  id: number;
  materia: MateriaTipo;
  texto_base?: string; // Por ejemplo fábula o contexto
  pregunta: string;
  opciones: string[];
  respuesta_correcta: number; // índice 0..3
  explicacion_ubuntu: string; // Explicación solidaria para aprender en grupo
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
  x: number; // Coordenada X en píxeles de la imagen original
  y: number; // Coordenada Y en píxeles de la imagen original
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
  coords_json: CoordPunto[]; // [{x, y}, ...]
  etapa: EtapaHistorica;
  orden: number;
  created_at: string;
}

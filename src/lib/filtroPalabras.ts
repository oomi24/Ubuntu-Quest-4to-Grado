/**
 * Filtro pedagógico de respeto Ubuntu para 4to grado.
 * Detecta lenguaje ofensivo, groserías y faltas de respeto en español (con modismos comunes),
 * considerando sustituciones de leet-speak (@, 1, 3, 0, $, etc.) y espaciados forzados.
 */

// Lista de términos no permitidos para un entorno escolar de primaria
const PALABRAS_NO_PERMITIDAS = [
  'tonto', 'tonta', 'estupido', 'estupida', 'idiota', 'imbecil', 'bobo', 'boba',
  'maldito', 'maldita', 'feo', 'fea', 'asqueroso', 'asquerosa', 'inutil',
  'coño', 'coñoemadre', 'coñomadre', 'maldicion', 'mierda', 'verga', 'guevon',
  'guevona', 'webon', 'webona', 'huevon', 'huevona', 'mamaguevo', 'mamahuevo',
  'pendejo', 'pendeja', 'puta', 'puto', 'marico', 'marica', 'culicagao', 'culo',
  'ladron', 'ladrona', 'tramposo', 'tramposa', 'muerete', 'matar', 'callate'
];

/**
 * Normaliza un texto para neutralizar evasiones clásicas de filtros
 */
function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
    .replace(/[@4]/g, 'a')
    .replace(/[3]/g, 'e')
    .replace(/[1!|]/g, 'i')
    .replace(/[0]/g, 'o')
    .replace(/[$5]/g, 's')
    .replace(/[+]/g, 't')
    .replace(/[^a-z0-9\s]/g, '') // Quitar puntuación
    .replace(/\s+/g, ' ')
    .trim();
}

export interface ResultadoFiltro {
  esValido: boolean;
  motivo?: string;
  terminoDetectado?: string;
}

/**
 * Valida un mensaje de un estudiante para el Muro Ubuntu.
 */
export function validarMensajeUbuntu(contenido: string): ResultadoFiltro {
  const limpio = contenido.trim();

  if (!limpio) {
    return {
      esValido: false,
      motivo: 'El mensaje no puede estar vacío.'
    };
  }

  if (limpio.length > 140) {
    return {
      esValido: false,
      motivo: 'El mensaje supera los 140 caracteres permitidos.'
    };
  }

  const normalizado = normalizarTexto(limpio);
  const normalizadoSinEspacios = normalizado.replace(/\s+/g, '');
  const palabras = normalizado.split(' ');

  for (const termino of PALABRAS_NO_PERMITIDAS) {
    // Coincidencia por palabra exacta
    if (palabras.includes(termino)) {
      return {
        esValido: false,
        motivo: 'Ese mensaje no es Ubuntu. Intenta reformularlo con respeto y fraternidad.',
        terminoDetectado: termino
      };
    }

    // Coincidencia si intentaron separar las letras con espacios (ej. "t o n t o")
    if (termino.length >= 4 && normalizadoSinEspacios.includes(termino)) {
      return {
        esValido: false,
        motivo: 'Ese mensaje no es Ubuntu. Intenta reformularlo con respeto y fraternidad.',
        terminoDetectado: termino
      };
    }
  }

  return {
    esValido: true
  };
}

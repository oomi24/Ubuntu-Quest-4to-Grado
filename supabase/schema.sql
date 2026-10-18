-- ==============================================================================
-- UBUNTU QUEST 4TO GRADO - ESQUEMA DE BASE DE DATOS SUPABASE (POSTGRESQL + REALTIME)
-- Filosofía Ubuntu: "Soy porque somos" - Colaboración Real entre Estudiantes
-- ==============================================================================

-- 1. TIPOS ENUMERADOS
DO $$ BEGIN
  CREATE TYPE fase_sala_enum AS ENUM (
    'espera', 
    'ejercicios_activos', 
    'historia_activa', 
    'celebracion', 
    'pausa'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE materia_enum AS ENUM (
    'lectura', 
    'matematica', 
    'ciencia', 
    'logica'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE etapa_historica_enum AS ENUM (
    'precolombina', 
    'colonial', 
    'independencia', 
    'federacion', 
    'actualidad'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. TABLA DE SALAS (AULA VIRTUAL CREADA POR LA MAESTRA)
CREATE TABLE IF NOT EXISTS public.salas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(10) UNIQUE NOT NULL,
  maestra_nombre VARCHAR(100) NOT NULL,
  fase_actual fase_sala_enum DEFAULT 'espera' NOT NULL,
  materia_activa materia_enum,
  etapa_activa etapa_historica_enum,
  zona_activa VARCHAR(80),
  config_json JSONB DEFAULT '{"meta_preguntas": 20, "sonido_activo": true, "chat_libre_habilitado": false, "modo_mapa_colaborativo": false}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. TABLA DE ESTUDIANTES (PARTICIPANTES REALES EN TIEMPO REAL)
CREATE TABLE IF NOT EXISTS public.estudiantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  avatar VARCHAR(50) DEFAULT 'turpial' NOT NULL,
  conectado BOOLEAN DEFAULT TRUE NOT NULL,
  ultimo_visto TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. TABLA DE PRESENCIA EN TIEMPO REAL
CREATE TABLE IF NOT EXISTS public.presencia_sala (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  estudiante_id UUID REFERENCES public.estudiantes(id) ON DELETE CASCADE NOT NULL,
  estado TEXT DEFAULT 'activo' NOT NULL, -- 'activo', 'reflexionando', 'ausente'
  ultima_actividad TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unq_presencia_estudiante UNIQUE (estudiante_id)
);

-- 5. TABLA DEL MURO UBUNTU (MENSAJES CORTOS Y APORTES COLECTIVOS)
CREATE TABLE IF NOT EXISTS public.muro_ubuntu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  estudiante_id UUID REFERENCES public.estudiantes(id) ON DELETE CASCADE NOT NULL,
  estudiante_nombre TEXT NOT NULL,
  avatar TEXT DEFAULT '🦜' NOT NULL,
  contenido TEXT NOT NULL CHECK (char_length(contenido) <= 140),
  tipo TEXT DEFAULT 'mensaje' NOT NULL, -- 'mensaje', 'idea', 'pregunta', 'logro'
  etapa_o_materia TEXT,
  aprobado BOOLEAN DEFAULT TRUE NOT NULL, -- La maestra puede desmarcar para ocultar
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. TABLA DE REACCIONES POSITIVAS (APOYO FRATERNO ENTRE ALUMNOS)
CREATE TABLE IF NOT EXISTS public.reacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  objetivo_tipo TEXT NOT NULL, -- 'muro_ubuntu', 'respuesta_ejercicio', 'fragmento_cuento', 'zona_mapa'
  objetivo_id UUID NOT NULL,
  estudiante_id UUID REFERENCES public.estudiantes(id) ON DELETE CASCADE NOT NULL,
  emoji TEXT NOT NULL CHECK (emoji IN ('👏','❤️','⭐','🌟','💡','🌱')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unq_reaccion_unica UNIQUE (objetivo_tipo, objetivo_id, estudiante_id, emoji)
);

-- 7. TABLAS DE VOTACIONES PARA DECISIONES DE CONSENSO
CREATE TABLE IF NOT EXISTS public.votaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  pregunta TEXT NOT NULL,
  opciones JSONB NOT NULL, -- [{id:'a', texto:'...'}, ...]
  activa BOOLEAN DEFAULT TRUE NOT NULL,
  resultado_ganador TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.votos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  votacion_id UUID REFERENCES public.votaciones(id) ON DELETE CASCADE NOT NULL,
  estudiante_id UUID REFERENCES public.estudiantes(id) ON DELETE CASCADE NOT NULL,
  opcion_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unq_voto_estudiante UNIQUE (votacion_id, estudiante_id)
);

-- 8. TABLA DE PROGRESO DE HISTORIA DE VENEZUELA (CONSTRUCCIÓN COLECTIVA)
CREATE TABLE IF NOT EXISTS public.progreso_historia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  etapa etapa_historica_enum NOT NULL,
  zona VARCHAR(80) NOT NULL,
  datos_json JSONB DEFAULT '{}'::jsonb NOT NULL,
  completado BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unq_sala_etapa_zona UNIQUE (sala_id, etapa, zona)
);

-- 9. TABLA DE RESPUESTAS A EJERCICIOS (APORTES COLECTIVOS)
CREATE TABLE IF NOT EXISTS public.respuestas_ejercicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  estudiante_id UUID REFERENCES public.estudiantes(id) ON DELETE CASCADE NOT NULL,
  materia materia_enum NOT NULL,
  ejercicio_id INT NOT NULL,
  respuesta INT NOT NULL,
  es_correcta BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. TABLA DE CUENTOS Y CRÓNICAS COLABORATIVAS ("CÓDICE DE LA CLASE")
CREATE TABLE IF NOT EXISTS public.cuentos_colaborativos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  etapa etapa_historica_enum,
  texto_completo TEXT DEFAULT '' NOT NULL,
  fragmentos_json JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. TABLAS PARA EL EDITOR DE MAPAS HISTÓRICOS Y MAPA COLABORATIVO
CREATE TABLE IF NOT EXISTS public.mapas_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE,
  etapa etapa_historica_enum NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  imagen_url TEXT NOT NULL,
  imagen_width INT NOT NULL,
  imagen_height INT NOT NULL,
  publicado BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.zonas_mapa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mapa_base_id UUID REFERENCES public.mapas_base(id) ON DELETE CASCADE NOT NULL,
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  color VARCHAR(20) DEFAULT '#F59E0B' NOT NULL,
  coords_json JSONB NOT NULL,
  etapa etapa_historica_enum NOT NULL,
  orden INT DEFAULT 0 NOT NULL,
  autor_nombre TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. ÍNDICES DE RENDIMIENTO PARA TIEMPO REAL
CREATE INDEX IF NOT EXISTS idx_salas_codigo ON public.salas(codigo);
CREATE INDEX IF NOT EXISTS idx_estudiantes_sala ON public.estudiantes(sala_id);
CREATE INDEX IF NOT EXISTS idx_presencia_sala ON public.presencia_sala(sala_id);
CREATE INDEX IF NOT EXISTS idx_muro_sala ON public.muro_ubuntu(sala_id);
CREATE INDEX IF NOT EXISTS idx_muro_created ON public.muro_ubuntu(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reacciones_obj ON public.reacciones(objetivo_tipo, objetivo_id);
CREATE INDEX IF NOT EXISTS idx_reacciones_sala ON public.reacciones(sala_id);
CREATE INDEX IF NOT EXISTS idx_votaciones_sala ON public.votaciones(sala_id);
CREATE INDEX IF NOT EXISTS idx_votos_votacion ON public.votos(votacion_id);
CREATE INDEX IF NOT EXISTS idx_progreso_historia_sala ON public.progreso_historia(sala_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_sala ON public.respuestas_ejercicios(sala_id);
CREATE INDEX IF NOT EXISTS idx_cuentos_sala ON public.cuentos_colaborativos(sala_id);
CREATE INDEX IF NOT EXISTS idx_mapas_base_sala ON public.mapas_base(sala_id);
CREATE INDEX IF NOT EXISTS idx_zonas_mapa_mapa ON public.zonas_mapa(mapa_base_id);
CREATE INDEX IF NOT EXISTS idx_zonas_mapa_sala ON public.zonas_mapa(sala_id);

-- 13. HABILITACIÓN DE SUPABASE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE public.salas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.estudiantes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.presencia_sala;
ALTER PUBLICATION supabase_realtime ADD TABLE public.muro_ubuntu;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reacciones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votaciones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.progreso_historia;
ALTER PUBLICATION supabase_realtime ADD TABLE public.respuestas_ejercicios;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cuentos_colaborativos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mapas_base;
ALTER PUBLICATION supabase_realtime ADD TABLE public.zonas_mapa;

-- 14. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.salas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presencia_sala ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.muro_ubuntu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reacciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progreso_historia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respuestas_ejercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cuentos_colaborativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mapas_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zonas_mapa ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso para aula escolar colaborativa
CREATE POLICY "Lectura publica salas" ON public.salas FOR SELECT USING (true);
CREATE POLICY "Escritura salas anon" ON public.salas FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Acceso total estudiantes" ON public.estudiantes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total presencia" ON public.presencia_sala FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total muro" ON public.muro_ubuntu FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total reacciones" ON public.reacciones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total votaciones" ON public.votaciones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total votos" ON public.votos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total progreso historia" ON public.progreso_historia FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total respuestas ejercicios" ON public.respuestas_ejercicios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total cuentos colaborativos" ON public.cuentos_colaborativos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total mapas base" ON public.mapas_base FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total zonas mapa" ON public.zonas_mapa FOR ALL USING (true) WITH CHECK (true);

-- 15. TRIGGER PARA ACTUALIZAR TIMESTAMPS AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_salas_updated_at ON public.salas;
CREATE TRIGGER trg_salas_updated_at
  BEFORE UPDATE ON public.salas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_progreso_historia_updated_at ON public.progreso_historia;
CREATE TRIGGER trg_progreso_historia_updated_at
  BEFORE UPDATE ON public.progreso_historia
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

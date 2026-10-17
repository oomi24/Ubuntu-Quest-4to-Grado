-- ==============================================================================
-- UBUNTU QUEST 4TO GRADO - ESQUEMA DE BASE DE DATOS SUPABASE (POSTGRESQL + REALTIME)
-- Filosofía Ubuntu: "Soy porque somos"
-- ==============================================================================

-- 1. TIPOS ENUMERADOS
CREATE TYPE fase_sala_enum AS ENUM (
  'espera', 
  'ejercicios_activos', 
  'historia_activa', 
  'celebracion', 
  'pausa'
);

CREATE TYPE materia_enum AS ENUM (
  'lectura', 
  'matematica', 
  'ciencia', 
  'logica'
);

CREATE TYPE etapa_historica_enum AS ENUM (
  'precolombina', 
  'colonial', 
  'independencia', 
  'federacion', 
  'actualidad'
);

-- 2. TABLA DE SALAS (AULA VIRTUAL CREADA POR LA MAESTRA)
CREATE TABLE IF NOT EXISTS public.salas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(10) UNIQUE NOT NULL,
  maestra_nombre VARCHAR(100) NOT NULL,
  fase_actual fase_sala_enum DEFAULT 'espera' NOT NULL,
  materia_activa materia_enum,
  etapa_activa etapa_historica_enum,
  zona_activa VARCHAR(80),
  config_json JSONB DEFAULT '{"meta_preguntas": 20, "permite_simulados": true, "sonido_activo": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. TABLA DE ESTUDIANTES (PARTICIPANTES CONECTADOS EN TIEMPO REAL)
CREATE TABLE IF NOT EXISTS public.estudiantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  avatar VARCHAR(50) DEFAULT 'turpial' NOT NULL,
  conectado BOOLEAN DEFAULT TRUE NOT NULL,
  ultimo_visto TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. TABLA DE PROGRESO DE HISTORIA DE VENEZUELA (CONSTRUCCIÓN COLECTIVA)
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

-- 5. TABLA DE RESPUESTAS A EJERCICIOS (APORTES COLECTIVOS)
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

-- 6. TABLA DE CUENTOS Y CRÓNICAS COLABORATIVAS ("CÓDICE DE LA CLASE")
CREATE TABLE IF NOT EXISTS public.cuentos_colaborativos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  etapa etapa_historica_enum,
  texto_completo TEXT DEFAULT '' NOT NULL,
  fragmentos_json JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. ÍNDICES DE RENDIMIENTO PARA TIEMPO REAL
CREATE INDEX IF NOT EXISTS idx_salas_codigo ON public.salas(codigo);
CREATE INDEX IF NOT EXISTS idx_estudiantes_sala ON public.estudiantes(sala_id);
CREATE INDEX IF NOT EXISTS idx_progreso_historia_sala ON public.progreso_historia(sala_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_sala ON public.respuestas_ejercicios(sala_id);
CREATE INDEX IF NOT EXISTS idx_cuentos_sala ON public.cuentos_colaborativos(sala_id);

-- 8. HABILITACIÓN DE SUPABASE REALTIME
-- Esto permite suscripciones WebSocket cliente en tiempo real:
ALTER PUBLICATION supabase_realtime ADD TABLE public.salas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.estudiantes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.progreso_historia;
ALTER PUBLICATION supabase_realtime ADD TABLE public.respuestas_ejercicios;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cuentos_colaborativos;

-- 9. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.salas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progreso_historia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respuestas_ejercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cuentos_colaborativos ENABLE ROW LEVEL SECURITY;

-- Acceso colaborativo para lectura y escritura en la sala escolar
CREATE POLICY "Permitir lectura publica de salas por codigo"
  ON public.salas FOR SELECT
  USING (true);

CREATE POLICY "Permitir creacion de salas por maestras"
  ON public.salas FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir actualizacion de sala a participantes"
  ON public.salas FOR UPDATE
  USING (true);

CREATE POLICY "Acceso total estudiantes"
  ON public.estudiantes FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Acceso total progreso historia"
  ON public.progreso_historia FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Acceso total respuestas ejercicios"
  ON public.respuestas_ejercicios FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Acceso total cuentos colaborativos"
  ON public.cuentos_colaborativos FOR ALL
  USING (true)
  WITH CHECK (true);

-- 10. TRIGGER PARA ACTUALIZAR TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_salas_updated_at
  BEFORE UPDATE ON public.salas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_progreso_historia_updated_at
  BEFORE UPDATE ON public.progreso_historia
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

# Ubuntu Quest 4to Grado — PWA Educativa Colaborativa

Aplicación Web Progresiva (PWA) diseñada para estudiantes de 4to grado (9–10 años) y su maestra, cimentada en la filosofía **Ubuntu ("Soy porque somos")**. Todo el sistema premia la cooperación, el aporte colectivo y la construcción comunitaria, eliminando rankings individuales y castigos por error.

---

## 🌟 Características Pedagógicas y Técnicas

1. **Filosofía Ubuntu en Acción:**
   - Cero clasificaciones individuales o podios destructivos.
   - El progreso es del salón completo (meta colectiva de logros).
   - **Pausa de Reflexión Ubuntu:** Las respuestas erróneas no restan puntos; muestran una pista solidaria para que el grupo discuta e investigue la respuesta en armonía.
   - **Árbol de Saberes y Baobab Colectivo:** Celebración grupal con fanfarria y confeti al alcanzar las metas conjuntas.

2. **Módulo de Materias Básicas (80 Ejercicios):**
   - **Lectura Comprensiva (20):** Textos cortos, fábulas y relatos venezolanos (el turpial, el Araguaney, Simón Rodríguez, el Catatumbo) con preguntas literales e inferenciales.
   - **Matemática Solidaria (20):** Operaciones básicas, fracciones (1/2, 3/4), geometría/perímetro, patrones y distribución equitativa de recursos.
   - **Ciencias de la Tierra (20):** Ecosistemas venezolanos (manglares, tepuyes, llanos), fotosíntesis, cuerpo humano y el sistema solar.
   - **Razonamiento Lógico (20):** Acertijos, analogías, secuencias lógicas y deducciones comunitarias.

3. **Módulo Especial: Historia de Venezuela (Crear la Vida de Cada Zona):**
   - Línea de tiempo interactiva con **5 épocas históricas**:
     1. **Época Precolombina (antes de 1498):** "Diseña una aldea originaria" (Andes, Llanos, Costa/Caribe, Guayana, Occidente).
     2. **Época Colonial (1498–1810):** "Construye una hacienda y reflexiona sobre la equidad y justicia social".
     3. **Independencia (1810–1823):** "Consejo Patriota de Decisiones en la guerra" (Campaña Admirable, Las Queseras, ayuda de Haití).
     4. **Federación (1830–1899):** "El Gran Acuerdo Federal y la Instrucción Pública Gratuita de 1870".
     5. **Actualidad (siglos XX–XXI):** "Diseña el futuro de tu zona" (energía limpia, agua del Lago de Maracaibo, ciencia y huertos escolares).
   - Mapa interactivo de Venezuela con zonas clicables.
   - Generador de Crónica Colectiva ("Un día en la vida de la aldea") integrado en el **Códice de la Clase** con opción de impresión de diploma colectivo.

4. **Cumplimiento PWA Completo:**
   - `manifest.json` configurado para modo `standalone`.
   - `sw.js` (Service Worker) con estrategia Cache-First para recursos estáticos y Network-First con fallback offline para navegación.
   - Íconos PNG y SVG (192px, 512px, maskable y apple-touch-icon).
   - Botón de instalación in-app (`PWAInstallButton`) con modal explicativo para iOS y Android.
   - Notificación de conectividad en vivo (`OfflineIndicator`).

5. **Audio Sintetizado con Web Audio API:**
   - Sonidos matemáticos generados en tiempo real por el navegador (chimes pentatónicos, tono de reflexión y fanfarria).
   - 100% libre de descargas de audio y funciona sin conexión a internet.

---

## 🗄️ Modelo de Datos y Supabase

El archivo `/supabase/schema.sql` contiene la configuración completa:
- `salas`: `id`, `codigo`, `maestra_nombre`, `fase_actual`, `materia_activa`, `etapa_activa`, `zona_activa`, `config_json`, `created_at`.
- `estudiantes`: `id`, `sala_id`, `nombre`, `avatar`, `conectado`, `ultimo_visto`, `created_at`.
- `progreso_historia`: `id`, `sala_id`, `etapa`, `zona`, `datos_json`, `completado`, `created_at`.
- `respuestas_ejercicios`: `id`, `sala_id`, `estudiante_id`, `materia`, `ejercicio_id`, `respuesta`, `es_correcta`, `created_at`.
- `cuentos_colaborativos`: `id`, `sala_id`, `etapa`, `texto_completo`, `fragmentos_json`, `created_at`.
- Publicación habilitada en `supabase_realtime`.
- Políticas de Row Level Security (RLS) colaborativas.

---

## 🚀 Despliegue en Vercel

1. **Configurar Supabase:**
   - Crea un proyecto en [supabase.com](https://supabase.com).
   - Copia y ejecuta en el **SQL Editor** el contenido de `/supabase/schema.sql`.
   - Copia la URL del proyecto y el `anon public key` desde *Project Settings > API*.

2. **Desplegar en Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```
   Agrega las variables de entorno en Vercel:
   - `VITE_SUPABASE_URL` = tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu clave anónima pública de Supabase

3. **Prueba Inmediata sin Supabase Cloud:**
   - La aplicación integra un motor en tiempo real basado en **BroadcastChannel + LocalStorage Event Sync**. Puedes abrir la app en dos pestañas simultáneas (una como Maestra creando la sala y otra como Estudiante uniéndose) para ver la sincronización inmediata sin necesidad de configurar claves.

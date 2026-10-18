import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OfflineIndicator } from './components/OfflineIndicator';
import { TeacherLobby } from './components/TeacherLobby';
import { StudentLobby } from './components/StudentLobby';
import { SubjectModule } from './components/SubjectModule';
import { HistoryModule } from './components/HistoryModule';
import { ClassCodexModal } from './components/ClassCodexModal';
import { CollectiveCelebrationModal } from './components/CollectiveCelebrationModal';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { realtimeManager, RoomSyncState } from './lib/realtimeSync';
import { sounds } from './lib/soundEffects';
import { Sala, Estudiante, MateriaTipo, EtapaHistorica } from './types/database';
import { 
  Users, 
  Sparkles, 
  Heart, 
  BookOpen, 
  Compass, 
  ShieldCheck, 
  ArrowRight,
  School,
  Smile,
  HelpCircle,
  Award
} from 'lucide-react';

export default function App() {
  const [syncState, setSyncState] = useState<RoomSyncState>(realtimeManager.getState());
  const [rol, setRol] = useState<'maestra' | 'estudiante' | null>(null);
  const [estudianteActual, setEstudianteActual] = useState<Estudiante | null>(null);

  // Modals state
  const [codexOpen, setCodexOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);

  // Teacher creation form state on Home
  const [maestraNombre, setMaestraNombre] = useState('Elena');
  const [customRoomCode, setCustomRoomCode] = useState('UBUNTU-4A');

  // Subscribe to realtime room updates
  useEffect(() => {
    const unsubscribe = realtimeManager.subscribe((newState) => {
      setSyncState(newState);

      // If room phase transitions to celebration, open celebration modal
      if (newState.sala?.fase_actual === 'celebracion') {
        setCelebrationOpen(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const sala = syncState.sala;
  const estudiantes = syncState.estudiantes;
  const respuestas = syncState.respuestas;
  const progresoHistoria = syncState.progresoHistoria;
  const cuentoColaborativo = syncState.cuentoColaborativo;

  // Handle Teacher Room Creation
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccessChime();
    const nuevaSala = realtimeManager.createRoom(
      maestraNombre.trim() || 'Elena',
      customRoomCode.trim() || 'UBUNTU-4A'
    );
    setRol('maestra');
  };

  // Handle Student Join
  const handleStudentJoin = (nombre: string, avatar: string, codigo: string) => {
    realtimeManager.joinRoom(codigo, false).then(() => {
      const nuevoEst = realtimeManager.addStudent(nombre, avatar);
      setEstudianteActual(nuevoEst);
      setRol('estudiante');
    });
  };

  // Teacher starts subject module
  const handleStartSubject = (materia: MateriaTipo) => {
    sounds.playClick();
    realtimeManager.setFase('ejercicios_activos', { materia });
  };

  // Teacher starts history module
  const handleStartHistory = (etapa: EtapaHistorica, zonaId?: string) => {
    sounds.playClick();
    realtimeManager.setFase('historia_activa', { etapa, zona: zonaId || '' });
  };

  // Trigger collective celebration
  const handleFinishSubject = () => {
    realtimeManager.setFase('celebracion');
    setCelebrationOpen(true);
  };

  // Return to lobby
  const handleReturnToLobby = () => {
    setCelebrationOpen(false);
    realtimeManager.resetToLobby();
  };

  // Reset role to switch or go home
  const handleResetRole = () => {
    sounds.playClick();
    setRol(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-stone-800">
      <Header
        sala={sala}
        rol={rol}
        estudianteNombre={estudianteActual?.nombre}
        onOpenCodex={() => setCodexOpen(true)}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
        onResetRole={handleResetRole}
      />

      <main className="flex-1 pb-16">
        {/* VIEW 1: HOME / ROLE SELECTOR (When no role selected yet) */}
        {!rol && (
          <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in">
            {/* Hero Banner */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs sm:text-sm font-bold border border-teal-200">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Filosofía Ubuntu: "Soy porque somos"</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-stone-900 tracking-tight">
                Ubuntu Quest <span className="text-teal-700">4to Grado</span>
              </h1>
              <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
                Una aventura colaborativa para niñas, niños y maestras de educación primaria.
                Aquí no competimos por podios individuales: construimos juntos la sabiduría en <strong>Lectura, Matemática, Ciencia, Razonamiento</strong> y revivimos la <strong>Historia de Venezuela</strong>.
              </p>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Card 1: Teacher Facilitator */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-600/30 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform" />
                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-3xl shadow-md shadow-teal-600/20">
                    👩‍🏫
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      Facilitadora del Aprendizaje
                    </span>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-stone-900 mt-0.5">
                      Soy la Maestra
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                      Crea un aula virtual con código único, observa a los estudiantes en vivo, abre los retos de 4 materias o la construcción histórica de Venezuela.
                    </p>
                  </div>

                  <form onSubmit={handleCreateRoom} className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Tu Nombre de Maestra
                      </label>
                      <input
                        type="text"
                        value={maestraNombre}
                        onChange={(e) => setMaestraNombre(e.target.value)}
                        placeholder="Ej. Maestra Elena"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Código de la Sala para tu Clase
                      </label>
                      <input
                        type="text"
                        value={customRoomCode}
                        onChange={(e) => setCustomRoomCode(e.target.value.toUpperCase())}
                        placeholder="Ej. UBUNTU-4A"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 font-mono font-bold text-xs sm:text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-heading font-bold text-sm shadow-md shadow-teal-600/20 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Abrir Sala de Clase</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                <div className="text-[11px] text-teal-800 font-medium bg-teal-50 p-2.5 rounded-xl border border-teal-100">
                  ✨ Presencia en vivo, Muro comunitario Ubuntu y votaciones en tiempo real.
                </div>
              </div>

              {/* Card 2: Student Participant */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500/30 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform" />
                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center text-3xl shadow-md shadow-amber-500/20">
                    🎒
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      Estudiante de Primaria
                    </span>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-stone-900 mt-0.5">
                      Soy Estudiante
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                      Elige a tu guardián de la fauna venezolana, escribe tu nombre y entra con el código que proyectó tu maestra para jugar con tus amigos.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <p className="text-xs text-amber-900 font-medium">
                      ¿Tienes el código de tu aula? Pulsa el botón abajo para ingresar y esperar a que la maestra inicie la misión.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                      <span>Código de prueba sugerido:</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300">
                        {sala?.codigo || 'UBUNTU-4A'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setRol('estudiante');
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-heading font-bold text-sm shadow-md shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Ingresar como Estudiante</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ubuntu Pedagogy Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white/80 p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-start gap-3">
                <span className="text-2xl">🤝</span>
                <div>
                  <h3 className="font-heading font-bold text-xs text-stone-900">
                    Sin Rankings Ni Castigos
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Las dudas se resuelven en equipo mediante la Pausa de Reflexión Ubuntu.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-start gap-3">
                <span className="text-2xl">🇻🇪</span>
                <div>
                  <h3 className="font-heading font-bold text-xs text-stone-900">
                    Historia Viva de Venezuela
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Construye la vida en 5 etapas: Precolombina, Colonial, Independencia, Federación y Actualidad.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-start gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h3 className="font-heading font-bold text-xs text-stone-900">
                    PWA 100% Instalable
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Funciona en teléfonos, tabletas y computadoras escolares, incluso sin conexión a internet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TEACHER VIEW */}
        {rol === 'maestra' && sala && (
          <div>
            {sala.fase_actual === 'espera' && (
              <TeacherLobby
                sala={sala}
                estudiantes={estudiantes}
                onStartSubject={handleStartSubject}
                onStartHistory={handleStartHistory}
                onOpenCodex={() => setCodexOpen(true)}
              />
            )}

            {sala.fase_actual === 'ejercicios_activos' && (
              <SubjectModule
                sala={sala}
                rol="maestra"
                estudianteActual={null}
                estudiantes={estudiantes}
                respuestas={respuestas}
                onFinishSubject={handleFinishSubject}
                onReturnToLobby={handleReturnToLobby}
              />
            )}

            {sala.fase_actual === 'historia_activa' && (
              <HistoryModule
                sala={sala}
                rol="maestra"
                estudianteActual={null}
                estudiantes={estudiantes}
                progresoActual={progresoHistoria}
                onFinishHistory={handleFinishSubject}
                onReturnToLobby={handleReturnToLobby}
                onOpenCodex={() => setCodexOpen(true)}
              />
            )}
          </div>
        )}

        {/* VIEW 3: STUDENT VIEW */}
        {rol === 'estudiante' && (
          <div>
            {(!estudianteActual || !sala || sala.fase_actual === 'espera') && (
              <StudentLobby
                sala={sala}
                estudiante={estudianteActual}
                estudiantesEnSala={estudiantes}
                onJoin={handleStudentJoin}
                defaultCode={sala?.codigo || 'UBUNTU-4A'}
              />
            )}

            {sala && estudianteActual && sala.fase_actual === 'ejercicios_activos' && (
              <SubjectModule
                sala={sala}
                rol="estudiante"
                estudianteActual={estudianteActual}
                estudiantes={estudiantes}
                respuestas={respuestas}
                onFinishSubject={handleFinishSubject}
                onReturnToLobby={handleReturnToLobby}
              />
            )}

            {sala && estudianteActual && sala.fase_actual === 'historia_activa' && (
              <HistoryModule
                sala={sala}
                rol="estudiante"
                estudianteActual={estudianteActual}
                estudiantes={estudiantes}
                progresoActual={progresoHistoria}
                onFinishHistory={handleFinishSubject}
                onReturnToLobby={handleReturnToLobby}
                onOpenCodex={() => setCodexOpen(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Offline Notification Indicator */}
      <OfflineIndicator />

      {/* Class Codex Modal (Storybook & Certificate) */}
      <ClassCodexModal
        isOpen={codexOpen}
        onClose={() => setCodexOpen(false)}
        sala={sala}
        estudiantes={estudiantes}
        cuentoColaborativo={cuentoColaborativo}
      />

      {/* Collective Victory Celebration Modal */}
      <CollectiveCelebrationModal
        isOpen={celebrationOpen}
        sala={sala}
        estudiantes={estudiantes}
        totalLogros={new Set(respuestas.filter((r) => r.es_correcta).map((r) => r.ejercicio_id)).size || 20}
        onReturnToLobby={handleReturnToLobby}
        onOpenCodex={() => {
          setCelebrationOpen(false);
          setCodexOpen(true);
        }}
      />

      {/* Supabase Architecture & Vercel Deployment Modal */}
      <SupabaseSetupModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </div>
  );
}

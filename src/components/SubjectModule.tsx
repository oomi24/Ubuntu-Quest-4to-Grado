import React, { useState, useEffect } from 'react';
import { Sala, Estudiante, MateriaTipo, RespuestaEjercicio } from '../types/database';
import { EJERCICIOS_BANCO, MATERIAS_CONFIG } from '../data/exercisesData';
import { realtimeManager } from '../lib/realtimeSync';
import { sounds } from '../lib/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  Award,
  BookOpen,
  Volume2,
  Heart
} from 'lucide-react';

interface SubjectModuleProps {
  sala: Sala;
  rol: 'maestra' | 'estudiante';
  estudianteActual: Estudiante | null;
  estudiantes: Estudiante[];
  respuestas: RespuestaEjercicio[];
  onFinishSubject: () => void;
  onReturnToLobby: () => void;
}

export const SubjectModule: React.FC<SubjectModuleProps> = ({
  sala,
  rol,
  estudianteActual,
  estudiantes,
  respuestas,
  onFinishSubject,
  onReturnToLobby
}) => {
  const materia = sala.materia_activa || 'lectura';
  const materiaInfo = MATERIAS_CONFIG[materia] || MATERIAS_CONFIG.lectura;
  const banco = EJERCICIOS_BANCO[materia] || EJERCICIOS_BANCO.lectura;

  // Track the exercise index for this student
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showReflectionPause, setShowReflectionPause] = useState(false);
  const [hasAnsweredCorrectly, setHasAnsweredCorrectly] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  const currentExercise = banco[currentIdx] || banco[0];

  // Calculate collective progress (unique exercises solved correctly by the class)
  const solvedExerciseIds = new Set(
    respuestas.filter((r) => r.materia === materia && r.es_correcta).map((r) => r.ejercicio_id)
  );
  const metaTotal = 20;
  const logrosGrupo = Math.min(solvedExerciseIds.size, metaTotal);
  const porcentaje = Math.round((logrosGrupo / metaTotal) * 100);

  // Soft timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Trigger confetti when collective goal of 20 is achieved!
  useEffect(() => {
    if (logrosGrupo >= metaTotal) {
      sounds.playCelebrationFanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [logrosGrupo]);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null && hasAnsweredCorrectly) return;
    setSelectedOption(idx);
    sounds.playClick();

    const isCorrect = idx === currentExercise.respuesta_correcta;

    if (isCorrect) {
      sounds.playSuccessChime();
      setHasAnsweredCorrectly(true);
      setShowReflectionPause(false);

      // Register cooperative answer
      if (estudianteActual) {
        realtimeManager.submitAnswer(
          estudianteActual.id,
          estudianteActual.nombre,
          materia,
          currentExercise.id,
          idx,
          true
        );
      }
    } else {
      // Ubuntu Reflection pause: no negative scoring, no shame!
      sounds.playReflectionTone();
      setShowReflectionPause(true);

      if (estudianteActual) {
        realtimeManager.submitAnswer(
          estudianteActual.id,
          estudianteActual.nombre,
          materia,
          currentExercise.id,
          idx,
          false
        );
      }
    }
  };

  const handleNextExercise = () => {
    setSelectedOption(null);
    setShowReflectionPause(false);
    setHasAnsweredCorrectly(false);
    sounds.playClick();
    if (currentIdx < banco.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCurrentIdx(0); // Cycle through bank
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Collective Gauge & Info Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-2xl shadow-xs">
              {materiaInfo.icono}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-bold text-stone-900">
                  {materiaInfo.titulo}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                  Reto Colectivo 4to Grado
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Cada respuesta correcta suma al Árbol de Saberes del salón.
              </p>
            </div>
          </div>

          {/* Soft Timer & Team Stats */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-xl text-stone-700 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>{formatTimer(secondsElapsed)}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl text-amber-800 text-xs font-bold border border-amber-200/80">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>{estudiantes.length} Jugando</span>
            </div>
          </div>
        </div>

        {/* Collective Progress Bar */}
        <div className="space-y-1.5 bg-teal-50/60 p-4 rounded-2xl border border-teal-100">
          <div className="flex justify-between items-center text-xs font-bold text-teal-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Progreso del Equipo: {logrosGrupo} de {metaTotal} Retos Alcanzados</span>
            </span>
            <span className="font-mono text-teal-700">{porcentaje}%</span>
          </div>
          <div className="h-4 w-full bg-stone-200/80 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${Math.max(porcentaje, 4)}%` }}
            />
          </div>
          <p className="text-[11px] text-teal-700/80 italic text-center">
            "Si uno aprende, todos crecemos; cuando todos aportamos, nadie se queda atrás."
          </p>
        </div>
      </div>

      {/* Teacher facilitation dashboard (when viewing as teacher) */}
      {rol === 'maestra' && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">👩‍🏫</span>
              <h2 className="font-heading font-bold text-stone-900 text-base">
                Panel de Observación de la Maestra
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playCelebrationFanfare();
                  confetti({ particleCount: 100, spread: 70 });
                  onFinishSubject();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-xs transition cursor-pointer"
              >
                🎉 Celebrar Logro Grupal
              </button>
              <button
                onClick={onReturnToLobby}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition cursor-pointer"
              >
                Regresar a la Sala
              </button>
            </div>
          </div>

          {/* Students active participation list */}
          <div>
            <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
              Aportes Recientes de los Estudiantes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {estudiantes.map((st) => {
                const totalAportes = respuestas.filter((r) => r.estudiante_id === st.id).length;
                const correctas = respuestas.filter((r) => r.estudiante_id === st.id && r.es_correcta).length;
                return (
                  <div
                    key={st.id}
                    className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2"
                  >
                    <span className="text-2xl">{st.avatar}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-stone-900 truncate">
                        {st.nombre}
                      </p>
                      <p className="text-[10px] text-teal-700 font-medium">
                        {correctas} {correctas === 1 ? 'acierto' : 'aciertos'} aportados
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Student Exercise Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            Ejercicio {currentIdx + 1} de {banco.length}
          </span>
          <span className="text-xs text-stone-400 font-medium">
            Tipo: <strong className="text-stone-600 capitalize">{currentExercise.tipo}</strong>
          </span>
        </div>

        {/* Short Text or Fable (if available) */}
        {currentExercise.texto_base && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-stone-800 text-sm sm:text-base leading-relaxed">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wide mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Lectura del Reto</span>
            </div>
            <p className="italic font-serif">"{currentExercise.texto_base}"</p>
          </div>
        )}

        {/* The Question */}
        <div>
          <h2 className="text-lg sm:text-xl font-heading font-bold text-stone-900 leading-snug">
            {currentExercise.pregunta}
          </h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentExercise.opciones.map((opc, idx) => {
            const isSelected = selectedOption === idx;
            const isThisCorrect = idx === currentExercise.respuesta_correcta;

            let btnStyle = 'border-stone-200 hover:border-teal-400 bg-stone-50 hover:bg-teal-50/40 text-stone-800';

            if (isSelected) {
              if (isThisCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400/40 font-bold';
              } else {
                btnStyle = 'border-amber-400 bg-amber-50 text-amber-900 font-semibold';
              }
            } else if (hasAnsweredCorrectly && isThisCorrect) {
              btnStyle = 'border-emerald-400 bg-emerald-50 text-emerald-900 font-bold';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${btnStyle}`}
              >
                <span className="w-7 h-7 rounded-full bg-white border border-current flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm sm:text-base leading-snug flex-1">
                  {opc}
                </span>
                {isSelected && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Ubuntu Reflection Pause (when student picks another option) */}
        {showReflectionPause && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 animate-in fade-in slide-in-from-top-2 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-heading font-bold text-sm">
              <span className="text-xl">🤝</span>
              <span>¡Pausa de Reflexión Ubuntu! Discutamos juntos:</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              No te preocupes: los errores son oportunidades doradas para que el equipo investigue y comprenda.
            </p>
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-xs sm:text-sm text-stone-700 font-medium">
              💡 <strong>Pista para el grupo:</strong> {currentExercise.explicacion_ubuntu}
            </div>
            <p className="text-[11px] text-amber-900 font-bold">
              ¡Intenta seleccionar la opción correcta ahora con la ayuda de tu equipo!
            </p>
          </div>
        )}

        {/* Success message upon correct answer */}
        {hasAnsweredCorrectly && (
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 animate-in fade-in space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-heading font-bold text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>¡Excelente aporte para el equipo!</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
              {currentExercise.explicacion_ubuntu}
            </p>
          </div>
        )}

        {/* Action button to proceed */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Pregunta {currentIdx + 1} de {banco.length}
          </div>

          <button
            onClick={handleNextExercise}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition cursor-pointer shadow-md ${
              hasAnsweredCorrectly
                ? 'bg-teal-600 hover:bg-teal-700 text-white animate-pulse'
                : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
            }`}
          >
            <span>Siguiente Pregunta</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

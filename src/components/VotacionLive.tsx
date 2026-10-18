import React, { useState, useEffect } from 'react';
import { realtimeManager, RoomSyncState } from '../lib/realtimeSync';
import { Votacion, Voto } from '../types/database';
import { sounds } from '../lib/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Vote, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  X, 
  Users, 
  Trophy, 
  Lock,
  ArrowRight
} from 'lucide-react';

interface VotacionLiveProps {
  salaId: string;
  estudianteId?: string;
  esMaestra?: boolean;
}

export const VotacionLive: React.FC<VotacionLiveProps> = ({
  salaId,
  estudianteId,
  esMaestra = false
}) => {
  const [votacion, setVotacion] = useState<Votacion | null>(null);
  const [votos, setVotos] = useState<Voto[]>([]);
  const [creandoNueva, setCreandoNueva] = useState(false);

  // Formulario de nueva votación
  const [preguntaInput, setPreguntaInput] = useState('');
  const [opcionesInput, setOpcionesInput] = useState<string[]>(['', '']);

  useEffect(() => {
    const unsubscribe = realtimeManager.subscribe((state: RoomSyncState) => {
      setVotacion(state.votacionActiva);
      setVotos(state.votos);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const miVoto = votos.find((v) => v.estudiante_id === estudianteId);

  // Conteo de votos anónimos
  const conteoOpciones: Record<string, number> = {};
  if (votacion) {
    votacion.opciones.forEach((op) => {
      conteoOpciones[op.id] = 0;
    });
    votos.forEach((v) => {
      if (conteoOpciones[v.opcion_id] !== undefined) {
        conteoOpciones[v.opcion_id]++;
      }
    });
  }

  const totalVotos = votos.length;

  const handleVotar = (opcionId: string) => {
    if (!votacion || !votacion.activa || !estudianteId) return;
    sounds.playClick();
    realtimeManager.castVoto(votacion.id, estudianteId, opcionId);
  };

  const handleCrearVotacion = (e: React.FormEvent) => {
    e.preventDefault();
    const limpias = opcionesInput.filter((o) => o.trim().length > 0);
    if (!preguntaInput.trim() || limpias.length < 2) return;

    sounds.playSuccessChime();
    const formatted = limpias.map((txt, idx) => ({
      id: String.fromCharCode(65 + idx), // A, B, C, D
      texto: txt.trim()
    }));

    realtimeManager.createVotacion(preguntaInput.trim(), formatted);
    setPreguntaInput('');
    setOpcionesInput(['', '']);
    setCreandoNueva(false);
  };

  const handleCerrarVotacion = () => {
    if (!votacion) return;
    sounds.playCelebrationFanfare();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    realtimeManager.closeVotacion(votacion.id);
  };

  const opcionGanadora = votacion?.resultado_ganador 
    ? votacion.opciones.find((op) => op.id === votacion.resultado_ganador) 
    : null;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-5">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
            🗳️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-heading font-bold text-stone-900">
                Acuerdos y Votación por Consenso
              </h2>
              {votacion?.activa && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold animate-pulse">
                  Votación Abierta
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              Cada voz cuenta para construir las decisiones de la historia y el salón de clases.
            </p>
          </div>
        </div>

        {/* Botón de la maestra para crear o cerrar consulta */}
        {esMaestra && (
          <div className="flex items-center gap-2">
            {votacion?.activa ? (
              <button
                type="button"
                onClick={handleCerrarVotacion}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Cerrar Votación y Revelar Consenso</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setCreandoNueva(!creandoNueva);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva Votación</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Formulario de creación (solo maestra) */}
      {creandoNueva && esMaestra && (
        <form onSubmit={handleCrearVotacion} className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200 space-y-3 animate-in fade-in">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-teal-950 text-sm">Crear Nueva Consulta Grupal</h3>
            <button type="button" onClick={() => setCreandoNueva(false)} className="text-stone-400 hover:text-stone-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-900 uppercase tracking-wide mb-1">
              Pregunta o Dilema a Resolver:
            </label>
            <input
              type="text"
              value={preguntaInput}
              onChange={(e) => setPreguntaInput(e.target.value)}
              placeholder="Ej. ¿Qué tipo de vivienda comunal construiremos en la zona?"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-teal-900 uppercase tracking-wide">
              Opciones de Respuesta:
            </label>
            {opcionesInput.map((op, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-200 text-teal-900 text-xs font-bold flex items-center justify-center font-mono">
                  {String.fromCharCode(65 + idx)}
                </span>
                <input
                  type="text"
                  value={op}
                  onChange={(e) => {
                    const arr = [...opcionesInput];
                    arr[idx] = e.target.value;
                    setOpcionesInput(arr);
                  }}
                  placeholder={`Opción ${String.fromCharCode(65 + idx)}`}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white"
                  required
                />
              </div>
            ))}

            {opcionesInput.length < 4 && (
              <button
                type="button"
                onClick={() => setOpcionesInput([...opcionesInput, ''])}
                className="text-xs text-teal-700 font-semibold hover:underline cursor-pointer"
              >
                + Añadir otra opción
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Lanzar Votación al Salón
          </button>
        </form>
      )}

      {/* Vista de la votación actual */}
      {votacion ? (
        <div className="space-y-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="font-semibold uppercase tracking-wide">Dilema Colectivo</span>
              <span className="font-mono font-bold text-teal-800">
                {totalVotos} {totalVotos === 1 ? 'voto anónimo' : 'votos anónimos'}
              </span>
            </div>
            <h3 className="font-heading font-bold text-stone-900 text-base sm:text-lg">
              {votacion.pregunta}
            </h3>
          </div>

          {/* Opciones con barras de progreso */}
          <div className="space-y-2.5">
            {votacion.opciones.map((op) => {
              const votosOp = conteoOpciones[op.id] || 0;
              const porcentaje = totalVotos > 0 ? Math.round((votosOp / totalVotos) * 100) : 0;
              const esMiVoto = miVoto?.opcion_id === op.id;

              return (
                <div
                  key={op.id}
                  onClick={() => votacion.activa && handleVotar(op.id)}
                  className={`relative p-3.5 rounded-2xl border transition overflow-hidden ${
                    votacion.activa ? 'cursor-pointer hover:border-teal-400' : 'cursor-default'
                  } ${
                    esMiVoto
                      ? 'border-teal-500 bg-teal-50/70 shadow-2xs'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  {/* Barra de progreso de fondo */}
                  <div
                    className="absolute inset-y-0 left-0 bg-teal-100/60 transition-all duration-500 pointer-events-none"
                    style={{ width: `${porcentaje}%` }}
                  />

                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-heading font-bold text-xs ${
                        esMiVoto ? 'bg-teal-600 text-white' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {op.id}
                      </span>
                      <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                        {op.texto}
                      </span>
                      {esMiVoto && (
                        <span className="px-2 py-0.2 rounded-full bg-teal-200 text-teal-900 text-[10px] font-bold">
                          Tu voto
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-right">
                      <span className="font-mono text-xs text-stone-500">{votosOp} votos</span>
                      <span className="font-heading font-bold text-xs sm:text-sm text-teal-800 min-w-[42px]">
                        {porcentaje}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resultado si la votación está cerrada */}
          {!votacion.activa && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1 animate-in zoom-in-95">
              <div className="text-2xl">🏆</div>
              <h4 className="font-heading font-bold text-amber-950 text-sm">
                {opcionGanadora
                  ? `¡El equipo eligió la Opción ${opcionGanadora.id}: "${opcionGanadora.texto}"!`
                  : '¡El equipo llegó a un empate fraterno y buscará un consenso ampliado!'}
              </h4>
              <p className="text-xs text-amber-800 max-w-md mx-auto">
                "Soy porque somos": Cuando construimos acuerdos juntos, todas las ideas suman al bien común.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-500 space-y-1">
          <div className="text-2xl">⚖️</div>
          <p className="font-heading font-semibold text-xs text-stone-700">No hay ninguna votación activa en este momento</p>
          <p className="text-[11px] text-stone-400">
            {esMaestra
              ? 'Haz clic en "Nueva Votación" para proponer una pregunta al grupo.'
              : 'La maestra abrirá una consulta cuando el equipo deba tomar un acuerdo grupal.'}
          </p>
        </div>
      )}
    </div>
  );
};

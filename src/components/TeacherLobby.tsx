import React, { useState } from 'react';
import { Sala, Estudiante, MateriaTipo, EtapaHistorica } from '../types/database';
import { MATERIAS_CONFIG } from '../data/exercisesData';
import { ETAPAS_HISTORIA } from '../data/historyData';
import { realtimeManager } from '../lib/realtimeSync';
import { sounds } from '../lib/soundEffects';
import { MuroUbuntu } from './MuroUbuntu';
import { VotacionLive } from './VotacionLive';
import { PresenciaLive } from './PresenciaLive';
import { 
  Users, 
  Play, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Check, 
  Compass, 
  ChevronRight,
  MessageSquare,
  Vote,
  Shield,
  Layers,
  Heart
} from 'lucide-react';

interface TeacherLobbyProps {
  sala: Sala;
  estudiantes: Estudiante[];
  onStartSubject: (materia: MateriaTipo) => void;
  onStartHistory: (etapa: EtapaHistorica, zonaId?: string) => void;
  onOpenCodex: () => void;
}

export const TeacherLobby: React.FC<TeacherLobbyProps> = ({
  sala,
  estudiantes,
  onStartSubject,
  onStartHistory,
  onOpenCodex
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [panelActivo, setPanelActivo] = useState<'actividades' | 'muro' | 'votaciones'>('actividades');
  const [moduloActivo, setModuloActivo] = useState<'materias' | 'historia'>('materias');
  const [selectedMateria, setSelectedMateria] = useState<MateriaTipo>('lectura');
  const [selectedEtapa, setSelectedEtapa] = useState<EtapaHistorica>('precolombina');
  const [selectedZona, setSelectedZona] = useState<string>('andes_timoto');

  const copyCode = () => {
    navigator.clipboard.writeText(sala.codigo);
    setCopiedCode(true);
    sounds.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const etapaObj = ETAPAS_HISTORIA.find((e) => e.id === selectedEtapa) || ETAPAS_HISTORIA[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Facilitator Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-amber-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Panel de la Maestra Facilitadora</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Bienvenida, Maestra {sala.maestra_nombre}
            </h1>
            <p className="text-sm sm:text-base text-teal-100 max-w-xl mt-1 leading-relaxed">
              En este espacio colaborativo no hay ganadores individuales: todo el progreso se construye entre todos.
              Invita a los niños con el código único de la sala.
            </p>
          </div>

          {/* Room Code Card for Classroom Projection */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 flex flex-col items-center justify-center text-center shadow-lg min-w-[240px]">
            <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
              Código de la Sala
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-widest my-1.5 py-1 px-4 bg-black/20 rounded-xl border border-white/10">
              {sala.codigo}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={copyCode}
                className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition cursor-pointer font-medium"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? '¡Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Students Section with Live Presence */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-heading font-bold text-stone-900">
                  Círculo de Estudiantes Conectados
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                  {estudiantes.length} {estudiantes.length === 1 ? 'estudiante real' : 'estudiantes reales'}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Sincronización en tiempo real vía Supabase Realtime & BroadcastChannel
              </p>
            </div>
          </div>

          <div className="self-start sm:self-center">
            <PresenciaLive salaId={sala.id} compact={true} />
          </div>
        </div>

        {/* Student avatars grid (ONLY real students) */}
        {estudiantes.length === 0 ? (
          <div className="text-center py-8 px-4 bg-amber-50/50 rounded-2xl border border-dashed border-amber-200">
            <div className="text-3xl mb-2 animate-bounce">🎒</div>
            <h3 className="font-heading font-semibold text-stone-800 text-sm">
              Esperando a que los estudiantes ingresen el código <span className="font-mono text-teal-700 font-bold">{sala.codigo}</span>
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
              Comparte el código con tus estudiantes para que se unan desde sus dispositivos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {estudiantes.map((st) => (
              <div
                key={st.id}
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-stone-50 hover:bg-teal-50/60 border border-stone-200/80 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {st.avatar || '🎒'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs text-stone-900 truncate">
                    {st.nombre}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Conectado</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Barra de Navegación de Paneles de la Maestra */}
      <div className="flex border-b border-stone-200 bg-white rounded-2xl p-1.5 shadow-xs">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setPanelActivo('actividades');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm transition cursor-pointer ${
            panelActivo === 'actividades'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Actividades de Clase</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setPanelActivo('muro');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm transition cursor-pointer ${
            panelActivo === 'muro'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Muro Ubuntu & Moderación</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setPanelActivo('votaciones');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm transition cursor-pointer ${
            panelActivo === 'votaciones'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Vote className="w-4 h-4" />
          <span>Votaciones y Consenso</span>
        </button>
      </div>

      {/* PANEL 1: ACTIVIDADES DE CLASE (Materias e Historia) */}
      {panelActivo === 'actividades' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-heading font-bold text-stone-900">
                Selecciona la Actividad para la Clase
              </h2>
              <p className="text-xs text-stone-500">
                Cuando abras la actividad, la pantalla de todos los estudiantes cambiará simultáneamente.
              </p>
            </div>

            <div className="inline-flex p-1 bg-stone-200/80 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setModuloActivo('materias');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  moduloActivo === 'materias'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Materias Básicas (80 Ejercicios)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setModuloActivo('historia');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  moduloActivo === 'historia'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Compass className="w-4 h-4 text-amber-600" />
                <span>Historia de Venezuela (5 Épocas)</span>
              </button>
            </div>
          </div>

          {/* Subtab 1: Materias Básicas */}
          {moduloActivo === 'materias' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.keys(MATERIAS_CONFIG) as MateriaTipo[]).map((mat) => {
                const cfg = MATERIAS_CONFIG[mat];
                const isSelected = selectedMateria === mat;
                return (
                  <div
                    key={mat}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedMateria(mat);
                    }}
                    className={`relative p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/40 shadow-md ring-2 ring-teal-500/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-2xl mb-3 shadow-xs">
                        {cfg.icono}
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading font-bold text-stone-900 text-base">
                          {cfg.titulo}
                        </h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                          20 Retos
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                        {cfg.descripcion}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-teal-700">
                        Progreso solidario
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playClick();
                          onStartSubject(mat);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition transform active:scale-95 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Abrir a Todos</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Subtab 2: Historia de Venezuela */}
          {moduloActivo === 'historia' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {ETAPAS_HISTORIA.map((etapa) => {
                  const isSelected = selectedEtapa === etapa.id;
                  return (
                    <button
                      key={etapa.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSelectedEtapa(etapa.id);
                        if (etapa.zonas[0]) {
                          setSelectedZona(etapa.zonas[0].id);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/60 shadow-md ring-2 ring-amber-500/20'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{etapa.icono}</div>
                      <div className="font-heading font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                        {etapa.titulo}
                      </div>
                      <div className="text-[11px] text-amber-700 font-medium mt-0.5">
                        {etapa.rango_anos}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
                <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wide">
                      <span>{etapaObj.icono}</span>
                      <span>{etapaObj.rango_anos}</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold text-stone-900 mt-1">
                      {etapaObj.titulo}: {etapaObj.lema}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                      {etapaObj.resumen}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onStartHistory(selectedEtapa, selectedZona);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-sm transition cursor-pointer self-start sm:self-center flex-shrink-0"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Abrir Historia y Editor de Mapas</span>
                  </button>
                </div>

                <div>
                  <h4 className="text-sm font-heading font-bold text-stone-800 mb-3 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>Elige una Zona Geográfica para Construir con la Clase:</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {etapaObj.zonas.map((zona) => {
                      const isSelected = selectedZona === zona.id;
                      return (
                        <div
                          key={zona.id}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedZona(zona.id);
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-amber-600 bg-amber-50/50 shadow-sm ring-2 ring-amber-500/20'
                              : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="px-2 py-0.5 bg-amber-200/70 text-amber-900 text-[10px] font-bold rounded-md">
                                {zona.region}
                              </span>
                              <span className="text-xs text-stone-400 font-mono">
                                {zona.elementos.length} decisiones
                              </span>
                            </div>
                            <h5 className="font-heading font-bold text-stone-900 text-sm">
                              {zona.nombre}
                            </h5>
                            <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                              {zona.mision_colaborativa}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                            <span className="text-[11px] font-medium text-stone-500">
                              {zona.pueblos_o_personajes}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                sounds.playClick();
                                onStartHistory(selectedEtapa, zona.id);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition transform active:scale-95 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Abrir Zona</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PANEL 2: MURO UBUNTU Y MODERACIÓN */}
      {panelActivo === 'muro' && (
        <MuroUbuntu
          salaId={sala.id}
          esMaestra={true}
          estudianteNombre={`Maestra ${sala.maestra_nombre}`}
          avatar="👩‍🏫"
        />
      )}

      {/* PANEL 3: VOTACIONES EN VIVO */}
      {panelActivo === 'votaciones' && (
        <VotacionLive
          salaId={sala.id}
          esMaestra={true}
        />
      )}

      {/* Philosophy Callout Footer */}
      <div className="bg-amber-50/60 rounded-3xl p-5 border border-amber-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🌱</div>
          <div>
            <h4 className="font-heading font-bold text-stone-900 text-sm">
              Pedagogía Ubuntu en el Aula
            </h4>
            <p className="text-xs text-stone-600 max-w-xl">
              Cuando un estudiante responde de forma incorrecta, el sistema no descuenta puntos ni exhibe fallas:
              activa la "Pausa de Reflexión Colectiva" con una pista solidaria para que el salón debata la respuesta en grupo.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onOpenCodex();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>Ver Códice / Memoria de Clase</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Sala, 
  Estudiante, 
  EtapaHistorica, 
  ZonaHistorica, 
  ProgresoHistoria, 
  ElementoZona 
} from '../types/database';
import { ETAPAS_HISTORIA } from '../data/historyData';
import { realtimeManager } from '../lib/realtimeSync';
import { sounds } from '../lib/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowRight, 
  HeartHandshake, 
  Scroll, 
  Lightbulb, 
  ShieldAlert,
  Send,
  Printer,
  Edit3,
  Map as MapIcon,
  Layers
} from 'lucide-react';
import { useMapaBase } from '../hooks/useMapaBase';
import { MapViewer } from './MapViewer';
import { MapEditor } from './MapEditor';

interface HistoryModuleProps {
  sala: Sala;
  rol: 'maestra' | 'estudiante';
  estudianteActual: Estudiante | null;
  estudiantes: Estudiante[];
  progresoActual: ProgresoHistoria | null;
  onFinishHistory: () => void;
  onReturnToLobby: () => void;
  onOpenCodex: () => void;
}

export const HistoryModule: React.FC<HistoryModuleProps> = ({
  sala,
  rol,
  estudianteActual,
  estudiantes,
  progresoActual,
  onFinishHistory,
  onReturnToLobby,
  onOpenCodex
}) => {
  const currentEtapaId = sala.etapa_activa || 'precolombina';
  const currentZonaId = sala.zona_activa || 'andes_timoto';

  const [activeEtapa, setActiveEtapa] = useState<EtapaHistorica>(currentEtapaId);
  const etapaObj = ETAPAS_HISTORIA.find((e) => e.id === activeEtapa) || ETAPAS_HISTORIA[0];

  const [activeZonaId, setActiveZonaId] = useState<string>(currentZonaId);
  const zonaObj: ZonaHistorica = 
    etapaObj.zonas.find((z) => z.id === activeZonaId) || etapaObj.zonas[0];

  // Integración de Mapa Personalizado de la Maestra (Leaflet)
  const { mapaBase, zonas: zonasCustom } = useMapaBase(sala.id, activeEtapa);
  const [editorMapOpen, setEditorMapOpen] = useState(false);
  const [mapViewMode, setMapViewMode] = useState<'custom' | 'vector'>('vector');

  useEffect(() => {
    if (mapaBase?.publicado && mapaBase.imagen_url) {
      setMapViewMode('custom');
    }
  }, [mapaBase?.publicado, mapaBase?.imagen_url]);

  // Group decision state
  const [selectedDecisions, setSelectedDecisions] = useState<Record<string, string>>({
    vivienda: '',
    alimentacion: '',
    trabajo: '',
    organizacion: '',
    creencias_tecnologia: ''
  });

  const [nombreAldeaProyecto, setNombreAldeaProyecto] = useState(
    progresoActual?.datos_json?.nombre_aldea_o_proyecto || 'Aldea de la Fraternidad'
  );
  const [generatedChronicle, setGeneratedChronicle] = useState(
    progresoActual?.datos_json?.cronica_narrada || ''
  );
  const [isSavedToCodex, setIsSavedToCodex] = useState(Boolean(progresoActual?.completado));

  // Sync with remote state
  useEffect(() => {
    if (sala.etapa_activa && sala.etapa_activa !== activeEtapa) {
      setActiveEtapa(sala.etapa_activa);
    }
    if (sala.zona_activa && sala.zona_activa !== activeZonaId) {
      setActiveZonaId(sala.zona_activa);
    }
  }, [sala.etapa_activa, sala.zona_activa]);

  useEffect(() => {
    if (progresoActual?.datos_json) {
      const d = progresoActual.datos_json;
      setSelectedDecisions({
        vivienda: d.vivienda_id || '',
        alimentacion: d.alimentacion_id || '',
        trabajo: d.trabajo_id || '',
        organizacion: d.organizacion_id || '',
        creencias_tecnologia: d.creencias_id || ''
      });
      if (d.nombre_aldea_o_proyecto) setNombreAldeaProyecto(d.nombre_aldea_o_proyecto);
      if (d.cronica_narrada) setGeneratedChronicle(d.cronica_narrada);
      if (progresoActual.completado) setIsSavedToCodex(true);
    }
  }, [progresoActual]);

  const handleSelectElement = (categoria: string, elementoId: string) => {
    sounds.playClick();
    const updated = {
      ...selectedDecisions,
      [categoria]: elementoId
    };
    setSelectedDecisions(updated);

    // Cast vote or update consensus
    if (estudianteActual) {
      realtimeManager.castConsensusVote(elementoId, estudianteActual.nombre);
    }

    if (rol === 'maestra') {
      realtimeManager.updateHistoryDecision(
        activeEtapa,
        zonaObj.nombre,
        {
          ...progresoActual?.datos_json,
          nombre_aldea_o_proyecto: nombreAldeaProyecto,
          vivienda_id: updated.vivienda,
          alimentacion_id: updated.alimentacion,
          trabajo_id: updated.trabajo,
          organizacion_id: updated.organizacion,
          creencias_id: updated.creencias_tecnologia,
          cronica_narrada: generatedChronicle
        },
        false
      );
    }
  };

  // Generate Collective Narrative Chronicle ("Un día en la vida...")
  const handleGenerateChronicle = () => {
    sounds.playSuccessChime();

    let chronicleText = '';

    if (activeEtapa === 'precolombina') {
      chronicleText = `En el corazón de la ${zonaObj.nombre}, los estudiantes de 4to grado fundaron la comunidad "${nombreAldeaProyecto}". Al salir el sol, los pobladores se saludan en asamblea y comparten el primer mate caliente. Las familias trabajan unidas en la construcción y cuidan de sus siembras con el respeto que enseñan los ancianos. Al caer la tarde, niños y adultos se reúnen alrededor del fuego central a escuchar las leyendas sagradas. En esta aldea nadie pasa hambre ni soledad, porque todos comprenden que "Yo soy porque nosotros somos".`;
    } else if (activeEtapa === 'colonial') {
      chronicleText = `Durante los tiempos coloniales en ${zonaObj.nombre}, la clase de 4to grado reflexionó sobre cómo transformar la hacienda en un espacio de dignidad humana. Frente a las injusticias de las castas, los estudiantes acordaron que el trabajo del cacao y de los hatos debía realizarse en hermandad, aboliendo el maltrato y compartiendo los frutos de la tierra con equidad. Los cantos de faena se convirtieron en himnos de libertad y las cofradías tejieron lazos de solidaridad que anunciaron el amanecer de una nueva república.`;
    } else if (activeEtapa === 'independencia') {
      chronicleText = `En plena gesta emancipadora en ${zonaObj.nombre}, el Consejo Patriota de 4to grado tomó decisiones históricas con valentía y desprendimiento. Apoyaron la marcha a través de los caminos más difíciles, organizaron convoyes de provisiones con las familias del pueblo y sellaron el pacto solidario con los pueblos hermanos. La lealtad inquebrantable de héroes como Bolívar, Sucre y Pedro Camejo demostró que no hay ejército invencible cuando un pueblo lucha unido por su libertad.`;
    } else if (activeEtapa === 'federacion') {
      chronicleText = `Durante la etapa de la Federación en ${zonaObj.nombre}, los estudiantes redactaron el Gran Acuerdo de Reconciliación. Celebraron con júbilo el fin definitivo de la esclavitud en 1854 y acordaron abrir escuelas públicas primarias y gratuitas en cada rincón del país. Entendieron que el verdadero progreso no son solo los ferrocarriles o el telégrafo, sino el derecho de cada niño campesino a leer, escribir y vivir en paz con justicia.`;
    } else {
      chronicleText = `Hacia el futuro en ${zonaObj.nombre}, la brigada escolar de 4to grado diseñó soluciones científicas y ecológicas para sanar nuestras aguas, cuidar la selva del Caroní e instalar energía limpia en cada comunidad. Con huertos urbanos y laboratorios de paz, los niños demostraron que el espíritu de Ubuntu es la fuerza más poderosa para construir una Venezuela justa, hermosa y fraterna.`;
    }

    setGeneratedChronicle(chronicleText);

    // Save to room state
    realtimeManager.updateHistoryDecision(
      activeEtapa,
      zonaObj.nombre,
      {
        ...progresoActual?.datos_json,
        nombre_aldea_o_proyecto: nombreAldeaProyecto,
        cronica_narrada: chronicleText
      },
      true
    );

    setIsSavedToCodex(true);
    sounds.playCelebrationFanfare();
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.7 }
    });
  };

  if (editorMapOpen) {
    return (
      <MapEditor
        salaId={sala.id}
        etapa={activeEtapa}
        onClose={() => setEditorMapOpen(false)}
        onMapPublished={() => {
          setEditorMapOpen(false);
          setMapViewMode('custom');
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* 5-Era Interactive Timeline Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            <h2 className="font-heading font-bold text-stone-900 text-sm sm:text-base">
              Línea de Tiempo Histórica de Venezuela
            </h2>
          </div>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            5 Etapas para Construir la Vida Cotidiana
          </span>
        </div>

        {/* Timeline Horizontal Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {ETAPAS_HISTORIA.map((et, index) => {
            const isActive = activeEtapa === et.id;
            return (
              <button
                key={et.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveEtapa(et.id);
                  if (et.zonas[0]) {
                    setActiveZonaId(et.zonas[0].id);
                  }
                  if (rol === 'maestra') {
                    realtimeManager.setFase('historia_activa', {
                      etapa: et.id,
                      zona: et.zonas[0]?.id
                    });
                  }
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'border-amber-600 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">{et.icono}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-white border border-stone-200 text-stone-600">
                    Etapa {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xs text-stone-900 leading-snug">
                    {et.titulo}
                  </h3>
                  <p className="text-[10px] text-amber-800 font-semibold mt-0.5 truncate">
                    {et.rango_anos}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Historical Stage: Venezuela Map & Zone Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map of Venezuela & Selected Zone Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 gap-2">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  Mapa Geográfico de la Época
                </span>
                <h3 className="font-heading font-bold text-stone-900 text-base">
                  Zonas de {etapaObj.titulo}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {rol === 'maestra' && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setEditorMapOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    title="Subir mapa base y trazar polígonos"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editor de Mapa</span>
                  </button>
                )}

                {mapaBase?.publicado && (
                  <div className="inline-flex p-0.5 bg-stone-100 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setMapViewMode('custom');
                      }}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                        mapViewMode === 'custom' ? 'bg-white text-teal-900 shadow-2xs' : 'text-stone-500'
                      }`}
                    >
                      Leaflet ({zonasCustom.length})
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setMapViewMode('vector');
                      }}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                        mapViewMode === 'vector' ? 'bg-white text-teal-900 shadow-2xs' : 'text-stone-500'
                      }`}
                    >
                      Ilustrado
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Vista del Mapa: Leaflet CRS.Simple si está publicado y activo, o SVG Ilustrado */}
            {mapViewMode === 'custom' && mapaBase?.publicado ? (
              <MapViewer
                mapaBase={mapaBase}
                zonas={zonasCustom}
                selectedZonaId={activeZonaId}
                onSelectZona={(z) => {
                  setActiveZonaId(z.id);
                  if (rol === 'maestra') {
                    realtimeManager.setFase('historia_activa', {
                      etapa: activeEtapa,
                      zona: z.id
                    });
                  }
                }}
                className="h-[360px]"
              />
            ) : (
              /* Simplified Artistic Venezuela Map SVG with Clickable Regions */
              <div className="relative bg-gradient-to-br from-cyan-50 via-teal-50/40 to-amber-50/30 rounded-2xl p-4 border border-teal-100 flex items-center justify-center">
                <svg viewBox="0 0 420 340" className="w-full max-w-[360px] h-auto drop-shadow-md">
                  {/* Caribbean Sea waves hint */}
                  <path d="M 40 40 Q 80 35 120 40 T 200 40 T 280 40 T 360 40" fill="none" stroke="#38BDF8" stroke-width="2" stroke-dasharray="6 6" opacity="0.4" />
                  <path d="M 60 65 Q 100 60 140 65 T 220 65 T 300 65" fill="none" stroke="#38BDF8" stroke-width="2" stroke-dasharray="6 6" opacity="0.3" />

                  {/* Venezuela Stylized Territorial Silhouette */}
                  {/* Occidente & Zulia */}
                  <path
                    d="M 50 110 Q 75 70 120 85 Q 110 130 90 150 Q 60 140 50 110 Z"
                    fill={zonaObj.region === 'Occidente' || zonaObj.region === 'Zulia' ? '#F59E0B' : '#6EE7B7'}
                    stroke="#047857"
                    stroke-width="2.5"
                    className="cursor-pointer transition-all hover:opacity-90"
                    onClick={() => {
                      const z = etapaObj.zonas.find((x) => x.region === 'Occidente' || x.region === 'Zulia');
                      if (z) {
                        sounds.playClick();
                        setActiveZonaId(z.id);
                      }
                    }}
                  />
                  <text x="75" y="115" font-size="9" font-weight="bold" fill="#064E3B">Occidente / Zulia</text>

                  {/* Andes Mountain Chain */}
                  <path
                    d="M 70 155 Q 100 160 130 190 Q 110 220 80 200 Q 65 175 70 155 Z"
                    fill={zonaObj.region === 'Andes' ? '#F59E0B' : '#A7F3D0'}
                    stroke="#047857"
                    stroke-width="2.5"
                    className="cursor-pointer transition-all hover:opacity-90"
                    onClick={() => {
                      const z = etapaObj.zonas.find((x) => x.region === 'Andes');
                      if (z) {
                        sounds.playClick();
                        setActiveZonaId(z.id);
                      }
                    }}
                  />
                  <text x="80" y="185" font-size="9" font-weight="bold" fill="#064E3B">Andes</text>

                  {/* Centro & Costa / Caracas */}
                  <path
                    d="M 125 90 Q 210 80 230 125 Q 170 145 125 125 Z"
                    fill={zonaObj.region === 'Centro' || zonaObj.region === 'Costa/Caribe' ? '#F59E0B' : '#34D399'}
                    stroke="#047857"
                    stroke-width="2.5"
                    className="cursor-pointer transition-all hover:opacity-90"
                    onClick={() => {
                      const z = etapaObj.zonas.find((x) => x.region === 'Centro' || x.region === 'Costa/Caribe');
                      if (z) {
                        sounds.playClick();
                        setActiveZonaId(z.id);
                      }
                    }}
                  />
                  <text x="145" y="112" font-size="9" font-weight="bold" fill="#064E3B">Centro / Caracas</text>

                  {/* Oriente & Costa Caribe */}
                  <path
                    d="M 235 95 Q 320 85 350 140 Q 280 160 235 130 Z"
                    fill={zonaObj.region === 'Oriente' || zonaObj.region === 'Costa/Caribe' ? '#F59E0B' : '#6EE7B7'}
                    stroke="#047857"
                    stroke-width="2.5"
                    className="cursor-pointer transition-all hover:opacity-90"
                    onClick={() => {
                      const z = etapaObj.zonas.find((x) => x.region === 'Oriente');
                      if (z) {
                        sounds.playClick();
                        setActiveZonaId(z.id);
                      }
                    }}
                  />
                  <text x="260" y="125" font-size="9" font-weight="bold" fill="#064E3B">Oriente / Cumaná</text>

                  {/* Inmensos Llanos */}
                  <path
                    d="M 115 155 Q 230 145 270 180 Q 220 230 135 210 Z"
                    fill={zonaObj.region === 'Llanos' ? '#F59E0B' : '#FDE68A'}
                    stroke="#B45309"
                    stroke-width="2.5"
                    className="cursor-pointer transition-all hover:opacity-90"
                    onClick={() => {
                      const z = etapaObj.zonas.find((x) => x.region === 'Llanos');
                      if (z) {
                        sounds.playClick();
                        setActiveZonaId(z.id);
                      }
                    }}
                  />
                  <text x="165" y="185" font-size="10" font-weight="bold" fill="#78350F">Llanos</text>

                  {/* Guayana, Amazonas & Río Orinoco */}
                  <path
                    d="M 140 215 Q 275 185 365 210 Q 320 310 200 315 Q 140 265 140 215 Z"
                    fill={zonaObj.region === 'Guayana' ? '#F59E0B' : '#10B981'}
                    stroke="#047857"
                    stroke-width="2.5"
                    className="cursor-pointer transition-all hover:opacity-90"
                    onClick={() => {
                      const z = etapaObj.zonas.find((x) => x.region === 'Guayana');
                      if (z) {
                        sounds.playClick();
                        setActiveZonaId(z.id);
                      }
                    }}
                  />
                  <text x="215" y="260" font-size="11" font-weight="bold" fill="#064E3B">Guayana / Gran Sabana</text>

                  {/* Orinoco River Flow */}
                  <path d="M 135 210 Q 210 180 270 185 Q 330 170 360 160" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round" />
                  <text x="220" y="175" font-size="7" font-weight="bold" fill="#0369A1">Río Orinoco</text>
                </svg>
              </div>
            )}

            {/* List of Available Zones in this Era */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                Zonas Históricas Disponibles:
              </span>
              <div className="space-y-1.5">
                {etapaObj.zonas.map((z) => {
                  const isCur = activeZonaId === z.id;
                  return (
                    <button
                      key={z.id}
                      onClick={() => {
                        sounds.playClick();
                        setActiveZonaId(z.id);
                        if (rol === 'maestra') {
                          realtimeManager.setFase('historia_activa', {
                            etapa: activeEtapa,
                            zona: z.id
                          });
                        }
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isCur
                          ? 'border-amber-600 bg-amber-50/80 font-bold text-amber-950 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${isCur ? 'text-amber-600' : 'text-stone-400'}`} />
                        <span className="text-xs sm:text-sm">{z.nombre}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-600">
                        {z.region}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Historical context callout */}
            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-xs text-amber-900 leading-relaxed">
              <strong>Contexto Histórico:</strong> {zonaObj.descripcion_historica}
            </div>
          </div>
        </div>

        {/* Right Column: Group Construction & Decision Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  {zonaObj.region} • {etapaObj.rango_anos}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {zonaObj.pueblos_o_personajes}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-stone-900">
                {zonaObj.mision_colaborativa}
              </h2>
            </div>

            {/* Group Project or Village Name Input (Facilitator or Consensus) */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                Nombre Colectivo para este Asentamiento / Proyecto:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nombreAldeaProyecto}
                  onChange={(e) => setNombreAldeaProyecto(e.target.value)}
                  placeholder="Ej. Aldea Amalivaca, Hacienda Hermandad, Consejo Patriota..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* 5 Elements for Group Decision (Vivienda, Alimentación, Trabajo, Organización, Creencias/Tecnología) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Construyendo la Vida Cotidiana (Decisiones en Equipo)</span>
                </h3>
                <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full">
                  Ubuntu: Consenso Colectivo
                </span>
              </div>

              <div className="space-y-3">
                {zonaObj.elementos.map((elem) => {
                  const isChosen = selectedDecisions[elem.categoria] === elem.id;
                  const votes = progresoActual?.datos_json?.votos_consenso?.[elem.id] || 0;

                  return (
                    <div
                      key={elem.id}
                      onClick={() => handleSelectElement(elem.categoria, elem.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isChosen
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-2xl shadow-2xs flex-shrink-0">
                          {elem.icono}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                              {elem.categoria.replace('_', ' / ')}
                            </span>
                            {isChosen && (
                              <span className="px-2 py-0.2 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>Seleccionado por el grupo</span>
                              </span>
                            )}
                          </div>
                          <h4 className="font-heading font-bold text-stone-900 text-sm sm:text-base">
                            {elem.titulo}
                          </h4>
                          <p className="text-xs text-stone-600 mt-0.5">
                            {elem.descripcion}
                          </p>
                          <p className="text-[11px] text-teal-800 font-medium mt-1">
                            🌱 <strong>Impacto Solidario:</strong> {elem.impacto_ubuntu}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {votes > 0 && (
                          <span className="px-2 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold">
                            {votes} {votes === 1 ? 'voto' : 'votos'}
                          </span>
                        )}
                        <button
                          type="button"
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            isChosen
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                          }`}
                        >
                          {isChosen ? 'Elegido' : 'Votar este elemento'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ubuntu Ethical Reflection Prompt */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2">
              <div className="flex items-center gap-2 text-teal-900 font-heading font-bold text-xs uppercase tracking-wide">
                <HeartHandshake className="w-4 h-4 text-teal-700" />
                <span>Pregunta de Reflexión Ubuntu para el Salón</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                "{zonaObj.pregunta_reflexion}"
              </p>
            </div>

            {/* Narrative Generation Button */}
            <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-stone-500">
                Al completar las elecciones, genera la memoria histórica colectiva de la clase.
              </p>
              <button
                onClick={handleGenerateChronicle}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-heading font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Scroll className="w-4 h-4" />
                <span>Generar Crónica Colectiva de la Aldea</span>
              </button>
            </div>

            {/* Generated Narrative Chronicle Card */}
            {generatedChronicle && (
              <div className="p-5 rounded-3xl bg-amber-50/80 border-2 border-amber-300 shadow-xs space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 font-heading font-bold text-base">
                    <Scroll className="w-5 h-5 text-amber-700" />
                    <span>Un Día en la Vida de "{nombreAldeaProyecto}"</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Guardado en Códice</span>
                  </span>
                </div>

                <p className="text-sm sm:text-base text-stone-800 font-serif leading-relaxed italic bg-white/70 p-4 rounded-2xl border border-amber-200">
                  "{generatedChronicle}"
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-amber-800 font-medium">
                    Autores: Los estudiantes de 4to Grado y su Maestra
                  </span>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOpenCodex();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Abrir Códice Completo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

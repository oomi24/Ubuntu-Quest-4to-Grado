import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, ImageOverlay, Polygon, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import { MapaBase, ZonaMapa, EtapaHistorica, CoordPunto } from '../types/database';
import { ImageSourceSelector } from './ImageSourceSelector';
import { ZoneEditModal } from './ZoneEditModal';
import { useMapaBase } from '../hooks/useMapaBase';
import { sounds } from '../lib/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  Eye, 
  Layers, 
  MapPin, 
  AlertCircle, 
  Sparkles,
  MoveUp,
  MoveDown,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

interface MapEditorProps {
  salaId: string;
  etapa: EtapaHistorica;
  onClose: () => void;
  onMapPublished?: (mapa: MapaBase) => void;
}

// Subcomponente interno para inicializar Geoman y manejar los eventos de dibujo
interface GeomanDrawerProps {
  height: number;
  width: number;
  onPolygonCreated: (coords: CoordPunto[]) => void;
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
}

function GeomanDrawer({ height, width, onPolygonCreated, isDrawing, setIsDrawing }: GeomanDrawerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map.pm) return;

    // Configuración en español y opciones de Geoman
    map.pm.setLang('es');
    map.pm.setGlobalOptions({
      continueDrawing: false,
      editable: false,
      snappable: true,
      snapDistance: 15
    });

    const handleCreate = (e: any) => {
      if (e.shape === 'Polygon' || e.layer instanceof L.Polygon) {
        const rawLatLngs = e.layer.getLatLngs();
        const pts: L.LatLng[] = Array.isArray(rawLatLngs[0]) ? rawLatLngs[0] : rawLatLngs;

        // Remover la capa temporal que dibujó Geoman, la dibujaremos con React state
        map.removeLayer(e.layer);
        setIsDrawing(false);

        // Convertir coordenadas de CRS.Simple [lat, lng] a píxeles de imagen {x: lng, y: height - lat}
        const coords: CoordPunto[] = pts.map((pt) => ({
          x: Math.round(pt.lng),
          y: Math.round(height - pt.lat)
        }));

        onPolygonCreated(coords);
      }
    };

    map.on('pm:create', handleCreate);

    return () => {
      map.off('pm:create', handleCreate);
    };
  }, [map, height, onPolygonCreated, setIsDrawing]);

  // Activar o desactivar dibujo
  useEffect(() => {
    if (!map.pm) return;

    if (isDrawing) {
      map.pm.enableDraw('Polygon', {
        snappable: true,
        templineStyle: { color: '#0D9488', weight: 2.5 },
        hintlineStyle: { color: '#0D9488', dashArray: [5, 5] },
        pathOptions: { color: '#0D9488', fillColor: '#0D9488', fillOpacity: 0.3 }
      });
    } else {
      map.pm.disableDraw();
    }
  }, [isDrawing, map]);

  return null;
}

// Componente para ajustar límites automáticamente
function MapFitter({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [25, 25] });
  }, [map, bounds]);
  return null;
}

export const MapEditor: React.FC<MapEditorProps> = ({
  salaId,
  etapa,
  onClose,
  onMapPublished
}) => {
  const {
    mapaBase,
    zonas,
    loading,
    saveMapaBase,
    saveZona,
    deleteZona,
    reorderZonas,
    publishMapa
  } = useMapaBase(salaId, etapa);

  // Estados del flujo UX del editor (Paso 1, 2, 3)
  const [step, setStep] = useState<1 | 2 | 3>(mapaBase?.imagen_url ? 3 : 1);
  const [tempImageData, setTempImageData] = useState<{
    url: string;
    width: number;
    height: number;
    name: string;
  } | null>(mapaBase ? {
    url: mapaBase.imagen_url,
    width: mapaBase.imagen_width,
    height: mapaBase.imagen_height,
    name: mapaBase.nombre
  } : null);

  // Estados de dibujo y edición de zonas
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<CoordPunto[]>([]);
  const [editingZona, setEditingZona] = useState<ZonaMapa | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Paso 1: Selección de imagen
  const handleImageSelected = (data: { url: string; width: number; height: number; name: string }) => {
    setTempImageData(data);
    setStep(2); // Avanza a vista previa
  };

  // Paso 2: Confirmar imagen e ir a dibujo
  const handleConfirmImage = async () => {
    if (!tempImageData) return;
    sounds.playSuccessChime();
    await saveMapaBase(
      tempImageData.name,
      tempImageData.url,
      tempImageData.width,
      tempImageData.height
    );
    setStep(3);
  };

  // Callback al terminar de trazar un polígono en Geoman
  const handlePolygonCreated = (coords: CoordPunto[]) => {
    if (coords.length < 3) return;
    sounds.playSuccessChime();
    setPendingCoords(coords);
    setEditingZona(null);
    setZoneModalOpen(true);
  };

  // Guardar datos desde el modal de zona
  const handleSaveZoneFromModal = async (data: { nombre: string; color: string; etapa: EtapaHistorica }) => {
    if (editingZona) {
      await saveZona(data.nombre, data.color, editingZona.coords_json, editingZona.id);
    } else if (pendingCoords.length >= 3) {
      await saveZona(data.nombre, data.color, pendingCoords);
    }
    setZoneModalOpen(false);
    setEditingZona(null);
    setPendingCoords([]);
  };

  // Publicar mapa
  const handlePublish = async () => {
    sounds.playCelebrationFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    const ok = await publishMapa();
    if (ok) {
      setPublishSuccess(true);
      if (mapaBase && onMapPublished) {
        onMapPublished({ ...mapaBase, publicado: true });
      }
      setTimeout(() => setPublishSuccess(false), 3000);
    }
  };

  // Movimiento de orden de zonas
  const handleMoveZone = (index: number, direction: 'up' | 'down') => {
    sounds.playClick();
    const newZonas = [...zonas];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newZonas.length) return;

    const [moved] = newZonas.splice(index, 1);
    newZonas.splice(targetIndex, 0, moved);
    reorderZonas(newZonas);
  };

  const currentWidth = tempImageData?.width || mapaBase?.imagen_width || 1200;
  const currentHeight = tempImageData?.height || mapaBase?.imagen_height || 800;
  const currentBounds: L.LatLngBoundsExpression = [[0, 0], [currentHeight, currentWidth]];

  const convertCoordsToLatLng = (points: CoordPunto[]): [number, number][] => {
    return points.map((p) => [currentHeight - p.y, p.x]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      {/* Barra de Encabezado del Editor */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              if (step === 3 && !mapaBase?.publicado) {
                setStep(2);
              } else if (step === 2) {
                setStep(1);
              } else {
                onClose();
              }
            }}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
            title="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-heading font-bold text-stone-900">
                Editor de Mapas de la Maestra
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold capitalize">
                Etapa: {etapa}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Crea mapas base personalizados y dibuja las zonas interactivas para tu clase.
            </p>
          </div>
        </div>

        {/* Indicador de Pasos */}
        <div className="flex items-center gap-1.5 self-start sm:self-center bg-stone-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setStep(1)}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              step === 1 ? 'bg-white text-teal-800 shadow-2xs' : 'text-stone-500'
            }`}
          >
            1. Imagen
          </button>
          <span className="text-stone-300">›</span>
          <button
            onClick={() => tempImageData && setStep(2)}
            disabled={!tempImageData}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              step === 2 ? 'bg-white text-teal-800 shadow-2xs' : 'text-stone-500 disabled:opacity-40'
            }`}
          >
            2. Vista Previa
          </button>
          <span className="text-stone-300">›</span>
          <button
            onClick={() => tempImageData && setStep(3)}
            disabled={!tempImageData}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              step === 3 ? 'bg-white text-teal-800 shadow-2xs' : 'text-stone-500 disabled:opacity-40'
            }`}
          >
            3. Dibujar Zonas
          </button>
        </div>
      </div>

      {/* PASO 1: Selector de Imagen (Subir archivo o pegar URL) */}
      {step === 1 && (
        <ImageSourceSelector
          salaId={salaId}
          initialUrl={tempImageData?.url || mapaBase?.imagen_url}
          onImageSelected={handleImageSelected}
        />
      )}

      {/* PASO 2: Vista Previa y Confirmación de Dimensiones */}
      {step === 2 && tempImageData && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wide">
                Paso 2 de 3
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-stone-900 mt-2">
                Confirma la Vista Previa del Mapa
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Verifica que el mapa se visualice con nitidez y proporciones correctas.
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setStep(1);
              }}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 underline self-start sm:self-center cursor-pointer"
            >
              Cambiar imagen o URL
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-stone-900 flex items-center justify-center min-h-[360px] max-h-[500px]">
              <img
                src={tempImageData.url}
                alt="Vista previa mapa"
                className="max-h-[500px] w-auto object-contain"
              />
            </div>

            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4">
              <h3 className="font-heading font-bold text-stone-900 text-sm">
                Ficha Técnica de la Imagen
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Nombre:</span>
                  <span className="font-bold text-stone-900 truncate max-w-[160px]">{tempImageData.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Dimensiones Reales:</span>
                  <span className="font-mono font-bold text-teal-800">{tempImageData.width} × {tempImageData.height} px</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-200">
                  <span className="text-stone-500 font-medium">Proyección:</span>
                  <span className="font-semibold text-stone-800">CRS.Simple Cartesiano</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-500 font-medium">Etapa Histórica:</span>
                  <span className="font-bold text-amber-800 capitalize">{etapa}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmImage}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-heading font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <span>Continuar al Dibujo de Zonas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASO 3: Mapa en Pantalla Completa + Dibujo de Polígonos con Geoman */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: Mapa Interactivo con Geoman */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-heading font-bold text-stone-900 text-base flex items-center gap-2">
                  <span>Lienzo Cartográfico</span>
                  <span className="text-xs font-normal text-stone-500">
                    ({zonas.length} {zonas.length === 1 ? 'zona trazada' : 'zonas trazadas'})
                  </span>
                </h3>
                <p className="text-xs text-stone-500">
                  Usa el botón flotante para trazar un polígono sobre el mapa. Haz clic punto por punto y ciérralo haciendo clic en el primer punto.
                </p>
              </div>

              {/* Botón Flotante / Destacado: Dibujar Zona */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsDrawing(!isDrawing);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm shadow-md transition cursor-pointer ${
                  isDrawing
                    ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 animate-pulse'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{isDrawing ? 'Cancelando dibujo...' : '➕ Dibujar Zona con Polígono'}</span>
              </button>
            </div>

            {/* Contenedor del Mapa Leaflet en CRS.Simple */}
            <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 shadow-inner">
              {isDrawing && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-teal-900/90 text-teal-100 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg backdrop-blur-xs flex items-center gap-2 border border-teal-500/40">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  <span>Modo dibujo activo: Haz clic en el mapa para marcar vértices y cierra el polígono.</span>
                </div>
              )}

              <MapContainer
                crs={L.CRS.Simple}
                bounds={currentBounds}
                maxBounds={currentBounds}
                maxBoundsViscosity={0.8}
                minZoom={-2}
                maxZoom={3}
                zoomControl={true}
                attributionControl={false}
                className="w-full h-full"
              >
                <MapFitter bounds={currentBounds} />

                <ImageOverlay
                  url={tempImageData?.url || mapaBase?.imagen_url || ''}
                  bounds={currentBounds}
                />

                <GeomanDrawer
                  height={currentHeight}
                  width={currentWidth}
                  onPolygonCreated={handlePolygonCreated}
                  isDrawing={isDrawing}
                  setIsDrawing={setIsDrawing}
                />

                {/* Polígonos de zonas existentes */}
                {zonas.map((z) => {
                  if (!z.coords_json || z.coords_json.length < 3) return null;
                  const latLngs = convertCoordsToLatLng(z.coords_json);

                  return (
                    <Polygon
                      key={z.id}
                      positions={latLngs}
                      pathOptions={{
                        color: z.color || '#F59E0B',
                        fillColor: z.color || '#F59E0B',
                        fillOpacity: 0.4,
                        weight: 2.5
                      }}
                    >
                      <Tooltip sticky direction="top">
                        <div className="font-sans text-xs font-bold text-stone-900">
                          📍 {z.nombre}
                        </div>
                      </Tooltip>
                    </Polygon>
                  );
                })}
              </MapContainer>
            </div>
          </div>

          {/* Columna Derecha: Panel Lateral con Lista de Zonas y Publicación */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <h3 className="font-heading font-bold text-stone-900 text-sm">
                    Zonas Configuradas ({zonas.length})
                  </h3>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
                >
                  Cambiar mapa
                </button>
              </div>

              {/* Lista de Zonas con Ordenar, Editar y Borrar */}
              {zonas.length === 0 ? (
                <div className="text-center py-8 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500 space-y-2">
                  <div className="text-2xl">✏️</div>
                  <p className="text-xs font-semibold text-stone-700">Aún no has dibujado ninguna zona</p>
                  <p className="text-[11px] text-stone-400">
                    Haz clic en <strong>"➕ Dibujar Zona con Polígono"</strong> para delimitar el primer territorio histórico.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {zonas.map((z, idx) => (
                    <div
                      key={z.id}
                      className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-stone-300 flex items-center justify-between gap-2 transition group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0 border border-black/10 shadow-2xs"
                          style={{ backgroundColor: z.color }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-stone-900 truncate">
                            {z.nombre}
                          </p>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {z.coords_json?.length || 0} puntos
                          </span>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveZone(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                          title="Subir orden"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveZone(idx, 'down')}
                          disabled={idx === zonas.length - 1}
                          className="p-1 rounded text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                          title="Bajar orden"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            sounds.playClick();
                            setEditingZona(z);
                            setZoneModalOpen(true);
                          }}
                          className="p-1 rounded text-teal-600 hover:bg-teal-50 transition cursor-pointer"
                          title="Editar nombre o color"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            sounds.playClick();
                            deleteZona(z.id);
                          }}
                          className="p-1 rounded text-red-500 hover:bg-red-50 transition cursor-pointer"
                          title="Eliminar zona"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Botón de Publicar Mapa */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <button
                  onClick={handlePublish}
                  disabled={zonas.length === 0 || mapaBase?.publicado}
                  className={`w-full py-3 px-4 rounded-xl font-heading font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                    mapaBase?.publicado
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                      : zonas.length === 0
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {mapaBase?.publicado
                      ? '✓ Mapa Publicado para los Estudiantes'
                      : 'Publicar Mapa para la Clase'}
                  </span>
                </button>

                {publishSuccess && (
                  <p className="text-[11px] text-emerald-700 text-center font-bold animate-in fade-in">
                    ¡Mapa publicado! Ahora todos los estudiantes pueden explorarlo en tiempo real.
                  </p>
                )}

                <p className="text-[11px] text-stone-500 text-center leading-relaxed">
                  Al publicar, el mapa interactivo reemplazará el mapa vectorial en la vista de los estudiantes para esta etapa.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para configurar o editar la zona dibujada */}
      <ZoneEditModal
        isOpen={zoneModalOpen}
        onClose={() => {
          setZoneModalOpen(false);
          setEditingZona(null);
          setPendingCoords([]);
        }}
        onSave={handleSaveZoneFromModal}
        initialData={editingZona ? {
          nombre: editingZona.nombre,
          color: editingZona.color,
          etapa: editingZona.etapa
        } : undefined}
        puntosCount={pendingCoords.length || editingZona?.coords_json.length || 0}
      />
    </div>
  );
};

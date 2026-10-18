import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Polygon, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import { MapaBase, ZonaMapa, Estudiante, CoordPunto } from '../types/database';
import { realtimeManager, RoomSyncState } from '../lib/realtimeSync';
import { sounds } from '../lib/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Palette, 
  UserCheck, 
  Users, 
  Sparkles, 
  Check, 
  Clock, 
  MapPin, 
  Info,
  Shield
} from 'lucide-react';
import { ZoneEditModal } from './ZoneEditModal';

interface MapaColaborativoProps {
  salaId: string;
  mapaBase: MapaBase | null;
  zonas: ZonaMapa[];
  estudiantes: Estudiante[];
  estudianteActual: Estudiante | null;
  esMaestra: boolean;
  onSaveZona: (nombre: string, color: string, coords: CoordPunto[], autor?: string) => Promise<void>;
}

function GeomanCollaborativeDrawer({
  height,
  width,
  onPolygonCreated,
  canDraw
}: {
  height: number;
  width: number;
  onPolygonCreated: (coords: CoordPunto[]) => void;
  canDraw: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map.pm) return;
    map.pm.setLang('es');

    const handleCreate = (e: any) => {
      if (e.shape === 'Polygon' || e.layer instanceof L.Polygon) {
        const rawLatLngs = e.layer.getLatLngs();
        const pts: L.LatLng[] = Array.isArray(rawLatLngs[0]) ? rawLatLngs[0] : rawLatLngs;
        map.removeLayer(e.layer);

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
  }, [map, height, onPolygonCreated]);

  useEffect(() => {
    if (!map.pm) return;
    if (canDraw) {
      map.pm.enableDraw('Polygon', {
        snappable: true,
        templineStyle: { color: '#0D9488', weight: 2.5 },
        hintlineStyle: { color: '#0D9488', dashArray: [5, 5] },
        pathOptions: { color: '#0D9488', fillColor: '#0D9488', fillOpacity: 0.3 }
      });
    } else {
      map.pm.disableDraw();
    }
  }, [canDraw, map]);

  return null;
}

function MapBoundsFitter({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [map, bounds]);
  return null;
}

export const MapaColaborativo: React.FC<MapaColaborativoProps> = ({
  salaId,
  mapaBase,
  zonas,
  estudiantes,
  estudianteActual,
  esMaestra,
  onSaveZona
}) => {
  const [turnoDibujo, setTurnoDibujo] = useState<{ estudiante_id: string; estudiante_nombre: string; avatar: string } | null>(null);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<CoordPunto[]>([]);

  useEffect(() => {
    const unsubscribe = realtimeManager.subscribe((state: RoomSyncState) => {
      setTurnoDibujo(state.turnoDibujo);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const esMiTurno = Boolean(
    estudianteActual && turnoDibujo && turnoDibujo.estudiante_id === estudianteActual.id
  );

  const handlePolygonCreated = (coords: CoordPunto[]) => {
    if (coords.length < 3) return;
    sounds.playSuccessChime();
    setPendingCoords(coords);
    setZoneModalOpen(true);
  };

  const handleSaveModal = async (data: { nombre: string; color: string }) => {
    const autor = estudianteActual?.nombre || 'Maestra';
    await onSaveZona(data.nombre, data.color, pendingCoords, autor);
    sounds.playCelebrationFanfare();
    confetti({ particleCount: 70, spread: 50 });
    setZoneModalOpen(false);
    setPendingCoords([]);

    // Liberar turno tras dibujar
    if (esMaestra || esMiTurno) {
      realtimeManager.setTurnoDibujo(null);
    }
  };

  const handleAsignarTurno = (est: Estudiante) => {
    sounds.playClick();
    realtimeManager.setTurnoDibujo({
      estudiante_id: est.id,
      estudiante_nombre: est.nombre,
      avatar: est.avatar,
      inicio_tiempo: new Date().toISOString()
    });
  };

  if (!mapaBase || !mapaBase.imagen_url) {
    return (
      <div className="p-8 text-center bg-stone-100 rounded-3xl border border-stone-200">
        <p className="font-heading font-bold text-stone-700 text-sm">
          Aún no se ha publicado un mapa base para esta etapa.
        </p>
      </div>
    );
  }

  const width = mapaBase.imagen_width || 1200;
  const height = mapaBase.imagen_height || 800;
  const bounds: L.LatLngBoundsExpression = [[0, 0], [height, width]];

  const convertCoordsToLatLng = (points: CoordPunto[]): [number, number][] => {
    return points.map((p) => [height - p.y, p.x]);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
      {/* Cabecera del modo colaborativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xl">
            🗺️
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-stone-900 flex items-center gap-2">
              <span>Construcción Cartográfica por Turnos</span>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                Modo Colaborativo
              </span>
            </h2>
            <p className="text-xs text-stone-500">
              Cada estudiante dibuja un territorio histórico para construir el mapa completo del salón.
            </p>
          </div>
        </div>

        {/* Indicador de turno actual */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
          <Palette className="w-4 h-4 text-amber-600" />
          <span>
            {turnoDibujo
              ? `Turno de dibujo: ${turnoDibujo.avatar} ${turnoDibujo.estudiante_nombre}`
              : 'Esperando asignación de turno por la maestra'}
          </span>
        </div>
      </div>

      {/* Selector de turnos (solo maestra) */}
      {esMaestra && (
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>Asignar turno de dibujo a un estudiante:</span>
            {turnoDibujo && (
              <button
                type="button"
                onClick={() => realtimeManager.setTurnoDibujo(null)}
                className="text-[11px] text-red-600 hover:underline cursor-pointer"
              >
                Liberar turno
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {estudiantes.length === 0 ? (
              <span className="text-xs text-stone-400">No hay estudiantes en la sala aún.</span>
            ) : (
              estudiantes.map((st) => {
                const activo = turnoDibujo?.estudiante_id === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleAsignarTurno(st)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                      activo
                        ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-2xs font-bold'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <span>{st.avatar}</span>
                    <span>{st.nombre}</span>
                    {activo && <span>(Dibujando)</span>}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Aviso si es el turno del alumno */}
      {esMiTurno && (
        <div className="p-3 rounded-2xl bg-teal-50 border border-teal-300 text-xs text-teal-950 font-bold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>¡Es tu turno de dibujar! Haz clic en el mapa para marcar los puntos de tu zona y ciérrala.</span>
        </div>
      )}

      {/* Lienzo Leaflet */}
      <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 shadow-inner">
        <MapContainer
          crs={L.CRS.Simple}
          bounds={bounds}
          maxBounds={bounds}
          maxBoundsViscosity={0.8}
          minZoom={-2}
          maxZoom={3}
          zoomControl={true}
          attributionControl={false}
          className="w-full h-full"
        >
          <MapBoundsFitter bounds={bounds} />

          <ImageOverlay url={mapaBase.imagen_url} bounds={bounds} />

          <GeomanCollaborativeDrawer
            height={height}
            width={width}
            onPolygonCreated={handlePolygonCreated}
            canDraw={esMiTurno || (esMaestra && !turnoDibujo)}
          />

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
                  <div className="font-sans text-xs text-stone-900 font-bold">
                    📍 {z.nombre} {z.autor_nombre && `(Aporte de ${z.autor_nombre})`}
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}
        </MapContainer>
      </div>

      <ZoneEditModal
        isOpen={zoneModalOpen}
        onClose={() => {
          setZoneModalOpen(false);
          setPendingCoords([]);
        }}
        onSave={handleSaveModal}
        puntosCount={pendingCoords.length}
      />
    </div>
  );
};

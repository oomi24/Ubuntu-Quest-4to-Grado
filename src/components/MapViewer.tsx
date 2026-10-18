import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Polygon, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapaBase, ZonaMapa, CoordPunto } from '../types/database';
import { sounds } from '../lib/soundEffects';
import { MapPin, ZoomIn, ZoomOut, RefreshCw, AlertTriangle, Eye } from 'lucide-react';

interface MapViewerProps {
  mapaBase: MapaBase | null;
  zonas: ZonaMapa[];
  selectedZonaId?: string;
  onSelectZona?: (zona: ZonaMapa) => void;
  className?: string;
  interactive?: boolean;
}

// Componente para ajustar la vista al tamaño de la imagen
function MapBoundsFitter({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [map, bounds]);
  return null;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  mapaBase,
  zonas,
  selectedZonaId,
  onSelectZona,
  className = 'h-[450px]',
  interactive = true
}) => {
  const [imageError, setImageError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setImageError(false);
  }, [mapaBase?.imagen_url, retryKey]);

  if (!mapaBase || !mapaBase.imagen_url) {
    return (
      <div className={`w-full ${className} bg-stone-100 rounded-2xl border border-stone-200 flex flex-col items-center justify-center p-6 text-center space-y-2`}>
        <div className="text-3xl">🗺️</div>
        <p className="font-heading font-semibold text-stone-700 text-sm">
          No hay mapa base disponible para esta etapa
        </p>
        <p className="text-xs text-stone-500 max-w-sm">
          La maestra puede abrir el Editor de Mapas para subir una imagen o pegar un enlace de mapa histórico.
        </p>
      </div>
    );
  }

  const width = mapaBase.imagen_width || 1200;
  const height = mapaBase.imagen_height || 800;
  const bounds: L.LatLngBoundsExpression = [[0, 0], [height, width]];

  // Convierte coordenadas de imagen {x, y} a Leaflet CRS.Simple [height - y, x]
  const convertCoordsToLatLng = (points: CoordPunto[]): [number, number][] => {
    return points.map((p) => [height - p.y, p.x]);
  };

  return (
    <div className={`relative w-full ${className} rounded-2xl overflow-hidden border border-stone-200 shadow-inner bg-stone-900 group`}>
      {/* Mensaje de error de carga de imagen */}
      {imageError ? (
        <div className="absolute inset-0 z-20 bg-stone-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
          <p className="font-heading font-bold text-white text-sm">
            No se pudo cargar la imagen del mapa
          </p>
          <p className="text-xs text-stone-300 max-w-sm">
            Es posible que el enlace externo haya cambiado o no tenga permisos públicos.
          </p>
          <button
            onClick={() => setRetryKey((prev) => prev + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reintentar Carga</span>
          </button>
        </div>
      ) : null}

      <MapContainer
        key={`${mapaBase.id}_${retryKey}`}
        crs={L.CRS.Simple}
        bounds={bounds}
        maxBounds={bounds}
        maxBoundsViscosity={0.8}
        minZoom={-2}
        maxZoom={3}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full"
      >
        <MapBoundsFitter bounds={bounds} />

        <ImageOverlay
          url={mapaBase.imagen_url}
          bounds={bounds}
          eventHandlers={{
            error: () => setImageError(true)
          }}
        />

        {/* Polígonos de las Zonas */}
        {zonas.map((zona) => {
          if (!zona.coords_json || zona.coords_json.length < 3) return null;
          const latLngs = convertCoordsToLatLng(zona.coords_json);
          const isSelected = selectedZonaId === zona.id;

          return (
            <Polygon
              key={zona.id}
              positions={latLngs}
              pathOptions={{
                color: isSelected ? '#FFFFFF' : zona.color || '#F59E0B',
                weight: isSelected ? 3.5 : 2.5,
                fillColor: zona.color || '#F59E0B',
                fillOpacity: isSelected ? 0.55 : 0.35,
                dashArray: isSelected ? '4, 4' : undefined
              }}
              eventHandlers={{
                click: () => {
                  if (interactive && onSelectZona) {
                    sounds.playClick();
                    onSelectZona(zona);
                  }
                }
              }}
            >
              <Tooltip sticky direction="top" className="ubuntu-map-tooltip">
                <div className="font-sans text-xs font-bold px-1 py-0.5 text-stone-900">
                  📍 {zona.nombre}
                </div>
              </Tooltip>
            </Polygon>
          );
        })}
      </MapContainer>

      {/* Controles y Leyenda en Esquina */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm flex items-center gap-2 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-stone-800 truncate max-w-[200px]">
          {mapaBase.nombre}
        </span>
        <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded font-mono">
          {zonas.length} {zonas.length === 1 ? 'zona' : 'zonas'}
        </span>
      </div>
    </div>
  );
};

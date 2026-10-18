import { useState, useEffect, useCallback } from 'react';
import { MapaBase, ZonaMapa, EtapaHistorica, CoordPunto } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getCachedMapImageForRoom, cacheMapImageForRoom } from '../lib/storage';

export function useMapaBase(salaId: string, etapa: EtapaHistorica) {
  const [mapaBase, setMapaBase] = useState<MapaBase | null>(null);
  const [zonas, setZonas] = useState<ZonaMapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storageKeyMapa = `ubuntu_mapabase_${salaId}_${etapa}`;
  const storageKeyZonas = `ubuntu_zonas_${salaId}_${etapa}`;

  // Cargar mapa y zonas
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Intentar cargar desde Supabase si está disponible
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: mapData, error: mapErr } = await supabase
          .from('mapas_base')
          .select('*')
          .eq('sala_id', salaId)
          .eq('etapa', etapa)
          .maybeSingle();

        if (mapErr) {
          console.warn('Error fetching mapa_base from Supabase:', mapErr.message);
        }

        if (mapData) {
          setMapaBase(mapData);
          cacheMapImageForRoom(salaId, mapData.imagen_url);

          const { data: zonasData, error: zonasErr } = await supabase
            .from('zonas_mapa')
            .select('*')
            .eq('mapa_base_id', mapData.id)
            .order('orden', { ascending: true });

          if (!zonasErr && zonasData) {
            setZonas(zonasData);
          }
          setLoading(false);
          return;
        }
      } catch (err: unknown) {
        console.warn('Supabase fetch failed, falling back to local cache:', err);
      }
    }

    // 2. Fallback a LocalStorage / Cache local
    try {
      const localMap = localStorage.getItem(storageKeyMapa);
      const localZonas = localStorage.getItem(storageKeyZonas);

      if (localMap) {
        setMapaBase(JSON.parse(localMap));
      } else {
        // Fallback predeterminado con mapa físico de Venezuela
        const cachedImg = getCachedMapImageForRoom(salaId);
        if (cachedImg) {
          setMapaBase({
            id: `map_${salaId}_${etapa}`,
            sala_id: salaId,
            etapa,
            nombre: `Mapa Histórico de ${etapa}`,
            imagen_url: cachedImg,
            imagen_width: 1200,
            imagen_height: 900,
            publicado: false,
            created_at: new Date().toISOString()
          });
        }
      }

      if (localZonas) {
        setZonas(JSON.parse(localZonas));
      }
    } catch {
      // Ignorar error de parsing
    }

    setLoading(false);
  }, [salaId, etapa, storageKeyMapa, storageKeyZonas]);

  useEffect(() => {
    loadData();

    // Suscripción a canal broadcast para sincronización multi-pestaña local
    const bc = typeof window !== 'undefined' && 'BroadcastChannel' in window
      ? new BroadcastChannel('ubuntu_quest_map_sync')
      : null;

    if (bc) {
      bc.onmessage = (event) => {
        if (event.data?.salaId === salaId && event.data?.etapa === etapa) {
          if (event.data.mapaBase) setMapaBase(event.data.mapaBase);
          if (event.data.zonas) setZonas(event.data.zonas);
        }
      };
    }

    return () => {
      bc?.close();
    };
  }, [loadData, salaId, etapa]);

  // Guardar o actualizar mapa base
  const saveMapaBase = async (
    nombre: string,
    imagen_url: string,
    imagen_width: number,
    imagen_height: number
  ): Promise<MapaBase> => {
    const mapaObj: MapaBase = {
      id: mapaBase?.id || `map_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sala_id: salaId,
      etapa,
      nombre,
      imagen_url,
      imagen_width,
      imagen_height,
      publicado: false,
      created_at: mapaBase?.created_at || new Date().toISOString()
    };

    setMapaBase(mapaObj);
    cacheMapImageForRoom(salaId, imagen_url);

    try {
      localStorage.setItem(storageKeyMapa, JSON.stringify(mapaObj));
    } catch {
      // Ignore
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error: upErr } = await supabase
          .from('mapas_base')
          .upsert(mapaObj, { onConflict: 'id' })
          .select()
          .single();

        if (!upErr && data) {
          setMapaBase(data);
          return data;
        }
      } catch (err) {
        console.warn('Error upserting mapa_base to Supabase:', err);
      }
    }

    // Broadcast local update
    try {
      const bc = new BroadcastChannel('ubuntu_quest_map_sync');
      bc.postMessage({ salaId, etapa, mapaBase: mapaObj, zonas });
      bc.close();
    } catch {
      // ignore
    }

    return mapaObj;
  };

  // Agregar o actualizar una zona
  const saveZona = async (
    nombre: string,
    color: string,
    coords: CoordPunto[],
    idToUpdate?: string
  ): Promise<ZonaMapa> => {
    if (!mapaBase) throw new Error('No hay un mapa base seleccionado');

    const nuevaZona: ZonaMapa = {
      id: idToUpdate || `zona_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      mapa_base_id: mapaBase.id,
      sala_id: salaId,
      nombre,
      color,
      coords_json: coords,
      etapa,
      orden: idToUpdate ? (zonas.find((z) => z.id === idToUpdate)?.orden || 0) : zonas.length,
      created_at: new Date().toISOString()
    };

    let updatedZonas: ZonaMapa[];
    if (idToUpdate) {
      updatedZonas = zonas.map((z) => (z.id === idToUpdate ? nuevaZona : z));
    } else {
      updatedZonas = [...zonas, nuevaZona];
    }

    setZonas(updatedZonas);

    try {
      localStorage.setItem(storageKeyZonas, JSON.stringify(updatedZonas));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('zonas_mapa')
          .upsert(nuevaZona, { onConflict: 'id' });
      } catch (err) {
        console.warn('Error saving zona to Supabase:', err);
      }
    }

    // Broadcast
    try {
      const bc = new BroadcastChannel('ubuntu_quest_map_sync');
      bc.postMessage({ salaId, etapa, mapaBase, zonas: updatedZonas });
      bc.close();
    } catch {
      // ignore
    }

    return nuevaZona;
  };

  // Eliminar zona
  const deleteZona = async (zonaId: string) => {
    const updated = zonas.filter((z) => z.id !== zonaId);
    setZonas(updated);

    try {
      localStorage.setItem(storageKeyZonas, JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('zonas_mapa')
          .delete()
          .eq('id', zonaId);
      } catch (err) {
        console.warn('Error deleting zona from Supabase:', err);
      }
    }

    // Broadcast
    try {
      const bc = new BroadcastChannel('ubuntu_quest_map_sync');
      bc.postMessage({ salaId, etapa, mapaBase, zonas: updated });
      bc.close();
    } catch {
      // ignore
    }
  };

  // Reordenar zonas
  const reorderZonas = async (newOrder: ZonaMapa[]) => {
    const ordered = newOrder.map((z, idx) => ({ ...z, orden: idx }));
    setZonas(ordered);

    try {
      localStorage.setItem(storageKeyZonas, JSON.stringify(ordered));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      try {
        for (const z of ordered) {
          await supabase
            .from('zonas_mapa')
            .update({ orden: z.orden })
            .eq('id', z.id);
        }
      } catch (err) {
        console.warn('Error reordering zonas:', err);
      }
    }
  };

  // Publicar mapa (hacer visible para los alumnos)
  const publishMapa = async (): Promise<boolean> => {
    if (!mapaBase || zonas.length === 0) return false;

    const updatedMap: MapaBase = { ...mapaBase, publicado: true };
    setMapaBase(updatedMap);

    try {
      localStorage.setItem(storageKeyMapa, JSON.stringify(updatedMap));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('mapas_base')
          .update({ publicado: true })
          .eq('id', mapaBase.id);
      } catch (err) {
        console.warn('Error publishing map in Supabase:', err);
      }
    }

    // Broadcast
    try {
      const bc = new BroadcastChannel('ubuntu_quest_map_sync');
      bc.postMessage({ salaId, etapa, mapaBase: updatedMap, zonas });
      bc.close();
    } catch {
      // ignore
    }

    return true;
  };

  return {
    mapaBase,
    zonas,
    loading,
    error,
    saveMapaBase,
    saveZona,
    deleteZona,
    reorderZonas,
    publishMapa,
    reload: loadData
  };
}

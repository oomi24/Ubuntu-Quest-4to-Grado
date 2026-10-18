import { supabase, isSupabaseConfigured } from './supabase';

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  url?: string;
  width?: number;
  height?: number;
}

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB
const MAX_DIMENSION = 2500;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Lee dimensiones de un File o Blob usando new Image()
 */
export function getImageDimensions(file: File | Blob): Promise<{ width: number; height: number; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          dataUrl
        });
      };
      img.onerror = () => reject(new Error('No se pudo decodificar el archivo de imagen'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo local'));
    reader.readAsDataURL(file);
  });
}

/**
 * Valida y carga una URL de imagen externa (ImgBB, CDN, Drive público, etc.)
 */
export function validateAndLoadImageUrl(rawUrl: string): Promise<ImageValidationResult> {
  return new Promise((resolve) => {
    const url = rawUrl.trim();

    if (!url) {
      resolve({ valid: false, error: 'Por favor ingresa una URL de imagen' });
      return;
    }

    // Detección de link de página de ImgBB (no directo)
    if (url.includes('imgbb.com/') && !url.includes('i.ibb.co/')) {
      resolve({
        valid: false,
        error: 'Debes usar el enlace directo. En ImgBB haz clic derecho sobre la imagen → Copiar dirección de imagen (debe comenzar con https://i.ibb.co/...)'
      });
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image/')) {
      resolve({ valid: false, error: 'La URL debe comenzar con https:// o ser válida' });
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const timer = setTimeout(() => {
      img.src = '';
      resolve({
        valid: false,
        error: 'Tiempo de espera agotado al cargar la imagen. Verifica tu conexión y que el enlace sea accesible.'
      });
    }, 12000);

    img.onload = () => {
      clearTimeout(timer);
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      if (!width || !height) {
        resolve({ valid: false, error: 'No se pudieron determinar las dimensiones de la imagen' });
        return;
      }

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        resolve({
          valid: false,
          error: `Las dimensiones (${width}×${height}px) superan el máximo permitido de ${MAX_DIMENSION}×${MAX_DIMENSION}px`
        });
        return;
      }

      resolve({
        valid: true,
        url,
        width,
        height
      });
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve({
        valid: false,
        error: 'No se pudo cargar la imagen. Verifica que el link sea público y directo (termina en .jpg, .png o .webp, no una página HTML).'
      });
    };

    img.src = url;
  });
}

/**
 * Valida un archivo antes de subirlo a Supabase Storage
 */
export async function validateMapFile(file: File): Promise<ImageValidationResult> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato no compatible. Solo se permiten imágenes JPG, PNG o WebP.'
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `El archivo pesa ${sizeMb} MB. El tamaño máximo permitido es de 3 MB.`
    };
  }

  try {
    const { width, height } = await getImageDimensions(file);

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      return {
        valid: false,
        error: `Las dimensiones de la imagen (${width}×${height}px) superan el límite de ${MAX_DIMENSION}×${MAX_DIMENSION}px.`
      };
    }

    return {
      valid: true,
      width,
      height
    };
  } catch (err: unknown) {
    return {
      valid: false,
      error: (err as Error).message || 'Error al procesar la imagen'
    };
  }
}

/**
 * Sube una imagen al bucket 'mapas' de Supabase Storage.
 * Si Supabase no está configurado, almacena la imagen en memoria/base64 como fallback local.
 */
export async function uploadMapImage(
  file: File,
  salaId: string
): Promise<{ url: string; width: number; height: number }> {
  const validation = await validateMapFile(file);
  if (!validation.valid || !validation.width || !validation.height) {
    throw new Error(validation.error || 'La imagen no cumple con las restricciones');
  }

  // Si Supabase está conectado, subimos al bucket 'mapas'
  if (isSupabaseConfigured && supabase) {
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${salaId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('mapas')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.warn('Error subiendo a Supabase Storage bucket "mapas":', error.message);
      throw new Error(`Error en Storage: ${error.message}. Asegúrate de haber creado el bucket público 'mapas'.`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('mapas')
      .getPublicUrl(data.path);

    const publicUrl = publicUrlData.publicUrl;

    // Cache local para offline
    cacheMapImageForRoom(salaId, publicUrl);

    return {
      url: publicUrl,
      width: validation.width,
      height: validation.height
    };
  }

  // Fallback para pruebas locales sin backend configurado: Data URL en base64
  const { dataUrl, width, height } = await getImageDimensions(file);
  cacheMapImageForRoom(salaId, dataUrl);

  return {
    url: dataUrl,
    width,
    height
  };
}

export const DEFAULT_IMGBB_API_KEY = '2fb57a84a2f3725356a85e9e99edb1a7';

/**
 * Obtiene la API Key de ImgBB activa (de localStorage o la predeterminada por la maestra)
 */
export function getActiveImgBBApiKey(): string {
  try {
    return localStorage.getItem('ubuntu_imgbb_api_key') || DEFAULT_IMGBB_API_KEY;
  } catch {
    return DEFAULT_IMGBB_API_KEY;
  }
}

export function setActiveImgBBApiKey(key: string) {
  try {
    if (key.trim()) {
      localStorage.setItem('ubuntu_imgbb_api_key', key.trim());
    } else {
      localStorage.removeItem('ubuntu_imgbb_api_key');
    }
  } catch {
    // ignorar en entornos restringidos
  }
}

/**
 * Sube automáticamente una imagen a ImgBB.
 * Intenta primero la API directa de ImgBB con FormData (más rápida y nativa),
 * luego el endpoint proxy del servidor /api/upload-imgbb,
 * y finalmente fallback local con DataURL si no hay conexión a internet.
 */
export async function uploadToImgBB(
  file: File,
  salaId: string,
  mapName?: string,
  customApiKey?: string
): Promise<{ url: string; width: number; height: number }> {
  const validation = await validateMapFile(file);
  if (!validation.valid || !validation.width || !validation.height) {
    throw new Error(validation.error || 'La imagen no cumple con las restricciones');
  }

  const { dataUrl, width, height } = await getImageDimensions(file);
  const apiKey = (customApiKey || getActiveImgBBApiKey()).trim();

  // 1. Intento principal: Subida directa a la API de ImgBB con FormData (soporta CORS nativo)
  try {
    const formData = new FormData();
    formData.append('image', file);
    if (mapName) {
      formData.append('name', mapName);
    }

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.url) {
        const publicUrl = json.data.url; // Enlace directo https://i.ibb.co/...
        cacheMapImageForRoom(salaId, publicUrl);
        return {
          url: publicUrl,
          width: Number(json.data.width) || width,
          height: Number(json.data.height) || height,
        };
      }
    }
  } catch (directErr) {
    console.warn('Subida directa a ImgBB no completó, probando proxy del servidor:', directErr);
  }

  // 2. Intento secundario: Proxy local /api/upload-imgbb
  try {
    const response = await fetch('/api/upload-imgbb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl, name: mapName || file.name }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.url) {
        cacheMapImageForRoom(salaId, data.url);
        return {
          url: data.url,
          width: data.width || width,
          height: data.height || height,
        };
      }
    }
  } catch (proxyErr) {
    console.warn('Proxy /api/upload-imgbb falló o no está disponible:', proxyErr);
  }

  // 3. Fallback de contingencia: Guardar en DataURL base64 para uso local sin internet
  cacheMapImageForRoom(salaId, dataUrl);
  return {
    url: dataUrl,
    width,
    height,
  };
}

/**
 * Cachea la última imagen válida cargada por sala en localStorage para acceso offline rápido
 */
export function cacheMapImageForRoom(salaId: string, url: string) {
  try {
    localStorage.setItem(`ubuntu_map_cache_${salaId}`, url);
  } catch {
    // Si excede cuota de localStorage en DataURL muy grandes, ignorar
  }
}

export function getCachedMapImageForRoom(salaId: string): string | null {
  try {
    return localStorage.getItem(`ubuntu_map_cache_${salaId}`);
  } catch {
    return null;
  }
}

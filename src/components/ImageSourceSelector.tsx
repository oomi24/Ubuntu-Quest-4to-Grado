import React, { useState, useRef } from 'react';
import { 
  uploadMapImage, 
  uploadToImgBB, 
  validateAndLoadImageUrl, 
  getActiveImgBBApiKey, 
  setActiveImgBBApiKey,
  DEFAULT_IMGBB_API_KEY
} from '../lib/storage';
import { sounds } from '../lib/soundEffects';
import { 
  Upload, 
  Link, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  HelpCircle,
  Sparkles,
  ExternalLink,
  Key,
  Cloud,
  Database,
  Check,
  Clipboard,
  Info
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface ImageSourceSelectorProps {
  salaId: string;
  onImageSelected: (data: { url: string; width: number; height: number; name: string }) => void;
  initialUrl?: string;
}

// Mapas educativos predeterminados de Venezuela listos para usar en un clic
const PRESET_MAPS = [
  {
    name: 'Mapa Físico y de Relieve de Venezuela',
    url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1400&q=80',
    width: 1400,
    height: 933,
    tag: 'Físico / Regiones'
  },
  {
    name: 'Cartografía Colonial y Provincias Históricas',
    url: 'https://images.unsplash.com/photo-1524654458049-e36be0721fa2?auto=format&fit=crop&w=1400&q=80',
    width: 1400,
    height: 933,
    tag: 'Colonial 1810'
  }
];

export const ImageSourceSelector: React.FC<ImageSourceSelectorProps> = ({
  salaId,
  onImageSelected,
  initialUrl = ''
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [uploadDestination, setUploadDestination] = useState<'imgbb' | 'supabase'>('imgbb');
  const [imgbbApiKey, setImgbbApiKey] = useState(getActiveImgBBApiKey());
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const [urlInput, setUrlInput] = useState(initialUrl);
  const [mapName, setMapName] = useState('Mapa Histórico de la Clase');
  const [loading, setLoading] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ url: string; width: number; height: number; source?: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guardar clave API de ImgBB personalizada
  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveImgBBApiKey(imgbbApiKey);
    sounds.playSuccessChime();
    setKeySavedMessage(true);
    setTimeout(() => setKeySavedMessage(false), 2500);
  };

  // Manejo de Opción A: Subida de archivo (ImgBB o Supabase Storage)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setLoading(true);
    sounds.playClick();

    try {
      let result: { url: string; width: number; height: number };

      if (uploadDestination === 'imgbb') {
        setUploadingStatus('Subiendo imagen a la nube de ImgBB...');
        result = await uploadToImgBB(file, salaId, mapName, imgbbApiKey);
      } else {
        setUploadingStatus('Subiendo imagen a Supabase Storage (bucket "mapas")...');
        result = await uploadMapImage(file, salaId);
      }

      setSuccessInfo({
        ...result,
        source: uploadDestination === 'imgbb' ? 'ImgBB Nube' : 'Supabase Storage'
      });
      sounds.playSuccessChime();
      onImageSelected({
        url: result.url,
        width: result.width,
        height: result.height,
        name: mapName || file.name.replace(/\.[^/.]+$/, '')
      });
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Error al procesar la imagen seleccionada');
      sounds.playReflectionTone();
    } finally {
      setLoading(false);
      setUploadingStatus('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Manejo de Opción B: Pegar URL externa (ImgBB, Google Drive, etc.)
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!urlInput.trim()) {
      setErrorMsg('Por favor ingresa la URL de la imagen');
      return;
    }

    setLoading(true);
    setUploadingStatus('Comprobando enlace y dimensiones de la imagen...');
    sounds.playClick();

    const result = await validateAndLoadImageUrl(urlInput);

    if (!result.valid || !result.url || !result.width || !result.height) {
      setErrorMsg(result.error || 'No se pudo cargar la imagen desde la URL ingresada');
      sounds.playReflectionTone();
      setLoading(false);
      setUploadingStatus('');
      return;
    }

    const info = {
      url: result.url,
      width: result.width,
      height: result.height,
      source: 'URL Externa'
    };

    setSuccessInfo(info);
    sounds.playSuccessChime();
    onImageSelected({
      url: info.url,
      width: info.width,
      height: info.height,
      name: mapName || 'Mapa Histórico Personalizado'
    });
    setLoading(false);
    setUploadingStatus('');
  };

  const handleSelectPreset = (preset: typeof PRESET_MAPS[0]) => {
    sounds.playClick();
    setUrlInput(preset.url);
    setMapName(preset.name);
    setSuccessInfo({
      url: preset.url,
      width: preset.width,
      height: preset.height,
      source: 'Mapa Prediseñado'
    });
    onImageSelected({
      url: preset.url,
      width: preset.width,
      height: preset.height,
      name: preset.name
    });
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        setUrlInput(text.trim());
        sounds.playClick();
      }
    } catch {
      // Ignorar si el navegador bloquea clipboard
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
      {/* Título de Paso */}
      <div className="border-b border-stone-100 pb-4">
        <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wide">
          Paso 1 de 3
        </span>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-stone-900 mt-2">
          Elige la Imagen del Mapa Base
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          La maestra puede subir una imagen de su dispositivo a la nube (ImgBB o Supabase Storage) o ingresar una URL directa para que toda la clase explore el territorio al unísono.
        </p>
      </div>

      {/* Nombre del Mapa */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
          Nombre o Título del Mapa:
        </label>
        <input
          type="text"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          placeholder="Ej. Mapa de las Zonas Indígenas, Provincias de 1811, Batallas..."
          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 text-stone-900"
        />
      </div>

      {/* Selector de Pestañas A y B */}
      <div className="flex border-b border-stone-200">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab('upload');
            setErrorMsg(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-heading font-bold text-xs sm:text-sm transition cursor-pointer ${
            activeTab === 'upload'
              ? 'border-teal-600 text-teal-800 bg-teal-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Opción A: Subir Archivo (Nube ImgBB / Storage)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab('url');
            setErrorMsg(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-heading font-bold text-xs sm:text-sm transition cursor-pointer ${
            activeTab === 'url'
              ? 'border-teal-600 text-teal-800 bg-teal-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Link className="w-4 h-4" />
          <span>Opción B: Pegar URL Directa</span>
        </button>
      </div>

      {/* Contenido Pestaña A: Subir Archivo */}
      {activeTab === 'upload' && (
        <div className="space-y-5">
          {/* Sub-selector de Destino de Almacenamiento */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-teal-600" />
                <span>Destino de Subida en la Nube:</span>
              </span>

              <button
                type="button"
                onClick={() => setShowKeyConfig(!showKeyConfig)}
                className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <Key className="w-3 h-3" />
                <span>{showKeyConfig ? 'Ocultar API Key' : 'Ver API Key de ImgBB'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {/* Opción ImgBB (Preconfigurada con la clave provista) */}
              <label 
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                  uploadDestination === 'imgbb'
                    ? 'border-teal-500 bg-teal-50/70 shadow-2xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="uploadDestination"
                  checked={uploadDestination === 'imgbb'}
                  onChange={() => {
                    sounds.playClick();
                    setUploadDestination('imgbb');
                  }}
                  className="mt-1 accent-teal-600"
                />
                <div className="text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-900">ImgBB Cloud</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Recomendada
                    </span>
                  </div>
                  <p className="text-stone-500 text-[11px] mt-0.5 leading-snug">
                    Sube y genera un enlace permanente <code className="text-teal-700 font-mono text-[10px]">https://i.ibb.co/...</code> usando la clave API escolar.
                  </p>
                </div>
              </label>

              {/* Opción Supabase Storage */}
              <label 
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                  uploadDestination === 'supabase'
                    ? 'border-teal-500 bg-teal-50/70 shadow-2xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="uploadDestination"
                  checked={uploadDestination === 'supabase'}
                  onChange={() => {
                    sounds.playClick();
                    setUploadDestination('supabase');
                  }}
                  className="mt-1 accent-teal-600"
                />
                <div className="text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-900">Supabase Storage</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {isSupabaseConfigured ? 'Bucket "mapas"' : 'Requiere Setup'}
                    </span>
                  </div>
                  <p className="text-stone-500 text-[11px] mt-0.5 leading-snug">
                    Guarda la imagen en el bucket 'mapas' de tu base de datos Supabase.
                  </p>
                </div>
              </label>
            </div>

            {/* Configuración de API Key de ImgBB expandible */}
            {showKeyConfig && (
              <form onSubmit={handleSaveApiKey} className="pt-2 border-t border-stone-200 mt-2 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700">Clave API de ImgBB:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setImgbbApiKey(DEFAULT_IMGBB_API_KEY);
                      setActiveImgBBApiKey(DEFAULT_IMGBB_API_KEY);
                      sounds.playClick();
                    }}
                    className="text-[10px] text-teal-700 hover:underline"
                  >
                    Restablecer clave inicial
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imgbbApiKey}
                    onChange={(e) => setImgbbApiKey(e.target.value)}
                    placeholder="2fb57a84a2f3725356a85e9e99edb1a7"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Guardar
                  </button>
                </div>
                {keySavedMessage && (
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Clave guardada exitosamente.</span>
                  </p>
                )}
              </form>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
          />

          <div
            onClick={() => !loading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition flex flex-col items-center justify-center space-y-3 group ${
              loading 
                ? 'border-stone-300 bg-stone-50 cursor-wait' 
                : 'border-teal-300 hover:border-teal-500 bg-teal-50/40 hover:bg-teal-50 cursor-pointer'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-teal-700 group-hover:scale-110 transition-transform">
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>

            <div>
              <p className="font-heading font-bold text-stone-900 text-base">
                {loading ? uploadingStatus || 'Subiendo mapa...' : 'Haz clic para seleccionar el mapa de tu computadora'}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Formatos permitidos: JPG, PNG o WebP • Tamaño máximo: 3 MB • Hasta 2500×2500 px
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              className="px-4 py-2 bg-teal-600 group-hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
            >
              {loading ? 'Subiendo...' : 'Examinar Archivos'}
            </button>
          </div>
        </div>
      )}

      {/* Contenido Pestaña B: Pegar URL */}
      {activeTab === 'url' && (
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                URL Directa de la Imagen:
              </label>
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Clipboard className="w-3 h-3" />
                <span>Pegar del portapapeles</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://i.ibb.co/xxxxx/mapa-venezuela.jpg"
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-stone-900 font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-heading font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link className="w-4 h-4" />}
                <span>Usar esta URL</span>
              </button>
            </div>
          </div>

          {/* Ayuda didáctica para ImgBB */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Consejo para ImgBB:</strong> Debes usar el enlace directo que termina en <code className="bg-white px-1 py-0.5 rounded border border-amber-300 font-mono text-[11px]">.jpg</code> o <code className="bg-white px-1 py-0.5 rounded border border-amber-300 font-mono text-[11px]">.png</code> (ejemplo: <span className="font-mono text-teal-800">https://i.ibb.co/.../mapa.jpg</span>).
              En ImgBB, haz clic derecho sobre la imagen subida y elige <em>"Copiar dirección de imagen"</em>.
            </div>
          </div>

          {/* Presets de prueba */}
          <div className="pt-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide block mb-2">
              O selecciona un mapa de demostración listo para clase:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_MAPS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className="p-3 rounded-xl border border-stone-200 hover:border-teal-400 bg-stone-50 hover:bg-teal-50/50 text-left transition flex items-center justify-between cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-xs text-stone-900 truncate">{p.name}</p>
                    <span className="text-[10px] text-teal-700 font-mono">{p.width}×{p.height}px</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-bold">
                    {p.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* Alerta de Error */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {/* Feedback de Éxito y Dimensiones Detectadas */}
      {successInfo && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-emerald-950">¡Imagen verificada y cargada con éxito!</p>
              <p className="text-[11px] text-emerald-700">
                Dimensiones originales: <strong>{successInfo.width} × {successInfo.height} px</strong> • Origen: <strong>{successInfo.source || 'Nube'}</strong>
              </p>
              <p className="text-[10px] font-mono text-emerald-800 truncate max-w-md mt-0.5">
                {successInfo.url}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

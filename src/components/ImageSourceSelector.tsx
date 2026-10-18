import React, { useState, useRef } from 'react';
import { uploadMapImage, validateAndLoadImageUrl } from '../lib/storage';
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
  ExternalLink
} from 'lucide-react';

interface ImageSourceSelectorProps {
  salaId: string;
  onImageSelected: (data: { url: string; width: number; height: number; name: string }) => void;
  initialUrl?: string;
}

// Mapas educativos predeterminados de Venezuela listos para usar en un clic
const PRESET_MAPS = [
  {
    name: 'Mapa Físico y de Regiones de Venezuela',
    url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1400&q=80',
    width: 1400,
    height: 933,
    tag: 'Físico'
  },
  {
    name: 'Cartografía Colonial y Provincias Históricas',
    url: 'https://images.unsplash.com/photo-1524654458049-e36be0721fa2?auto=format&fit=crop&w=1400&q=80',
    width: 1400,
    height: 933,
    tag: 'Histórico'
  }
];

export const ImageSourceSelector: React.FC<ImageSourceSelectorProps> = ({
  salaId,
  onImageSelected,
  initialUrl = ''
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [mapName, setMapName] = useState('Mapa Histórico de la Clase');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ url: string; width: number; height: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejo de Opción A: Subida de archivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setLoading(true);
    sounds.playClick();

    try {
      const result = await uploadMapImage(file, salaId);
      setSuccessInfo(result);
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
    }
  };

  // Manejo de Opción B: Pegar URL externa
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!urlInput.trim()) {
      setErrorMsg('Por favor ingresa la URL de la imagen');
      return;
    }

    setLoading(true);
    sounds.playClick();

    const result = await validateAndLoadImageUrl(urlInput);

    if (!result.valid || !result.url || !result.width || !result.height) {
      setErrorMsg(result.error || 'No se pudo cargar la imagen desde la URL ingresada');
      sounds.playReflectionTone();
      setLoading(false);
      return;
    }

    const info = {
      url: result.url,
      width: result.width,
      height: result.height
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
  };

  const handleSelectPreset = (preset: typeof PRESET_MAPS[0]) => {
    sounds.playClick();
    setUrlInput(preset.url);
    setMapName(preset.name);
    setSuccessInfo({
      url: preset.url,
      width: preset.width,
      height: preset.height
    });
    onImageSelected({
      url: preset.url,
      width: preset.width,
      height: preset.height,
      name: preset.name
    });
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
          La maestra puede subir una imagen de su computadora (JPG/PNG/WebP hasta 3 MB) o pegar un enlace público de ImgBB, Google Drive u otro servidor.
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
          placeholder="Ej. Mapa de las Zonas Indígenas, Provincias de 1811..."
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
          <span>Opción A: Subir Archivo (Recomendada)</span>
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
          <span>Opción B: Pegar URL Externa</span>
        </button>
      </div>

      {/* Contenido Pestaña A: Subir Archivo */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/40 hover:bg-teal-50 rounded-3xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-teal-700 group-hover:scale-110 transition-transform">
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>

            <div>
              <p className="font-heading font-bold text-stone-900 text-base">
                Haz clic para seleccionar el mapa de tu dispositivo
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Formatos permitidos: JPG, PNG o WebP • Tamaño máximo: 3 MB • Hasta 2500×2500 px
              </p>
            </div>

            <button
              type="button"
              className="px-4 py-2 bg-teal-600 group-hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Examinar Archivos
            </button>
          </div>
        </div>
      )}

      {/* Contenido Pestaña B: Pegar URL */}
      {activeTab === 'url' && (
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
              URL Directa de la Imagen:
            </label>
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
              En ImgBB, haz clic derecho sobre la imagen ya subida y selecciona <em>"Copiar dirección de imagen"</em>.
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
                Dimensiones originales: <strong>{successInfo.width} × {successInfo.height} px</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

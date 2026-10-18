import React, { useState } from 'react';
import { EtapaHistorica } from '../types/database';
import { ETAPAS_HISTORIA } from '../data/historyData';
import { sounds } from '../lib/soundEffects';
import { X, Check, Palette, Tag, MapPin, Sparkles } from 'lucide-react';

interface ZoneEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { nombre: string; color: string; etapa: EtapaHistorica }) => void;
  initialData?: {
    nombre: string;
    color: string;
    etapa: EtapaHistorica;
  };
  puntosCount?: number;
}

const PALETA_COLORES = [
  { hex: '#F59E0B', label: 'Ámbar Sabana' },
  { hex: '#10B981', label: 'Esmeralda Selva' },
  { hex: '#0284C7', label: 'Azul Orinoco' },
  { hex: '#8B5CF6', label: 'Púrpura Tepuy' },
  { hex: '#EF4444', label: 'Rojo Guacamaya' },
  { hex: '#EC4899', label: 'Rosa Orquídea' },
  { hex: '#14B8A6', label: 'Turquesa Caribe' },
  { hex: '#84CC16', label: 'Lima Cañaveral' }
];

export const ZoneEditModal: React.FC<ZoneEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  puntosCount = 0
}) => {
  const [nombre, setNombre] = useState(initialData?.nombre || '');
  const [color, setColor] = useState(initialData?.color || PALETA_COLORES[0].hex);
  const [etapa, setEtapa] = useState<EtapaHistorica>(initialData?.etapa || 'precolombina');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorMsg('Por favor ingresa un nombre para la zona');
      return;
    }
    sounds.playSuccessChime();
    onSave({
      nombre: nombre.trim(),
      color,
      etapa
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95">
        <div className="flex items-start justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: color }}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-stone-900 text-lg">
                {initialData ? 'Editar Zona Histórica' : 'Configurar Nueva Zona'}
              </h3>
              <p className="text-xs text-stone-500">
                Polígono cerrado con {puntosCount} vértices registrados
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
              Nombre de la Zona:
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Ej. Territorio Timoto-cuica, Hatos de Apure..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 text-stone-900"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-stone-500" />
              <span>Color Distintivo del Polígono:</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PALETA_COLORES.map((c) => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => {
                    sounds.playClick();
                    setColor(c.hex);
                  }}
                  className={`p-2 rounded-xl border-2 text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                    color === c.hex
                      ? 'border-stone-900 scale-105 shadow-sm'
                      : 'border-transparent hover:border-stone-300'
                  }`}
                  style={{ backgroundColor: `${c.hex}15` }}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[10px] font-semibold text-stone-700 truncate w-full">
                    {c.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-stone-500" />
              <span>Etapa Histórica Relacionada:</span>
            </label>
            <select
              value={etapa}
              onChange={(e) => setEtapa(e.target.value as EtapaHistorica)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 text-stone-900 bg-white"
            >
              {ETAPAS_HISTORIA.map((et) => (
                <option key={et.id} value={et.id}>
                  {et.icono} {et.titulo} ({et.rango_anos})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-heading font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Zona</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { Sala, CuentoColaborativo, Estudiante } from '../types/database';
import { sounds } from '../lib/soundEffects';
import { BookOpen, X, Printer, Sparkles, Heart, Award, Calendar, Users } from 'lucide-react';

interface ClassCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  sala: Sala | null;
  estudiantes: Estudiante[];
  cuentoColaborativo: CuentoColaborativo | null;
}

export const ClassCodexModal: React.FC<ClassCodexModalProps> = ({
  isOpen,
  onClose,
  sala,
  estudiantes,
  cuentoColaborativo
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const fragments = cuentoColaborativo?.fragmentos_json || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-stone-200 p-6 sm:p-8 max-h-[90vh] flex flex-col my-auto animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-2xl shadow-xs">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-stone-900">
                  Códice Digital de 4to Grado
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
                  Memoria Colectiva
                </span>
              </div>
              <p className="text-xs text-stone-500">
                La historia y los saberes construidos juntos en la sala {sala?.codigo || 'UBUNTU-4A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition cursor-pointer"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span>Imprimir Códice</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 p-1 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 print:overflow-visible">
          {/* Certificate of Collective Achievement */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50/50 to-teal-50/40 border-2 border-amber-300 text-center space-y-3 relative overflow-hidden shadow-xs">
            <div className="text-3xl">🏅</div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-white/80 px-3 py-1 rounded-full border border-amber-200 inline-block">
              Certificado Colectivo de Sabiduría
            </span>
            <h3 className="text-xl font-heading font-bold text-stone-900">
              Círculo de Saberes Ubuntu de 4to Grado
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
              Se certifica que el grupo de estudiantes liderado por la Maestra <strong>{sala?.maestra_nombre || 'Facilitadora'}</strong> ha trabajado con armonía, respeto y solidaridad, demostrando que:
            </p>
            <p className="font-serif italic text-base sm:text-lg text-teal-900 font-bold">
              "Una persona es persona a través de las demás personas."
            </p>

            {/* List of Authors / Students */}
            <div className="pt-3 border-t border-amber-200/80">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block mb-2">
                Guardianes y Autores del Grupo ({estudiantes.length}):
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {estudiantes.length === 0 ? (
                  <span className="text-xs text-stone-400 italic">Toda la clase de 4to grado</span>
                ) : (
                  estudiantes.map((st) => (
                    <span
                      key={st.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs font-semibold text-stone-800 shadow-2xs"
                    >
                      <span>{st.avatar}</span>
                      <span>{st.nombre}</span>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Chronicles & Stories Created */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-stone-900 text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Crónicas Históricas Creadas por la Clase</span>
            </h4>

            {fragments.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500 space-y-2">
                <div className="text-2xl">📖</div>
                <p className="text-xs sm:text-sm font-medium">
                  Aún no se han generado crónicas en la sala.
                </p>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  Entra al <strong>Módulo de Historia de Venezuela</strong>, elige una zona y pulsa <strong>"Generar Crónica Colectiva de la Aldea"</strong> para guardarla aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {fragments.map((frag, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="font-bold text-teal-800">{frag.autor}</span>
                      <span>{frag.timestamp}</span>
                    </div>
                    <p className="text-sm font-serif italic text-stone-800 leading-relaxed">
                      "{frag.texto}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
          <p className="text-[11px] text-stone-400">
            Ubuntu Quest 4to Grado • Desarrollado para escuelas venezolanas
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-heading font-bold text-xs transition cursor-pointer"
          >
            Cerrar Códice
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Sala, Estudiante } from '../types/database';
import { sounds } from '../lib/soundEffects';
import { Users, Sparkles, Heart, ArrowRight, ShieldCheck, Compass, Lightbulb, MessageSquare } from 'lucide-react';
import { PresenciaLive } from './PresenciaLive';
import { MuroUbuntu } from './MuroUbuntu';

interface StudentLobbyProps {
  sala: Sala | null;
  estudiante: Estudiante | null;
  estudiantesEnSala: Estudiante[];
  onJoin: (nombre: string, avatar: string, codigo: string) => void;
  defaultCode?: string;
}

const AVATARES = [
  { id: 'turpial', emoji: '🦜', nombre: 'Turpial' },
  { id: 'chiguire', emoji: '🐾', nombre: 'Chigüire' },
  { id: 'orquidea', emoji: '🌸', nombre: 'Orquídea' },
  { id: 'jaguar', emoji: '🐆', nombre: 'Jaguar' },
  { id: 'colibri', emoji: '🕊️', nombre: 'Colibrí' },
  { id: 'tonina', emoji: '🐬', nombre: 'Tonina' },
  { id: 'araguaney', emoji: '🌳', nombre: 'Araguaney' },
  { id: 'tortuga', emoji: '🐢', nombre: 'Tortuga Arrau' }
];

export const StudentLobby: React.FC<StudentLobbyProps> = ({
  sala,
  estudiante,
  estudiantesEnSala,
  onJoin,
  defaultCode = ''
}) => {
  const [nombre, setNombre] = useState('');
  const [avatar, setAvatar] = useState(AVATARES[0].emoji);
  const [codigo, setCodigo] = useState(defaultCode || sala?.codigo || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [subTab, setSubTab] = useState<'espera' | 'muro'>('espera');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorMsg('Por favor escribe tu nombre');
      return;
    }
    if (!codigo.trim()) {
      setErrorMsg('Ingresa el código que dio tu maestra');
      return;
    }
    setErrorMsg('');
    sounds.playSuccessChime();
    onJoin(nombre.trim(), avatar, codigo.trim());
  };

  // Si el estudiante ya está en la sala, mostrar sala de espera con Presencia y Muro
  if (estudiante && sala) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-block p-4 rounded-3xl bg-teal-100 text-teal-800 text-4xl shadow-md animate-bounce">
            {estudiante.avatar}
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">
            ¡Hola, {estudiante.nombre}!
          </h1>
          <p className="text-stone-600 text-sm max-w-md mx-auto">
            Ya estás dentro de la sala <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">{sala.codigo}</span> con la Maestra <strong>{sala.maestra_nombre}</strong>.
          </p>
        </div>

        {/* Presencia en Vivo */}
        <PresenciaLive
          salaId={sala.id}
          estudianteId={estudiante.id}
          compact={false}
        />

        {/* Selector de Pestañas de Estudiante */}
        <div className="flex border-b border-stone-200 bg-white rounded-2xl p-1 shadow-xs">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setSubTab('espera');
            }}
            className={`flex-1 py-2 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === 'espera'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Sala de Espera Ubuntu</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setSubTab('muro');
            }}
            className={`flex-1 py-2 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === 'muro'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Muro Comunitario</span>
          </button>
        </div>

        {subTab === 'espera' ? (
          <div className="space-y-4">
            {/* Waiting card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-teal-300 shadow-sm text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-teal-700 font-semibold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                <span>Esperando a que la maestra abra la actividad para todos...</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-left">
                <div className="flex items-center gap-2 text-amber-900 font-heading font-bold text-xs uppercase tracking-wide mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>¿Sabías qué? (Sabiduría Ubuntu)</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  "Ubuntu" es una palabra que nos enseña que una persona se hace persona a través de las demás personas.
                  En nuestro juego de 4to grado, cada respuesta y cada decisión ayuda a que todo el grupo avance y aprenda junto.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <MuroUbuntu
            salaId={sala.id}
            estudianteId={estudiante.id}
            estudianteNombre={estudiante.nombre}
            avatar={estudiante.avatar}
          />
        )}
      </div>
    );
  }

  // Initial Join Form
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center text-3xl mx-auto shadow-md shadow-teal-500/20">
            🎒
          </div>
          <h1 className="text-2xl font-heading font-bold text-stone-900 tracking-tight">
            Únete al Aula Ubuntu
          </h1>
          <p className="text-xs text-stone-500">
            Ingresa tu nombre y el código que te dio tu maestra para jugar con tus compañeros
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Tu Nombre o Apodo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Sofía, Santiago, Gabriela..."
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-stone-900 font-medium placeholder-stone-400 text-sm"
              maxLength={25}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Elige tu Guardián de la Naturaleza
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATARES.map((av) => (
                <button
                  type="button"
                  key={av.id}
                  onClick={() => {
                    sounds.playClick();
                    setAvatar(av.emoji);
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                    avatar === av.emoji
                      ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/30'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                  }`}
                >
                  <span className="text-2xl">{av.emoji}</span>
                  <span className="text-[10px] font-medium text-stone-600 truncate max-w-full">
                    {av.nombre}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Código de la Sala (de la Maestra)
            </label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="Ej. UB-4A9X"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono font-bold tracking-widest text-center text-stone-900 uppercase text-base"
              maxLength={10}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-heading font-bold text-sm shadow-md shadow-teal-600/20 transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Entrar al Círculo de Aprendizaje</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

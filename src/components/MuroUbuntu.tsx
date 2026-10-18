import React, { useState } from 'react';
import { useMuroUbuntu } from '../hooks/useMuroUbuntu';
import { ReaccionesBar } from './ReaccionesBar';
import { TipoMensajeMuro } from '../types/database';
import { sounds } from '../lib/soundEffects';
import { 
  MessageSquare, 
  Lightbulb, 
  HelpCircle, 
  Award, 
  Send, 
  Shield, 
  Eye, 
  EyeOff, 
  Trash2, 
  Clock, 
  AlertCircle,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Filter
} from 'lucide-react';

interface MuroUbuntuProps {
  salaId: string;
  estudianteId?: string;
  estudianteNombre?: string;
  avatar?: string;
  esMaestra?: boolean;
  etapaOMateria?: string;
}

const TIPOS_CONFIG: Record<TipoMensajeMuro, { label: string; icon: string; bg: string; text: string }> = {
  mensaje: { label: 'Mensaje', icon: '💬', bg: 'bg-teal-50', text: 'text-teal-800' },
  idea: { label: 'Idea', icon: '💡', bg: 'bg-amber-50', text: 'text-amber-800' },
  pregunta: { label: 'Pregunta', icon: '❓', bg: 'bg-sky-50', text: 'text-sky-800' },
  logro: { label: 'Logro de Equipo', icon: '🎉', bg: 'bg-emerald-50', text: 'text-emerald-800' }
};

export const MuroUbuntu: React.FC<MuroUbuntuProps> = ({
  salaId,
  estudianteId,
  estudianteNombre,
  avatar,
  esMaestra = false,
  etapaOMateria
}) => {
  const {
    mensajes,
    todosLosMensajes,
    chatLibreHabilitado,
    segundosRestantes,
    errorFiltro,
    limpiarError,
    publicarMensaje,
    alternarVisibilidad,
    eliminarMensaje,
    alternarChatLibre
  } = useMuroUbuntu(salaId, estudianteId, estudianteNombre, avatar, esMaestra);

  const [contenido, setContenido] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoMensajeMuro>('idea');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contenido.trim()) return;

    sounds.playClick();
    const ok = publicarMensaje(contenido, tipoSeleccionado, etapaOMateria);
    if (ok) {
      setContenido('');
      sounds.playSuccessChime();
    } else {
      sounds.playReflectionTone();
    }
  };

  const listaMensajes = esMaestra ? todosLosMensajes : mensajes;
  const mensajesFiltrados = filtroTipo === 'todos'
    ? listaMensajes
    : listaMensajes.filter((m) => m.tipo === filtroTipo);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-5">
      {/* Cabecera del Muro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xl">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-heading font-bold text-stone-900">
                Muro Comunitario Ubuntu
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
                {listaMensajes.length} {listaMensajes.length === 1 ? 'aporte' : 'aportes'}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Espacio fraterno para compartir ideas, resolver dudas y celebrar los logros del salón.
            </p>
          </div>
        </div>

        {/* Panel de Moderación para la Maestra */}
        {esMaestra && (
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl border border-stone-200 text-xs">
            <Shield className="w-4 h-4 text-teal-700 ml-1" />
            <span className="font-semibold text-stone-700">Chat libre:</span>
            <button
              type="button"
              onClick={() => alternarChatLibre(!chatLibreHabilitado)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                chatLibreHabilitado
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-stone-200 text-stone-600'
              }`}
              title="Si está apagado, los estudiantes solo pueden publicar Ideas, Preguntas y Logros"
            >
              {chatLibreHabilitado ? 'Activado' : 'Solo Aportes Temáticos'}
            </button>
          </div>
        )}
      </div>

      {/* Formulario de Publicación */}
      <form onSubmit={handleSubmit} className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200 space-y-3">
        {/* Selector de tipo de mensaje */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['idea', 'pregunta', 'logro', ...(chatLibreHabilitado || esMaestra ? ['mensaje'] : [])] as TipoMensajeMuro[]).map((t) => {
            const conf = TIPOS_CONFIG[t];
            const isSelected = tipoSeleccionado === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setTipoSeleccionado(t);
                  limpiarError();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-700 shadow-2xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <span>{conf.icon}</span>
                <span>{conf.label}</span>
              </button>
            );
          })}
        </div>

        {/* Campo de texto con límite de 140 caracteres */}
        <div className="relative">
          <textarea
            value={contenido}
            onChange={(e) => {
              setContenido(e.target.value.slice(0, 140));
              if (errorFiltro) limpiarError();
            }}
            placeholder={
              tipoSeleccionado === 'idea'
                ? 'Comparte una idea constructiva para el equipo...'
                : tipoSeleccionado === 'pregunta'
                ? '¿Qué duda tienes sobre la actividad para que tus compañeros o la maestra te ayuden?'
                : tipoSeleccionado === 'logro'
                ? '¡Celebra un avance del salón o una meta alcanzada!'
                : 'Escribe un mensaje positivo para la clase...'
            }
            rows={2}
            className="w-full p-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white placeholder-stone-400 font-medium resize-none"
            disabled={!esMaestra && segundosRestantes > 0}
          />
          <span className="absolute bottom-2.5 right-3 text-[10px] text-stone-400 font-mono">
            {contenido.length}/140
          </span>
        </div>

        {/* Aviso de error o filtro */}
        {errorFiltro && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-snug">{errorFiltro}</p>
          </div>
        )}

        {/* Botón de Enviar con contador de cooldown */}
        <div className="flex items-center justify-between">
          <div className="text-[11px] text-stone-500 flex items-center gap-1">
            {!esMaestra && segundosRestantes > 0 ? (
              <span className="text-amber-700 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Pausa fraterna: {segundosRestantes}s para volver a aportar</span>
              </span>
            ) : (
              <span>✨ Respeta y cuida a tus compañeros en cada palabra</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!contenido.trim() || (!esMaestra && segundosRestantes > 0)}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-heading font-bold shadow-xs transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publicar Aporte</span>
          </button>
        </div>
      </form>

      {/* Filtros de Mensajes */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-2 text-xs">
        <span className="font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span>Aportes de la Clase</span>
        </span>

        <div className="flex gap-1">
          {['todos', 'idea', 'pregunta', 'logro'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                sounds.playClick();
                setFiltroTipo(f);
              }}
              className={`px-2.5 py-1 rounded-lg capitalize transition cursor-pointer ${
                filtroTipo === f
                  ? 'bg-stone-900 text-white font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Mensajes del Muro */}
      {mensajesFiltrados.length === 0 ? (
        <div className="text-center py-8 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-500 space-y-1">
          <div className="text-2xl">🤝</div>
          <p className="font-heading font-semibold text-xs text-stone-700">El Muro está esperando las voces del salón</p>
          <p className="text-[11px] text-stone-400">Sé el primero en compartir una idea constructiva o pregunta.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {mensajesFiltrados.map((msg) => {
            const conf = TIPOS_CONFIG[msg.tipo] || TIPOS_CONFIG.mensaje;
            const isAuthor = msg.estudiante_id === estudianteId;

            return (
              <div
                key={msg.id}
                className={`p-3.5 rounded-2xl border transition space-y-2 ${
                  !msg.aprobado
                    ? 'bg-red-50/60 border-red-200 opacity-60'
                    : 'bg-stone-50/50 hover:bg-stone-50 border-stone-200'
                }`}
              >
                {/* Cabecera del mensaje */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{msg.avatar || '🦜'}</span>
                    <span className="font-heading font-bold text-xs text-stone-900">
                      {msg.estudiante_nombre}
                    </span>
                    {isAuthor && (
                      <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-semibold">
                        Tú
                      </span>
                    )}
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${conf.bg} ${conf.text}`}>
                      {conf.icon} {conf.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
                    <span>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Botones de Moderación de la Maestra */}
                    {esMaestra && (
                      <div className="flex items-center gap-1 pl-1 border-l border-stone-200">
                        <button
                          type="button"
                          onClick={() => alternarVisibilidad(msg.id, !msg.aprobado)}
                          className={`p-1 rounded cursor-pointer ${
                            msg.aprobado ? 'text-stone-400 hover:text-amber-700' : 'text-amber-600 font-bold'
                          }`}
                          title={msg.aprobado ? 'Ocultar a los alumnos' : 'Mostrar a los alumnos'}
                        >
                          {msg.aprobado ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => eliminarMensaje(msg.id)}
                          className="p-1 rounded text-stone-400 hover:text-red-600 cursor-pointer"
                          title="Eliminar definitivamente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contenido del mensaje */}
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed break-words font-medium">
                  {msg.contenido}
                </p>

                {/* Reacciones de compañeros */}
                <div className="pt-1 border-t border-stone-100">
                  <ReaccionesBar
                    objetivoTipo="muro_ubuntu"
                    objetivoId={msg.id}
                    estudianteId={estudianteId}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

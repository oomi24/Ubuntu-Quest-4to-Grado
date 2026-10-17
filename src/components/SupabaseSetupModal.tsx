import React, { useState } from 'react';
import { isSupabaseConfigured, getSupabaseConfig } from '../lib/supabase';
import { sounds } from '../lib/soundEffects';
import { Database, Check, Copy, ExternalLink, X, Terminal, Server, Shield, Sparkles } from 'lucide-react';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const config = getSupabaseConfig();

  if (!isOpen) return null;

  const sqlSample = `-- Ejecuta este script en Supabase SQL Editor para crear las tablas y Realtime:
-- Archivo completo en: /supabase/schema.sql

CREATE TYPE fase_sala_enum AS ENUM ('espera', 'ejercicios_activos', 'historia_activa', 'celebracion', 'pausa');
CREATE TABLE salas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(10) UNIQUE NOT NULL,
  maestra_nombre VARCHAR(100) NOT NULL,
  fase_actual fase_sala_enum DEFAULT 'espera',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE estudiantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sala_id UUID REFERENCES salas(id) ON DELETE CASCADE,
  nombre VARCHAR(80) NOT NULL,
  avatar VARCHAR(50) DEFAULT 'turpial',
  conectado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Habilita Realtime en Supabase:
ALTER PUBLICATION supabase_realtime ADD TABLE salas, estudiantes;`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSample);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-stone-200 p-6 sm:p-8 max-h-[90vh] flex flex-col my-auto animate-in zoom-in-95">
        <div className="flex items-start justify-between border-b border-stone-200 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shadow-xs">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-heading font-bold text-stone-900">
                  Arquitectura Supabase & Despliegue Vercel
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  config.isReady 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {config.isReady ? 'Supabase Conectado' : 'Modo Local / Broadcast Activo'}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Sincronización en tiempo real sin recargar página
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm text-stone-600">
          {/* Connection Status Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h3 className="font-heading font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>Estado del Motor de Sincronización</span>
            </h3>
            {config.isReady ? (
              <p className="text-emerald-700 font-medium">
                ✅ Conectado al proyecto Supabase en: <code className="bg-white px-1.5 py-0.5 rounded border">{config.url}</code>
              </p>
            ) : (
              <p className="text-stone-600">
                🚀 <strong>Motor Dual Activo:</strong> La app incluye un bus en tiempo real con <strong>BroadcastChannel + LocalStorage Sync</strong>, lo que permite que una pestaña de Maestra y una o más pestañas de Estudiantes se sincronicen al instante en este navegador sin necesidad de claves externas. Para conectar tu base de datos de producción en Supabase, sigue los pasos a continuación:
              </p>
            )}
          </div>

          {/* Steps to deploy on Supabase + Vercel */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-stone-900 text-sm">
              Pasos para Desplegar en Vercel con Supabase:
            </h3>

            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/60 border border-teal-100">
                <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-900 flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
                <div>
                  <p className="font-bold text-teal-950 text-xs">Crear proyecto en Supabase</p>
                  <p className="text-stone-600 text-xs mt-0.5">
                    Entra a <strong>supabase.com</strong>, crea un nuevo proyecto PostgreSQL gratuito y abre la pestaña <strong>SQL Editor</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/60 border border-teal-100">
                <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-900 flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
                <div>
                  <p className="font-bold text-teal-950 text-xs">Ejecutar el esquema SQL</p>
                  <p className="text-stone-600 text-xs mt-0.5">
                    Pega el contenido del archivo <code className="font-mono bg-white px-1 rounded border">/supabase/schema.sql</code> que ya hemos preparado con tablas, RLS y canales de Realtime.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/60 border border-teal-100">
                <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-900 flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
                <div>
                  <p className="font-bold text-teal-950 text-xs">Configurar variables y desplegar en Vercel</p>
                  <p className="text-stone-600 text-xs mt-0.5">
                    Ejecuta <code className="font-mono bg-stone-200 px-1 py-0.5 rounded text-[11px]">vercel deploy</code> y agrega en tu proyecto de Vercel:
                  </p>
                  <pre className="mt-1 bg-stone-900 text-emerald-400 p-2 rounded-lg font-mono text-[11px] overflow-x-auto">
VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"&#10;VITE_SUPABASE_ANON_KEY="tu-anon-key"
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Quick SQL preview with copy button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                Fragmento SQL de Creación de Tablas:
              </span>
              <button
                onClick={copySql}
                className="flex items-center gap-1 text-xs text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>
            <pre className="bg-stone-900 text-stone-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-36">
              {sqlSample}
            </pre>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-heading font-bold text-xs transition cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

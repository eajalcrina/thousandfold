"use client";

import { useState } from "react";
import {
  COUNTRY_CODES, COUNTRIES, REVENUE_RANGES, MARKET_SCOPES,
} from "@/lib/rizoma-data";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phone: string;
  brandCountry: string;
  brandName: string;
  brandOffering: string;
  brandLink: string;
  revenueRange: string;
  marketScope: string;
}

interface Props {
  onSubmit: (data: UserData) => Promise<void>;
}

const emptyData: UserData = {
  firstName: "", lastName: "", email: "",
  phoneCountryCode: "+51", phone: "",
  brandCountry: "", brandName: "", brandOffering: "",
  brandLink: "", revenueRange: "", marketScope: "",
};

const inputCls =
  "w-full bg-transparent border border-cream/15 px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:border-signal focus:outline-none rounded-md";
const labelCls = "block text-xs uppercase tracking-widest text-cream/45 mb-1";

export default function EmailGate({ onSubmit }: Props) {
  const [data, setData] = useState<UserData>(emptyData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof UserData>(k: K, v: UserData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const phoneValid = data.phone.replace(/\D/g, "").length >= 7;
  const canSubmit = Boolean(
    data.firstName.trim() && data.lastName.trim() && emailValid && phoneValid &&
    data.brandCountry && data.brandName.trim() && data.brandOffering.trim() &&
    data.revenueRange && data.marketScope && !submitting
  );

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(data);
    } catch {
      setError("No pudimos enviar tu información. Intenta de nuevo.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handle} className="border border-signal/40 bg-signal/5 p-8 space-y-5">
      <div>
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal">Desbloquea tu reporte</p>
        <h3 className="mt-2 text-2xl font-normal text-cream">
          Arquetipo, nivel, radar, brechas y ruta — personalizados con el nombre de tu marca.
        </h3>
        <p className="mt-2 text-sm text-cream/70">
          Recibirás el reporte en pantalla + un email con tu perfil RIZOMA.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Nombre *</label>
          <input className={inputCls} value={data.firstName}
            onChange={(e) => set("firstName", e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Apellido *</label>
          <input className={inputCls} value={data.lastName}
            onChange={(e) => set("lastName", e.target.value)} required />
        </div>
      </div>

      <div>
        <label className={labelCls}>Email *</label>
        <input type="email" className={inputCls} value={data.email}
          onChange={(e) => set("email", e.target.value)} required />
      </div>

      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div>
          <label className={labelCls}>Código país *</label>
          <select className={`${inputCls} appearance-none`} value={data.phoneCountryCode}
            onChange={(e) => set("phoneCountryCode", e.target.value)}>
            {COUNTRY_CODES.map(c => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Teléfono *</label>
          <input type="tel" className={inputCls} value={data.phone}
            onChange={(e) => set("phone", e.target.value)} required />
        </div>
      </div>

      <div>
        <label className={labelCls}>País de la marca *</label>
        <select className={`${inputCls} appearance-none`} value={data.brandCountry}
          onChange={(e) => set("brandCountry", e.target.value)} required>
          <option value="">Selecciona un país</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className={labelCls}>Nombre de la marca *</label>
        <input className={inputCls} value={data.brandName}
          onChange={(e) => set("brandName", e.target.value)} required />
      </div>

      <div>
        <label className={labelCls}>Producto o servicio *</label>
        <textarea rows={2} className={inputCls} value={data.brandOffering}
          placeholder="En 1-2 líneas, ¿qué ofrece tu marca?"
          onChange={(e) => set("brandOffering", e.target.value)} required />
      </div>

      <div>
        <label className={labelCls}>Enlace principal</label>
        <input className={inputCls} value={data.brandLink}
          placeholder="https://tumarca.com · @tumarca · tiktok.com/@tumarca"
          onChange={(e) => set("brandLink", e.target.value)} />
        <p className="mt-1 text-[11px] text-cream/30">Web, Instagram, Facebook, TikTok u otra red.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Rango de facturación anual *</label>
          <select className={`${inputCls} appearance-none`} value={data.revenueRange}
            onChange={(e) => set("revenueRange", e.target.value)} required>
            <option value="">Selecciona un rango</option>
            {REVENUE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Mercado actual *</label>
          <select className={`${inputCls} appearance-none`} value={data.marketScope}
            onChange={(e) => set("marketScope", e.target.value)} required>
            <option value="">Selecciona un alcance</option>
            {MARKET_SCOPES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={!canSubmit}
        className="w-full bg-signal py-4 font-medium text-cream transition-colors hover:bg-flash disabled:cursor-not-allowed disabled:opacity-50">
        {submitting ? "Enviando…" : "Ver mi reporte completo →"}
      </button>

      <p className="text-center text-[11px] text-cream/45">
        Usamos esta información sólo para enviarte tu reporte y un análisis personalizado de ThousandFold. Sin spam.
      </p>
    </form>
  );
}

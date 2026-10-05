"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/whatsapp";

const topics = [
  "Virtual Office",
  "Coworking Space",
  "Meeting Room",
  "Promo & Penawaran",
  "Lainnya",
];

export function ContactForm() {
  const [topic, setTopic] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const business = String(data.get("business") ?? "");
    const message = String(data.get("message") ?? "");
    const text = `Halo EasyOffice, saya ${name}${business ? ` dari ${business}` : ""}. Topik: ${topic}. ${message}`;
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-navy">
          Nama Lengkap*
          <input
            name="name"
            required
            placeholder="Mis. Budi Santoso"
            className="rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm font-normal text-navy placeholder:text-neutral-400 focus:border-navy focus:outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Nama Bisnis / Perusahaan
          <input
            name="business"
            placeholder="Mis. PT Maju Bersama"
            className="rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm font-normal text-navy placeholder:text-neutral-400 focus:border-navy focus:outline-none"
          />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-navy">
          Email*
          <input
            name="email"
            type="email"
            required
            placeholder="nama@email.com"
            className="rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm font-normal text-navy placeholder:text-neutral-400 focus:border-navy focus:outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          No. WhatsApp*
          <input
            name="phone"
            type="tel"
            required
            placeholder="0812-3456-7890"
            className="rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm font-normal text-navy placeholder:text-neutral-400 focus:border-navy focus:outline-none"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Topik*
        <select
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm font-normal text-navy focus:border-navy focus:outline-none"
        >
          <option value="" disabled>
            Pilih Topik
          </option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold text-navy">
        Pesan / Pertanyaan*
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Ceritakan kebutuhan bisnis Anda..."
          className="resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm font-normal text-navy placeholder:text-neutral-400 focus:border-navy focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-8 py-4 text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
      >
        Kirim Pertanyaan
      </button>
    </form>
  );
}

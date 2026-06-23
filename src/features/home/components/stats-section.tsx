import React from "react";

const FACTS = [
  { value: "8", label: "Game tersedia" },
  { value: "±10s", label: "Proses kirim" },
  { value: "9+", label: "Metode bayar" },
  { value: "24/7", label: "CS WhatsApp" },
];

export function StatsSection() {
  return (
    <section className="w-full py-10 sm:py-14 bg-bg-secondary border-y border-border-color">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border-subtle rounded-2xl overflow-hidden">
          {FACTS.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col items-center justify-center gap-2 py-8 px-6 bg-bg-secondary"
            >
              <span className="text-5xl sm:text-6xl font-extrabold text-accent tabular-nums tracking-tight leading-none">
                {fact.value}
              </span>
              <span className="text-xs sm:text-sm font-medium text-text-secondary leading-snug text-center">
                {fact.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

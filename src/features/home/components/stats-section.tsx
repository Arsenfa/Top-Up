import React from "react";

const STATS = [
  { value: "100K+", label: "Transaksi Sukses", desc: "Diproses otomatis 24/7" },
  { value: "50+", label: "Game Terpopuler", desc: "Dari MOBA hingga RPG" },
  { value: "4.9★", label: "Kepuasan Gamer", desc: "Dari 12.000+ ulasan asli" },
  { value: "99.9%", label: "Tingkat Keberhasilan", desc: "Instan masuk dalam 10 detik" },
];

export function StatsSection() {
  return (
    <section className="w-full py-8 sm:py-12 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Trust Index Bar — Spacious & Clean hair-line borders */}
        <div className="w-full rounded-[24px] bg-bg-secondary border border-border-color shadow-sm p-6 lg:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4">
            {STATS.map((stat, i) => {
              const isLast = i === STATS.length - 1;

              return (
                <div
                  key={stat.label}
                  className={`flex flex-col px-4 text-left justify-center ${
                    !isLast ? "lg:border-r lg:border-border-color" : ""
                  } ${
                    i % 2 === 0 ? "max-lg:border-r max-lg:border-border-color" : ""
                  }`}
                >
                  {/* Accent small line above stat */}
                  <div className="w-6 h-0.5 bg-accent/40 rounded-full mb-3" />
                  
                  {/* Big Number */}
                  <span className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-text-primary leading-none">
                    {stat.value}
                  </span>
                  
                  {/* Label & Description */}
                  <span className="text-xs font-bold text-text-primary mt-2">
                    {stat.label}
                  </span>
                  <span className="text-[10px] text-text-muted mt-0.5 leading-snug">
                    {stat.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    </section>
  );
}

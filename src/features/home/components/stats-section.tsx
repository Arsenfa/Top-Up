import React from "react";

const STATS = [
  { value: "100K+", label: "Transaksi Sukses", desc: "Diproses otomatis 24/7" },
  { value: "50+", label: "Game Tersedia", desc: "MOBA, FPS, RPG, dan lainnya" },
  { value: "4.9★", label: "Rating Gamer", desc: "Dari 12.000+ ulasan" },
  { value: "10 detik", label: "Rata-rata Proses", desc: "Instan setelah bayar" },
];

export function StatsSection() {
  return (
    <section className="w-full py-8 sm:py-12 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full rounded-[20px] bg-bg-secondary border border-border-color p-6 lg:p-8">
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
                  <div className="w-5 h-0.5 bg-accent/40 rounded-full mb-3" />

                  <span className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-text-primary leading-none">
                    {stat.value}
                  </span>

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

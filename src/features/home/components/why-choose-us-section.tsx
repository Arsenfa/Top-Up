import React from "react";
import { Clock, ShieldOff, Tag, Headset } from "lucide-react";

const REASONS = [
  {
    title: "Masuk dalam hitungan detik",
    desc: "Setelah pembayaran terkonfirmasi, item langsung dikirim otomatis ke akun game. Gak perlu nunggu admin online.",
    icon: Clock,
    stat: "±10s",
    statLabel: "proses kirim",
  },
  {
    title: "Gak perlu login akun game",
    desc: "Cukup masukkan User ID yang bersifat publik. Kami tidak pernah minta password atau data sensitif akun kamu.",
    icon: ShieldOff,
    stat: "0",
    statLabel: "password diminta",
  },
  {
    title: "Harga mendekati resmi",
    desc: "Cek sendiri, bandingkan dengan harga in-game. Sesekali ada promo eksklusif yang bikin lebih hemat.",
    icon: Tag,
    stat: "±3%",
    statLabel: "selisih harga resmi",
  },
  {
    title: "CS jawab lewat WhatsApp",
    desc: "Kalau ada kendala, chat tim CS lewat WhatsApp. Biasanya balas dalam beberapa menit di jam aktif.",
    icon: Headset,
    stat: "<5 mnt",
    statLabel: "rata-rata respon",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="w-full py-16 sm:py-24 bg-bg-secondary border-y border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">
            Ini kenapa orang pake TopUpKu
          </h2>
          <p className="text-sm text-text-muted mt-2 leading-relaxed">
            Karena ribet itu musuh. Kami bikin sesimpel mungkin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REASONS.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className="group flex flex-col gap-4 p-5 sm:p-6 rounded-2xl bg-bg-primary border border-border-color hover:border-border-strong transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-text-primary leading-none">
                      {r.stat}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-bold text-sm text-text-primary leading-snug">
                    {r.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-text-muted">{r.statLabel}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

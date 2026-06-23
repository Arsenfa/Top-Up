import React from "react";
import { Gamepad2, Clock, CreditCard, MessageCircle } from "lucide-react";

const FACTS = [
  { icon: Gamepad2, value: "8", label: "Game tersedia" },
  { icon: Clock, value: "±10s", label: "Proses kirim" },
  { icon: CreditCard, value: "9+", label: "Metode bayar" },
  { icon: MessageCircle, value: "24/7", label: "CS WhatsApp" },
];

export function StatsSection() {
  return (
    <section className="w-full py-10 sm:py-12 bg-bg-secondary border-y border-border-color">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border-subtle">

          {FACTS.map((fact) => {
            const Icon = fact.icon;
            return (
              <div
                key={fact.label}
                className="flex flex-col items-center justify-center gap-2 py-4 px-3 sm:py-5 sm:px-4 first:pl-0 last:pr-0"
              >
                <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-accent" />
                </div>

                <p className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight leading-none">
                  {fact.value}
                </p>

                <p className="text-xs text-text-muted leading-none">
                  {fact.label}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}

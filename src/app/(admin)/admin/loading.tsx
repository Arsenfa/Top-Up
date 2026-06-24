import React from "react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-8 w-full animate-pulse">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <div className="h-7 w-40 bg-bg-tertiary rounded-lg" />
        <div className="h-3 w-64 bg-bg-tertiary/60 rounded" />
      </div>

      {/* Stat cards — 4 column grid matching real layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-24 rounded-xl bg-bg-secondary border border-border-color" />
        <div className="h-24 rounded-xl bg-bg-secondary border border-border-color" />
        <div className="h-24 rounded-xl bg-bg-secondary border border-border-color" />
        <div className="h-24 rounded-xl bg-bg-secondary border border-border-color" />
      </div>

      {/* Table area */}
      <div className="flex flex-col gap-3">
        <div className="h-4 w-36 bg-bg-tertiary rounded" />
        <div className="rounded-xl border border-border-color bg-bg-secondary overflow-hidden">
          <div className="h-10 bg-bg-tertiary/40 border-b border-border-color" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 border-b border-border-color/30 last:border-0" />
          ))}
        </div>
      </div>
    </div>
  );
}

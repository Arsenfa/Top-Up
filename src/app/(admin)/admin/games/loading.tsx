export default function AdminGamesLoading() {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-7 w-48 bg-bg-tertiary rounded-lg" />
        <div className="h-3 w-80 bg-bg-tertiary rounded" />
      </div>
      <div className="p-5 rounded-2xl border border-border-color/60 flex items-center gap-3">
        <div className="h-10 w-64 bg-bg-tertiary rounded-lg" />
        <div className="h-10 w-40 bg-bg-tertiary rounded-lg" />
      </div>
      <div className="h-96 rounded-2xl border border-border-color bg-bg-secondary flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    </div>
  );
}

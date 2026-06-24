export default function AdminSettingsLoading() {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-7 w-48 bg-bg-tertiary rounded-lg" />
        <div className="h-3 w-80 bg-bg-tertiary rounded" />
      </div>
      <div className="h-64 rounded-2xl border border-border-color bg-bg-secondary flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    </div>
  );
}

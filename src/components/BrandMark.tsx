export function BrandMark() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(124,92,255,0.1)] backdrop-blur-xl">
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-violet-300" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M6 8.5 12 4l6 4.5v7L12 20l-6-4.5z" />
        <path d="M12 4v16" />
        <path d="M6 8.5h12" />
      </svg>
    </div>
  );
}

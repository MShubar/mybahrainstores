export function HeroBanner() {
  return (
    <div className="relative mx-4 overflow-hidden rounded-2xl bg-[#FF5A00] p-5 text-white shadow-celebrity">
      <div className="relative z-10 max-w-[75%]">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
          Bahrain Store
        </p>
        <h2 className="mt-2 text-[22px] font-extrabold leading-tight tracking-tight">
          SHOP LOCAL,
          <br />
          SUPPORT LOCAL
        </h2>
      </div>

      <div className="absolute bottom-3 right-4 top-3 flex items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -right-4 top-0 h-20 w-20 rounded-full bg-white/10" />
    </div>
  );
}

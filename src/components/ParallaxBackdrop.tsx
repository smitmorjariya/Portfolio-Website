export function ParallaxBackdrop() {
  return (
    <div
      aria-hidden="true"
      data-testid="parallax-backdrop"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Distant ambient violet light veil — slow upward drift */}
      <div
        data-parallax-layer
        data-parallax-y="-120"
        className="absolute -right-24 top-[14vh] h-[34rem] w-[34rem] rounded-full opacity-[0.14] will-change-transform"
        style={{
          background:
            'radial-gradient(circle at center, rgba(124, 92, 255, 0.52) 0%, rgba(124, 92, 255, 0.08) 48%, transparent 72%)',
        }}
      />

      {/* Mid-page electric blue atmospheric veil — counter-drift */}
      <div
        data-parallax-layer
        data-parallax-y="140"
        className="absolute -left-28 top-[46vh] h-[30rem] w-[30rem] rounded-full opacity-[0.12] will-change-transform"
        style={{
          background:
            'radial-gradient(circle at center, rgba(59, 130, 246, 0.48) 0%, rgba(59, 130, 246, 0.06) 50%, transparent 72%)',
        }}
      />

      {/* Subtle architectural diagonal hairline accents */}
      <div
        data-parallax-layer
        data-parallax-y="-80"
        className="absolute right-[12%] top-[28vh] hidden h-72 w-72 rounded-full border border-[#7C5CFF]/[0.07] will-change-transform lg:block"
      />

      <div
        data-parallax-layer
        data-parallax-y="95"
        className="absolute left-[8%] top-[68vh] hidden h-56 w-56 rounded-full border border-[#3B82F6]/[0.06] will-change-transform lg:block"
      />
    </div>
  );
}

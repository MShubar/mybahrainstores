type AppBrandTitleProps = {
  size?: "sm" | "md";
};

export function AppBrandTitle({ size = "md" }: AppBrandTitleProps) {
  const isSmall = size === "sm";

  return (
    <h1
      className="flex items-baseline leading-none"
      aria-label="Bahrain Store"
    >
      <span
        className={`font-extrabold tracking-tight text-[#FF5A00] ${
          isSmall ? "text-lg" : "text-[22px]"
        }`}
      >
        Bahrain
      </span>
      <span
        className={`ml-1.5 font-bold text-gray-900 ${
          isSmall ? "text-base" : "text-[18px]"
        }`}
      >
        Store
      </span>
    </h1>
  );
}

import { useState } from "react";

type ProductImageProps = {
  src?: string;
  alt: string;
  className?: string;
  fallbackEmoji?: string;
};

export function ProductImage({
  src,
  alt,
  className = "h-full w-full object-contain p-1.5",
  fallbackEmoji = "⌚",
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center text-3xl text-gray-400">
        {fallbackEmoji}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

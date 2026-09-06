/* eslint-disable @next/next/no-img-element */
"use client";

import { ImageOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ProductImageProps = {
  alt: string;
  className?: string;
  src: string | null;
};

export function ProductImage({ alt, className, src }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <span
        aria-label={`No image available for ${alt}`}
        className={cn("flex shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground", className)}
        role="img"
      >
        <ImageOff aria-hidden="true" className="size-5" />
      </span>
    );
  }

  return (
    <img
      alt={alt}
      className={cn("shrink-0 rounded-xl object-cover", className)}
      onError={() => setHasError(true)}
      src={src}
    />
  );
}

import Image from "next/image";
import { PHOTOS, type PhotoKey } from "@/lib/photos";

/**
 * A framed editorial photo. object-cover only ever crops further into the
 * already-cleaned source, so no layout can bring the removed watermark back.
 */
export function Photo({
  k,
  className = "",
  sizes = "(min-width: 1024px) 40vw, 100vw",
  priority = false,
}: {
  k: PhotoKey;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const photo = PHOTOS[k];
  return (
    <div className={`ae-photo aspect-[16/10] ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

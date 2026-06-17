import { useEffect, useRef } from "react";

const FRAME_COLS = 4;
const TOTAL_FRAMES = 16;

interface PetSpriteProps {
  src: string;
  className?: string;
  frameIndex?: number;
}

export default function PetSprite({ src, className = "", frameIndex = 0 }: PetSpriteProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const cw = el.offsetWidth || 32;
      const ch = el.offsetHeight || 32;
      const col = frameIndex % FRAME_COLS;
      const row = Math.floor(frameIndex / FRAME_COLS);

      el.style.backgroundImage = `url(${src})`;
      el.style.backgroundSize = `${FRAME_COLS * cw}px ${(TOTAL_FRAMES / FRAME_COLS) * ch}px`;
      el.style.backgroundRepeat = "no-repeat";
      el.style.imageRendering = "pixelated";
      el.style.backgroundPosition = `-${col * cw}px -${row * ch}px`;
    };
  }, [src, frameIndex]);

  return <div ref={elRef} className={className} />;
}

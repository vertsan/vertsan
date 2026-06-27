"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useTransform,
  useScroll,
  useSpring,
} from "motion/react";
import { cn } from "#/lib/utils";

function isBrowser() {
  return typeof document !== "undefined";
}

function readCSSVar(name: string): string {
  if (!isBrowser()) return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getColors() {
  return {
    border: readCSSVar("--border") || "oklch(0.22 0 0)",
    primary: readCSSVar("--primary") || "oklch(0.985 0 0)",
    bg: readCSSVar("--background") || "oklch(0 0 0)",
  };
}

export const TracingBeam = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [colors, setColors] = useState({ border: "", primary: "", bg: "" });

  useEffect(() => {
    setColors(getColors());
    const observer = new MutationObserver(() => setColors(getColors()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
    const r = new ResizeObserver(([entry]) => setSvgHeight(entry.contentRect.height));
    if (contentRef.current) r.observe(contentRef.current);
    return () => r.disconnect();
  }, []);

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
    { stiffness: 500, damping: 90 },
  );
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]),
    { stiffness: 500, damping: 90 },
  );

  const isAtTop = scrollYProgress.get() <= 0;

  return (
    <motion.div
      ref={ref}
      className={cn("relative mx-auto h-full w-full max-w-4xl", className)}
    >
      <div className="absolute top-3 -left-4 md:-left-20">
        <motion.div
          animate={{
            boxShadow: isAtTop
              ? "rgba(0, 0, 0, 0.24) 0px 3px 8px"
              : "none",
          }}
          transition={{ duration: 0.2, delay: 0.5 }}
          className="ml-[27px] flex h-4 w-4 items-center justify-center rounded-full border shadow-sm"
          style={{ borderColor: colors.border }}
        >
          <motion.div
            animate={{
              backgroundColor: isAtTop ? colors.primary : colors.bg,
              borderColor: isAtTop ? colors.primary : colors.border,
            }}
            transition={{ duration: 0.2, delay: 0.5 }}
            className="h-2 w-2 rounded-full border"
            style={{
              backgroundColor: isAtTop ? colors.primary : colors.bg,
              borderColor: isAtTop ? colors.primary : colors.border,
            }}
          />
        </motion.div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke={colors.border}
            strokeOpacity="0.3"
          />
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="1.25"
            className="motion-reduce:hidden"
          />
          <defs>
            <motion.linearGradient
              id="gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor={colors.primary} stopOpacity="0" />
              <stop stopColor={colors.primary} />
              <stop offset="1" stopColor={colors.primary} stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
};

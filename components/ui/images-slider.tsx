"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = "up",
}: {
  images: string[];
  children: React.ReactNode;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1 === images.length ? 0 : prev + 1));
  };
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? images.length - 1 : prev - 1));
  };

  /* Preload images */
  useEffect(() => {
    const promises = images.map(
      (src) =>
        new Promise<string>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(src);
          img.onerror = () => resolve(src); // resolve even on error so the slider still runs
        })
    );
    Promise.all(promises).then(setLoadedImages);
  }, []);

  /* Keyboard + autoplay */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrevious();
    };
    window.addEventListener("keydown", onKey);
    let interval: ReturnType<typeof setInterval> | undefined;
    if (autoplay) interval = setInterval(handleNext, 5000);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearInterval(interval);
    };
  }, []);

  const slideVariants = {
    initial:  { scale: 1.06, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    upExit:   { opacity: 0, y: "-8%",  transition: { duration: 0.9, ease: "easeInOut" } },
    downExit: { opacity: 0, y: "8%",   transition: { duration: 0.9, ease: "easeInOut" } },
  };

  return (
    <div
      className={cn("overflow-hidden h-full w-full relative flex items-center justify-center", className)}
      style={{ perspective: "1000px" }}
    >
      {/* ① Background images — shown as soon as each resolves */}
      <AnimatePresence mode="sync">
        {loadedImages.length > 0 && (
          <motion.img
            key={currentIndex}
            src={loadedImages[currentIndex]}
            initial="initial"
            animate="visible"
            exit={direction === "up" ? "upExit" : "downExit"}
            variants={slideVariants}
            className="absolute inset-0 w-full h-full object-cover object-center"
            alt=""
          />
        )}
      </AnimatePresence>

      {/* ② Overlay — always rendered */}
      {overlay && (
        <div className={cn("absolute inset-0 bg-black/60 z-40", overlayClassName)} />
      )}

      {/* ③ Children — always rendered, never blocked by loading */}
      {children}
    </div>
  );
};

"use client";

import { useRef, useEffect, useCallback } from "react";
import { useColorTheme } from "./ColorContext";

// Simple 2D noise function for organic flow
function pseudoNoise(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 0.8 + t * 0.4) *
    Math.cos(y * 0.6 + t * 0.3) *
    Math.sin((x + y) * 0.5 + t * 0.2) *
    0.5 +
    0.5
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [255, 140, 0];
}

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export default function AnimatedWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { activeTheme } = useColorTheme();

  // Store current colors for smooth interpolation
  const currentColors = useRef({
    primary: hexToRgb(activeTheme.primary),
    secondary: hexToRgb(activeTheme.secondary),
    tertiary: hexToRgb(activeTheme.tertiary),
  });
  const targetColors = useRef({
    primary: hexToRgb(activeTheme.primary),
    secondary: hexToRgb(activeTheme.secondary),
    tertiary: hexToRgb(activeTheme.tertiary),
  });

  // Update target when theme changes
  useEffect(() => {
    targetColors.current = {
      primary: hexToRgb(activeTheme.primary),
      secondary: hexToRgb(activeTheme.secondary),
      tertiary: hexToRgb(activeTheme.tertiary),
    };
  }, [activeTheme]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const t = performance.now() * 0.001;

    // Smoothly interpolate current towards target
    const lerp = 0.02;
    currentColors.current.primary = lerpColor(
      currentColors.current.primary,
      targetColors.current.primary,
      lerp
    );
    currentColors.current.secondary = lerpColor(
      currentColors.current.secondary,
      targetColors.current.secondary,
      lerp
    );
    currentColors.current.tertiary = lerpColor(
      currentColors.current.tertiary,
      targetColors.current.tertiary,
      lerp
    );

    const c1 = currentColors.current.primary;
    const c2 = currentColors.current.secondary;
    const c3 = currentColors.current.tertiary;

    // Draw flowing gradient layers
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    const step = 4; // Render every 4th pixel for performance, then scale
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const nx = x / w;
        const ny = y / h;

        // Multiple noise layers for organic flow
        const n1 = pseudoNoise(nx * 3, ny * 2, t * 0.5);
        const n2 = pseudoNoise(nx * 5 + 10, ny * 3 + 5, t * 0.3 + 2);
        const n3 = pseudoNoise(nx * 2 + 20, ny * 4 + 10, t * 0.7 + 4);

        // Blend between 3 colors based on noise
        const blend = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

        let r: number, g: number, b: number;
        if (blend < 0.4) {
          const t2 = blend / 0.4;
          [r, g, b] = lerpColor(c1, c2, t2);
        } else if (blend < 0.7) {
          const t2 = (blend - 0.4) / 0.3;
          [r, g, b] = lerpColor(c2, c3, t2);
        } else {
          const t2 = (blend - 0.7) / 0.3;
          [r, g, b] = lerpColor(c3, c1, t2);
        }

        // Apply silk-like highlights
        const highlight = Math.pow(n2, 3) * 60;
        r = Math.min(255, r + highlight);
        g = Math.min(255, g + highlight);
        b = Math.min(255, b + highlight);

        // Fill the step×step block
        for (let dy = 0; dy < step && y + dy < h; dy++) {
          for (let dx = 0; dx < step && x + dx < w; dx++) {
            const idx = ((y + dy) * w + (x + dx)) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Apply gaussian-like blur by drawing scaled
    // Draw the canvas onto itself with slight blur effect using compositing
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use lower resolution for performance
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width / 3);
      canvas.height = Math.floor(rect.height / 3);
    };
    resize();
    window.addEventListener("resize", resize);

    let frameId: number;
    const loop = () => {
      draw();
      frameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        imageRendering: "auto",
        filter: "blur(8px) saturate(1.2)",
      }}
    />
  );
}

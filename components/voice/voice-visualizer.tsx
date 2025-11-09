"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VoiceVisualizerProps {
  isActive: boolean;
  volume?: number;
  type?: "bars" | "wave" | "circle";
  className?: string;
}

export const VoiceVisualizer = ({
  isActive,
  volume = 50,
  type = "bars",
  className
}: VoiceVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bars, setBars] = useState<number[]>(Array(32).fill(0));

  useEffect(() => {
    if (!isActive) {
      setBars(Array(32).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * volume));
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, volume]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (!isActive) return;

    if (type === "bars") {
      // Draw bars
      const barWidth = width / bars.length;
      bars.forEach((bar, index) => {
        const barHeight = (bar / 100) * height;
        const x = index * barWidth;
        const y = height - barHeight;

        const gradient = ctx.createLinearGradient(0, y, 0, height);
        gradient.addColorStop(0, "rgba(99, 102, 241, 0.8)");
        gradient.addColorStop(1, "rgba(139, 92, 246, 0.8)");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, barHeight);
      });
    } else if (type === "wave") {
      // Draw wave
      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      bars.forEach((bar, index) => {
        const x = (index / bars.length) * width;
        const y = height / 2 + (bar / 100) * (height / 2) * Math.sin(index * 0.5);
        ctx.lineTo(x, y);
      });

      ctx.strokeStyle = "rgba(99, 102, 241, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (type === "circle") {
      // Draw circle
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) / 4;

      ctx.beginPath();
      bars.forEach((bar, index) => {
        const angle = (index / bars.length) * Math.PI * 2;
        const radius = baseRadius + (bar / 100) * baseRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.closePath();
      ctx.strokeStyle = "rgba(99, 102, 241, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius);
      gradient.addColorStop(0, "rgba(99, 102, 241, 0.2)");
      gradient.addColorStop(1, "rgba(139, 92, 246, 0.1)");
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [bars, isActive, type]);

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        width={400}
        height={100}
        className="w-full h-full"
      />
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-zinc-500">Sessiz</p>
        </div>
      )}
    </div>
  );
};

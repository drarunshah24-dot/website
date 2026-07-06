"use client";

import { motion } from "motion/react";
import { Activity, Plus, HeartPulse, ShieldCheck, Award } from "lucide-react";

export function HeroGlow() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* ─── 1. ULTRA-PREMIUM 5-STAR CLINIC AURAS (Sky Blue, Gold Medalist Warmth, Mint Teal) ─── */}
      
      {/* Primary Soothing Medical Sky Blue Aura (Left/Center) */}
      <motion.div
        className="absolute -top-24 left-[10%] w-[48rem] h-[48rem] rounded-full blur-[105px]"
        style={{
          background: "radial-gradient(circle, rgba(147, 197, 253, 0.4) 0%, rgba(191, 219, 254, 0.25) 50%, transparent 80%)",
        }}
        animate={{
          scale: [1, 1.15, 0.95, 1],
          opacity: [0.5, 0.85, 0.6, 0.5],
          x: [0, 40, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary Gold Medalist Warm Amber/Gold Aura (Right side behind Doctor) */}
      <motion.div
        className="absolute top-[5%] right-[8%] w-[44rem] h-[44rem] rounded-full blur-[115px]"
        style={{
          background: "radial-gradient(circle, rgba(253, 224, 71, 0.28) 0%, rgba(254, 240, 138, 0.15) 50%, transparent 80%)",
        }}
        animate={{
          scale: [0.95, 1.2, 0.9, 0.95],
          opacity: [0.4, 0.8, 0.5, 0.4],
          y: [0, -30, 40, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Tertiary Elegant Surgical Mint/Teal Core (Center accent) */}
      <motion.div
        className="absolute top-[35%] left-[38%] w-[38rem] h-[38rem] rounded-full blur-[95px]"
        style={{
          background: "radial-gradient(circle, rgba(110, 231, 183, 0.35) 0%, rgba(167, 243, 208, 0.2) 50%, transparent 80%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.75, 0.35],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* ─── 2. FLOATING MEDICAL & PRESTIGE MOTIFS (HOLOGRAPHIC ICONS) ─── */}
      
      {/* Medical Clinic Cross 1 (Top Left) */}
      <motion.div
        className="absolute top-[18%] left-[8%] text-blue-600/35 bg-blue-50/70 p-3 rounded-2xl border border-blue-200/50 shadow-lg backdrop-blur-md"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 10, -5, 0],
          opacity: [0.4, 0.85, 0.4],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Plus className="w-8 h-8 stroke-[2.5]" />
      </motion.div>

      {/* ECG Pulse Wave (Mid Left) */}
      <motion.div
        className="absolute top-[55%] left-[12%] text-emerald-600/35 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/50 shadow-lg backdrop-blur-md"
        animate={{
          y: [0, 20, -10, 0],
          x: [0, 15, 0],
          opacity: [0.35, 0.8, 0.35],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <Activity className="w-8 h-8 stroke-[2]" />
      </motion.div>

      {/* Gold Medalist Emblem (Top Center-Right) */}
      <motion.div
        className="absolute top-[14%] right-[42%] text-amber-600/35 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/50 shadow-md backdrop-blur-md"
        animate={{
          y: [0, -18, 5, 0],
          rotate: [0, -12, 8, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <Award className="w-6 h-6 stroke-[2.5]" />
      </motion.div>

      {/* Heart Pulse Emblem (Bottom Right behind image) */}
      <motion.div
        className="absolute bottom-[20%] right-[8%] text-emerald-600/35 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/50 shadow-lg backdrop-blur-md"
        animate={{
          scale: [1, 1.15, 1],
          y: [0, -15, 0],
          opacity: [0.4, 0.85, 0.4],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <HeartPulse className="w-9 h-9 stroke-[2]" />
      </motion.div>

      {/* Medical Cross 3 (Bottom Center) */}
      <motion.div
        className="absolute bottom-[10%] left-[45%] text-blue-600/35 bg-blue-50/70 p-2.5 rounded-xl border border-blue-200/50 shadow-sm backdrop-blur-md"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 15, -10, 0],
          opacity: [0.3, 0.75, 0.3],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </motion.div>

      {/* Verified Medical Shield (Top Right) */}
      <motion.div
        className="absolute top-[22%] right-[6%] text-blue-700/35 bg-blue-50/70 p-3 rounded-2xl border border-blue-200/50 shadow-md backdrop-blur-md hidden md:block"
        animate={{
          y: [0, 25, -10, 0],
          rotate: [0, -8, 5, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <ShieldCheck className="w-8 h-8 stroke-[2]" />
      </motion.div>

    </div>
  );
}

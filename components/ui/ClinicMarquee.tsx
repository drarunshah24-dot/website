"use client";

import { Camera } from "lucide-react";
import { motion } from "motion/react";

const galleryImages = [
  {
    src: "https://placehold.co/600x400/f8fafc/475569?text=Modern+Waiting+Area",
    alt: "Modern Waiting Area",
    label: "Modern Waiting Area",
  },
  {
    src: "https://placehold.co/600x400/f8fafc/475569?text=Advanced+Laser+Tech",
    alt: "Advanced Laser Tech",
    label: "Advanced Laser Suite",
  },
  {
    src: "https://placehold.co/600x400/f8fafc/475569?text=Consultation+Room",
    alt: "Consultation Room",
    label: "Private Consultation",
  },
  {
    src: "https://placehold.co/600x400/f8fafc/475569?text=Clean+Pharmacy",
    alt: "Clean Pharmacy",
    label: "On-Site Pharmacy",
  },
  {
    src: "https://placehold.co/600x400/f8fafc/475569?text=Recovery+Suite",
    alt: "Recovery Suite",
    label: "Comfort Recovery Suite",
  },
  {
    src: "https://placehold.co/600x400/f8fafc/475569?text=Diagnostics+Lab",
    alt: "Diagnostics Lab",
    label: "Advanced Diagnostics Lab",
  },
];

// Duplicate the array 4 times (24 images total) so all items sit in ONE single flex track.
// Animating from 0% to -50% ensures a seamless loop that will never run out of width or overlap.
const duplicatedImages = [...galleryImages, ...galleryImages, ...galleryImages, ...galleryImages];

export function ClinicMarquee() {
  return (
    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,black_8%,black_92%,transparent_100%)] py-4">
      {/* Framer Motion GPU-accelerated infinite loop. 
          Duration set to 25s for an active, clearly visible, silky-smooth sliding animation that never stops. */}
      <motion.div
        className="flex flex-nowrap gap-6 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {duplicatedImages.map((item, index) => (
          <div
            key={index}
            className="w-[300px] md:w-[400px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group/card transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-white/50 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-slate-800">{item.label}</span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

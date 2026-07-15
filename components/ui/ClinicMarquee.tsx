"use client";

import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

export interface GalleryItem {
  title: string;
  image: string;
  src?: string;
  alt?: string;
  label?: string;
}

const defaultGalleryImages: GalleryItem[] = [
  {
    image:
      "https://placehold.co/600x400/f8fafc/475569?text=Modern+Waiting+Area",
    title: "Modern Waiting Area",
  },
  {
    image:
      "https://placehold.co/600x400/f8fafc/475569?text=Advanced+Laser+Tech",
    title: "Advanced Laser Suite",
  },
  {
    image: "https://placehold.co/600x400/f8fafc/475569?text=Consultation+Room",
    title: "Private Consultation",
  },
  {
    image: "https://placehold.co/600x400/f8fafc/475569?text=Clean+Pharmacy",
    title: "On-Site Pharmacy",
  },
  {
    image: "https://placehold.co/600x400/f8fafc/475569?text=Recovery+Suite",
    title: "Comfort Recovery Suite",
  },
  {
    image: "https://placehold.co/600x400/f8fafc/475569?text=Diagnostics+Lab",
    title: "Advanced Diagnostics Lab",
  },
];

export function ClinicMarquee({
  initialItems = [],
}: {
  initialItems?: GalleryItem[];
}) {
  const [items, setItems] = useState<GalleryItem[]>(
    initialItems.length > 0 ? initialItems : defaultGalleryImages,
  );

  useEffect(() => {
    fetch(`/api/admin/content?type=gallery&_ts=${Date.now()}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.items && data.items.length > 0) {
          setItems(
            data.items.map((i: { title?: string; image?: string }) => ({
              title: i.title || "Clinic Facility",
              image:
                i.image ||
                "https://placehold.co/600x400/f8fafc/475569?text=Facility+Photo",
            })),
          );
        }
      })
      .catch((err) => console.error("Error loading live gallery:", err));
  }, []);

  const list = items.length > 0 ? items : defaultGalleryImages;
  // Duplicate array 4 times so all items sit in ONE single flex track
  const duplicatedImages = [...list, ...list, ...list, ...list];

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
              <Image
                src={
                  item.image ||
                  item.src ||
                  "https://placehold.co/600x400/f8fafc/475569.png?text=Facility+Photo"
                }
                alt={item.title || item.alt || "Clinic Image"}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-700 group-hover/card:scale-105"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-white/50 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-slate-800">
                  {item.title || item.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

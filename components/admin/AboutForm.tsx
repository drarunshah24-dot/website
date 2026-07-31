"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  UserCheck,
  RefreshCw,
  Save,
  Plus,
  Trash2,
  GraduationCap,
  Award,
  Stethoscope,
  Building2,
  Upload,
} from "lucide-react";
import { useToast } from "../ui/toast";

export interface EducationItem {
  degree: string;
  badgeTag: string;
  highlightBadge: string;
  institution: string;
  description: string;
}

export interface StatBadge {
  icon: string;
  title: string;
  subtitle: string;
}

export interface AboutData {
  hero: {
    name: string;
    title: string;
    image: string;
    bioParagraphs: string[];
    stats: StatBadge[];
    appointmentUrl: string;
  };
  education: {
    sectionTitle: string;
    items: EducationItem[];
  };
  expertise: {
    sectionTitle: string;
    items: string[];
  };
  philosophy: {
    sectionTitle: string;
    quote: string;
  };
}

const DEFAULT_ABOUT_DATA: AboutData = {
  hero: {
    name: "Dr. Arun Shah",
    title: "Senior Consultant Urologist",
    image: "/dr-arun-shah-urologist-janakpur.jpg",
    bioParagraphs: [
      "Dr. Arun Shah is a distinguished urologist and a Gold Medalist in M.Ch Urology. With a commitment to bringing world-class urological care to Janakpur and the Madhesh Province, he specializes in advanced, minimally invasive laser surgeries.",
      "His clinical philosophy centers around patient comfort, ethical medical practices, and utilizing the latest technological advancements to ensure faster recovery times and better outcomes.",
    ],
    stats: [
      { icon: "Award", title: "Gold Medalist", subtitle: "M.Ch Urology" },
      {
        icon: "GraduationCap",
        title: "NMC Registered",
        subtitle: "Reg No: 15706",
      },
      {
        icon: "Building2",
        title: "Years of Experience",
        subtitle: "10+ Years",
      },
    ],
    appointmentUrl:
      "https://wa.me/9779814834756?text=I%20would%20like%20to%20book%20an%20appointment.",
  },
  education: {
    sectionTitle: "Education & Qualifications",
    items: [
      {
        degree: "M.Ch in Urology",
        badgeTag: "Super-Specialization",
        highlightBadge: "University Gold Medalist",
        institution: "Institute of Medicine (IOM), Tribhuvan University",
        description:
          "Highest tier surgical super-specialization focusing on advanced endourology, reconstructive urology, renal transplantation, and minimally invasive laser surgeries (RIRS, HoLEP, PCNL). Awarded the university gold medal for first-rank academic and surgical excellence.",
      },
      {
        degree: "MS General Surgery",
        badgeTag: "Postgraduate Degree",
        highlightBadge: "Master of Surgery",
        institution: "Tribhuvan University / Reputed Medical College",
        description:
          "Comprehensive surgical residency mastery encompassing complex abdominal procedures, trauma management, intensive critical care, and surgical oncology, establishing the rigorous foundation for urological super-specialization.",
      },
      {
        degree: "MBBS",
        badgeTag: "Foundation Degree",
        highlightBadge: "Bachelor of Medicine & Surgery",
        institution: "Recognized University Medical Institute",
        description:
          "Fundamental medical and surgical degree with clinical honors, extensive patient diagnostics training, and comprehensive medical science discipline.",
      },
    ],
  },
  expertise: {
    sectionTitle: "Areas of Expertise",
    items: [
      "Laser Kidney Stone Surgery (RIRS, PCNL)",
      "Prostate Laser Surgery (HoLEP, TURP)",
      "Minimally Invasive Urology",
      "Male Infertility & Sexual Health",
      "Uro-Oncology (Kidney, Prostate, Bladder Cancer)",
      "Reconstructive Urology (Urethroplasty)",
      "Pediatric Urology",
      "Female Pelvic Medicine & Reconstructive Surgery",
    ],
  },
  philosophy: {
    sectionTitle: "Patient-Centered Medical Philosophy",
    quote:
      "My goal is to provide world-class urological care that is accessible, empathetic, and strictly ethical. I believe in empowering patients through education, ensuring they understand their conditions and treatment options fully before making decisions. Anxiety should be relieved the moment a patient walks into my clinic.",
  },
};

export function AboutForm() {
  const [data, setData] = useState<AboutData>(DEFAULT_ABOUT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/admin/content?type=about&_ts=" + Date.now())
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setData((prev) => ({
            ...prev,
            ...resData.data,
            hero: { ...prev.hero, ...(resData.data.hero || {}) },
            education: {
              ...prev.education,
              ...(resData.data.education || {}),
              items: resData.data.education?.items || prev.education.items,
            },
            expertise: {
              ...prev.expertise,
              ...(resData.data.expertise || {}),
              items: resData.data.expertise?.items || prev.expertise.items,
            },
            philosophy: {
              ...prev.philosophy,
              ...(resData.data.philosophy || {}),
            },
          }));
        }
      })
      .catch((err) => console.error("Failed to load about data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "about", data }),
      });
      const resData = await res.json();
      if (resData.success) {
        showToast("About page content updated successfully!");
      } else {
        showToast(resData.error || "Failed to update About page.", "error");
      }
    } catch {
      showToast("Server error while saving About page content.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toBase64 = (f: File, maxWidth = 1200): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = (event) => {
          const img = document.createElement("img");
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.8));
          };
          img.onerror = reject;
          if (event.target?.result) img.src = event.target.result as string;
        };
        reader.onerror = reject;
      });

    try {
      const base64DataUrl = await toBase64(file);
      const filename = `about-doctor-${Date.now()}.jpg`;
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename,
          base64Content: base64DataUrl,
          commitMessage: "Upload About page photo via Admin Portal",
        }),
      });

      const uploadRes = await res.json().catch(() => ({}));
      if (uploadRes.success && uploadRes.url) {
        setData((prev) => ({
          ...prev,
          hero: { ...prev.hero, image: uploadRes.url },
        }));
        showToast("About page portrait uploaded successfully!");
      } else {
        showToast(
          "Image upload failed: " + (uploadRes.error || "Unknown"),
          "error",
        );
      }
    } catch {
      showToast("Error uploading image file.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Education Helpers
  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        items: [
          ...prev.education.items,
          {
            degree: "New Degree Title",
            badgeTag: "Specialization",
            highlightBadge: "",
            institution: "University / Institution Name",
            description:
              "Description of training, focus areas, and achievements.",
          },
        ],
      },
    }));
  };

  const updateEducation = (
    index: number,
    field: keyof EducationItem,
    value: string,
  ) => {
    setData((prev) => {
      const updated = [...prev.education.items];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: { ...prev.education, items: updated } };
    });
  };

  const removeEducation = (index: number) => {
    setData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        items: prev.education.items.filter((_, i) => i !== index),
      },
    }));
  };

  // Expertise Helpers
  const addExpertise = () => {
    setData((prev) => ({
      ...prev,
      expertise: {
        ...prev.expertise,
        items: [...prev.expertise.items, "New Clinical Specialty"],
      },
    }));
  };

  const updateExpertise = (index: number, value: string) => {
    setData((prev) => {
      const updated = [...prev.expertise.items];
      updated[index] = value;
      return { ...prev, expertise: { ...prev.expertise, items: updated } };
    });
  };

  const removeExpertise = (index: number) => {
    setData((prev) => ({
      ...prev,
      expertise: {
        ...prev.expertise,
        items: prev.expertise.items.filter((_, i) => i !== index),
      },
    }));
  };

  // Bio Paragraph Helpers
  const addBioParagraph = () => {
    setData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        bioParagraphs: [
          ...prev.hero.bioParagraphs,
          "New biography paragraph...",
        ],
      },
    }));
  };

  const updateBioParagraph = (index: number, value: string) => {
    setData((prev) => {
      const updated = [...prev.hero.bioParagraphs];
      updated[index] = value;
      return { ...prev, hero: { ...prev.hero, bioParagraphs: updated } };
    });
  };

  const removeBioParagraph = (index: number) => {
    setData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        bioParagraphs: prev.hero.bioParagraphs.filter((_, i) => i !== index),
      },
    }));
  };

  // Stat Badges Helpers
  const updateStat = (index: number, field: keyof StatBadge, value: string) => {
    setData((prev) => {
      const updated = [...prev.hero.stats];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, hero: { ...prev.hero, stats: updated } };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-4xl space-y-8 pb-12">
      {/* Top Action Header */}
      <div className="sticky top-16 z-20 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 p-4 backdrop-blur shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              About Page Editor
            </h2>
            <p className="text-xs text-slate-500">
              Customize biography, credentials, education, and specialties.
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save About Page</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Hero & Bio Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-600" />
          Hero Profile & Bio
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Doctor Name
            </label>
            <input
              type="text"
              value={data.hero.name}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, name: e.target.value },
                }))
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Professional Title / Subtitle
            </label>
            <input
              type="text"
              value={data.hero.title}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, title: e.target.value },
                }))
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Profile Photo URL
            </label>
            <input
              type="text"
              value={data.hero.image}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, image: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none mb-3"
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading Image...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload New Portrait Photo</span>
                </>
              )}
            </label>
          </div>

          <div className="flex items-center justify-center p-3 border border-slate-200 rounded-2xl bg-slate-50">
            <div className="relative aspect-[4/5] w-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <Image
                src={data.hero.image || "/dr-arun-shah-urologist-janakpur.jpg"}
                alt={data.hero.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-700">
              Biography Paragraphs
            </label>
            <button
              type="button"
              onClick={addBioParagraph}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Paragraph
            </button>
          </div>
          <div className="space-y-3">
            {data.hero.bioParagraphs.map((para, i) => (
              <div key={i} className="flex gap-2 items-start">
                <textarea
                  value={para}
                  onChange={(e) => updateBioParagraph(i, e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeBioParagraph(i)}
                  disabled={data.hero.bioParagraphs.length <= 1}
                  className="p-2 text-slate-400 hover:text-red-600 disabled:opacity-30"
                  title="Remove paragraph"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Hero Stat Badges
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.hero.stats.map((stat, i) => (
              <div
                key={i}
                className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-2"
              >
                <p className="text-xs font-bold uppercase text-slate-500">
                  Badge #{i + 1}
                </p>
                <input
                  type="text"
                  placeholder="Title (e.g. Gold Medalist)"
                  value={stat.title}
                  onChange={(e) => updateStat(i, "title", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Subtitle (e.g. M.Ch Urology)"
                  value={stat.subtitle}
                  onChange={(e) => updateStat(i, "subtitle", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Appointment Booking / WhatsApp URL
          </label>
          <input
            type="text"
            value={data.hero.appointmentUrl}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                hero: { ...prev.hero, appointmentUrl: e.target.value },
              }))
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Education & Qualifications Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Education & Qualifications
          </h3>
          <button
            type="button"
            onClick={addEducation}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
          >
            <Plus className="w-4 h-4" /> Add Qualification
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Section Title
          </label>
          <input
            type="text"
            value={data.education.sectionTitle}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                education: { ...prev.education, sectionTitle: e.target.value },
              }))
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-6">
          {data.education.items.map((item, i) => (
            <div
              key={i}
              className="relative p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Degree #{i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeEducation(i)}
                  disabled={data.education.items.length <= 1}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline disabled:opacity-30"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Degree Name
                  </label>
                  <input
                    type="text"
                    value={item.degree}
                    onChange={(e) =>
                      updateEducation(i, "degree", e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category Tag (e.g. Super-Specialization)
                  </label>
                  <input
                    type="text"
                    value={item.badgeTag}
                    onChange={(e) =>
                      updateEducation(i, "badgeTag", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Highlight Badge (e.g. University Gold Medalist)
                  </label>
                  <input
                    type="text"
                    value={item.highlightBadge}
                    onChange={(e) =>
                      updateEducation(i, "highlightBadge", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    value={item.institution}
                    onChange={(e) =>
                      updateEducation(i, "institution", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Training Focus
                </label>
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    updateEducation(i, "description", e.target.value)
                  }
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Areas of Expertise Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Areas of Expertise
          </h3>
          <button
            type="button"
            onClick={addExpertise}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
          >
            <Plus className="w-4 h-4" /> Add Specialty
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Section Title
          </label>
          <input
            type="text"
            value={data.expertise.sectionTitle}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                expertise: { ...prev.expertise, sectionTitle: e.target.value },
              }))
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.expertise.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200"
            >
              <input
                type="text"
                value={item}
                onChange={(e) => updateExpertise(i, e.target.value)}
                className="w-full bg-white rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-800"
              />
              <button
                type="button"
                onClick={() => removeExpertise(i)}
                disabled={data.expertise.items.length <= 1}
                className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30"
                title="Remove specialty"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Philosophy Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          Medical Philosophy Section
        </h3>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Philosophy Section Title
          </label>
          <input
            type="text"
            value={data.philosophy.sectionTitle}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                philosophy: {
                  ...prev.philosophy,
                  sectionTitle: e.target.value,
                },
              }))
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Philosophy Quote
          </label>
          <textarea
            value={data.philosophy.quote}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                philosophy: { ...prev.philosophy, quote: e.target.value },
              }))
            }
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>
    </form>
  );
}

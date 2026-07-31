"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useToast } from "../ui/toast";

export interface PhoneEntry {
  label: string;
  number: string;
  link: string;
}

export interface ContactData {
  hero: {
    badge: string;
    title: string;
    description: string;
    bgImage: string;
  };
  location: {
    title: string;
    clinicName: string;
    addressLine1: string;
    addressLine2: string;
  };
  phones: {
    title: string;
    description: string;
    numbers: PhoneEntry[];
  };
  email: {
    title: string;
    description: string;
    address: string;
  };
  hours: {
    title: string;
    days: string;
    time: string;
    emergencyNotice: string;
  };
  appointment: {
    buttonText: string;
    link: string;
  };
  map: {
    iframeSrc: string;
  };
}

const DEFAULT_CONTACT_DATA: ContactData = {
  hero: {
    badge: "Janakpurdham, Nepal",
    title: "Contact Us",
    description:
      "We are here to answer your questions and provide the expert urological care you need. Reach out to us via phone, email, or by visiting our clinic near Dashrath Pond in Janakpur.",
    bgImage: "/images/janaki-mandir.jpg",
  },
  location: {
    title: "Location",
    clinicName: "National Urology Center",
    addressLine1: "Near Dashrath Pond, Janakpurdham-06",
    addressLine2: "Dhanusha, Madhesh Province, Nepal",
  },
  phones: {
    title: "Phone Numbers",
    description: "Call us for appointments or emergency assistance.",
    numbers: [
      {
        label: "Appointments & WhatsApp",
        number: "+977 97444-27743",
        link: "tel:+9779744427743",
      },
      {
        label: "Emergency Care",
        number: "+977 98148-34756",
        link: "tel:+9779814834756",
      },
    ],
  },
  email: {
    title: "Email",
    description: "Send us your medical reports or general inquiries.",
    address: "drarunshah24@gmail.com",
  },
  hours: {
    title: "Opening Hours",
    days: "Sunday – Saturday (Everyday)",
    time: "09:00 AM – 05:00 PM",
    emergencyNotice: "24/7 Emergency Care Available",
  },
  appointment: {
    buttonText: "Book an Appointment Now",
    link: "https://wa.me/9779744427743?text=I%20would%20like%20to%20book%20an%20appointment.",
  },
  map: {
    iframeSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.38788389595!2d85.9225219!3d26.7319955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec410043ba06c5%3A0x6fcdf05f17d769a1!2sNational%20Urology%20Center!5e0!3m2!1sen!2snp!4v1718000000000!5m2!1sen!2snp",
  },
};

export function ContactForm() {
  const [data, setData] = useState<ContactData>(DEFAULT_CONTACT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/admin/content?type=contact&_ts=" + Date.now())
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setData((prev) => ({
            ...prev,
            ...resData.data,
            hero: { ...prev.hero, ...(resData.data.hero || {}) },
            location: { ...prev.location, ...(resData.data.location || {}) },
            phones: {
              ...prev.phones,
              ...(resData.data.phones || {}),
              numbers: resData.data.phones?.numbers || prev.phones.numbers,
            },
            email: { ...prev.email, ...(resData.data.email || {}) },
            hours: { ...prev.hours, ...(resData.data.hours || {}) },
            appointment: {
              ...prev.appointment,
              ...(resData.data.appointment || {}),
            },
            map: { ...prev.map, ...(resData.data.map || {}) },
          }));
        }
      })
      .catch((err) => console.error("Failed to load contact data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", data }),
      });
      const resData = await res.json();
      if (resData.success) {
        showToast("Contact page details updated successfully!");
      } else {
        showToast(resData.error || "Failed to update Contact page.", "error");
      }
    } catch {
      showToast("Server error while saving Contact page details.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toBase64 = (f: File, maxWidth = 1600): Promise<string> =>
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
      const filename = `contact-hero-${Date.now()}.jpg`;
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename,
          base64Content: base64DataUrl,
          commitMessage: "Upload Contact page header image via Admin Portal",
        }),
      });

      const uploadRes = await res.json().catch(() => ({}));
      if (uploadRes.success && uploadRes.url) {
        setData((prev) => ({
          ...prev,
          hero: { ...prev.hero, bgImage: uploadRes.url },
        }));
        showToast("Header background image uploaded!");
      } else {
        showToast(
          "Image upload failed: " + (uploadRes.error || "Unknown"),
          "error",
        );
      }
    } catch {
      showToast("Error uploading header image file.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Phone Helpers
  const addPhone = () => {
    setData((prev) => ({
      ...prev,
      phones: {
        ...prev.phones,
        numbers: [
          ...prev.phones.numbers,
          {
            label: "Clinic Desk",
            number: "+977 98000-00000",
            link: "tel:+9779800000000",
          },
        ],
      },
    }));
  };

  const updatePhone = (
    index: number,
    field: keyof PhoneEntry,
    value: string,
  ) => {
    setData((prev) => {
      const updated = [...prev.phones.numbers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, phones: { ...prev.phones, numbers: updated } };
    });
  };

  const removePhone = (index: number) => {
    setData((prev) => ({
      ...prev,
      phones: {
        ...prev.phones,
        numbers: prev.phones.numbers.filter((_, i) => i !== index),
      },
    }));
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
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Contact Page Editor
            </h2>
            <p className="text-xs text-slate-500">
              Manage location, phone numbers, hours, email, and Google maps
              embed.
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
              <span>Save Contact Page</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Hero Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Header & Hero Section
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Badge Label
            </label>
            <input
              type="text"
              value={data.hero.badge}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, badge: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Header Title
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

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Header Subtitle / Description
          </label>
          <textarea
            value={data.hero.description}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                hero: { ...prev.hero, description: e.target.value },
              }))
            }
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 text-sm focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Header Background Image URL
            </label>
            <input
              type="text"
              value={data.hero.bgImage}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, bgImage: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none mb-3"
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleBgUpload}
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
                  <span>Upload Header Image</span>
                </>
              )}
            </label>
          </div>

          <div className="flex items-center justify-center p-3 border border-slate-200 rounded-2xl bg-slate-50">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <Image
                src={data.hero.bgImage || "/images/janaki-mandir.jpg"}
                alt="Contact Header Background"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Location & Address Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Clinic Location & Address
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Section Title
            </label>
            <input
              type="text"
              value={data.location.title}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  location: { ...prev.location, title: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Clinic Name
            </label>
            <input
              type="text"
              value={data.location.clinicName}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  location: { ...prev.location, clinicName: e.target.value },
                }))
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Address Line 1 (Landmark / Street)
            </label>
            <input
              type="text"
              value={data.location.addressLine1}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  location: { ...prev.location, addressLine1: e.target.value },
                }))
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Address Line 2 (City / Province / Country)
            </label>
            <input
              type="text"
              value={data.location.addressLine2}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  location: { ...prev.location, addressLine2: e.target.value },
                }))
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Phone Numbers Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            Phone Numbers & Contact Lines
          </h3>
          <button
            type="button"
            onClick={addPhone}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
          >
            <Plus className="w-4 h-4" /> Add Phone Line
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Section Title
            </label>
            <input
              type="text"
              value={data.phones.title}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  phones: { ...prev.phones, title: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={data.phones.description}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  phones: { ...prev.phones, description: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          {data.phones.numbers.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Phone Line #{i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removePhone(i)}
                  disabled={data.phones.numbers.length <= 1}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline disabled:opacity-30"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Label (e.g. Appointments & WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updatePhone(i, "label", e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Number (e.g. +977 97444-27743)
                  </label>
                  <input
                    type="text"
                    value={item.number}
                    onChange={(e) => updatePhone(i, "number", e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dial Link (e.g. tel:+9779744427743)
                  </label>
                  <input
                    type="text"
                    value={item.link}
                    onChange={(e) => updatePhone(i, "link", e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Email, Hours & Appointment Links */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Email, Opening Hours & Booking Link
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Clinic Email Address
            </label>
            <input
              type="email"
              value={data.email.address}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  email: { ...prev.email, address: e.target.value },
                }))
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Opening Days Text
            </label>
            <input
              type="text"
              value={data.hours.days}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hours: { ...prev.hours, days: e.target.value },
                }))
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Opening Hours Text
            </label>
            <input
              type="text"
              value={data.hours.time}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hours: { ...prev.hours, time: e.target.value },
                }))
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Emergency Care Notice
            </label>
            <input
              type="text"
              value={data.hours.emergencyNotice}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hours: { ...prev.hours, emergencyNotice: e.target.value },
                }))
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Appointment Button Text
            </label>
            <input
              type="text"
              value={data.appointment.buttonText}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  appointment: {
                    ...prev.appointment,
                    buttonText: e.target.value,
                  },
                }))
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Appointment Booking / WhatsApp URL
            </label>
            <input
              type="text"
              value={data.appointment.link}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  appointment: { ...prev.appointment, link: e.target.value },
                }))
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Map Embed */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Google Maps Embed iFrame Link
        </h3>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Embed URL (src attribute)
          </label>
          <input
            type="text"
            value={data.map.iframeSrc}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                map: { ...prev.map, iframeSrc: e.target.value },
              }))
            }
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 text-xs font-mono focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>
    </form>
  );
}

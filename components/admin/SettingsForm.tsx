"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserCheck, RefreshCw, Save, Upload } from "lucide-react";
import { useToast } from "../ui/toast";

interface SettingsFormProps {
  siteSettings: { doctorName: string; subtitle: string };
  setSiteSettings: React.Dispatch<
    React.SetStateAction<{ doctorName: string; subtitle: string }>
  >;
  heroPhotoPreviewUrl: string;
  setHeroPhotoPreviewUrl: React.Dispatch<React.SetStateAction<string>>;
  heroPhotoTimestamp: number;
  setHeroPhotoTimestamp: React.Dispatch<React.SetStateAction<number>>;
}

export function SettingsForm({
  siteSettings,
  setSiteSettings,
  heroPhotoPreviewUrl,
  setHeroPhotoPreviewUrl,
  heroPhotoTimestamp,
  setHeroPhotoTimestamp,
}: SettingsFormProps) {
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "settings", settings: siteSettings }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Homepage settings updated successfully.");
      } else {
        showToast(data.error || "Failed to update settings.", "error");
      }
    } catch {
      showToast("Server error while saving settings.", "error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

            // Compress heavily to stay under Vercel 4.5MB payload limit
            resolve(canvas.toDataURL("image/jpeg", 0.75));
          };
          img.onerror = reject;
          if (event.target?.result) {
            img.src = event.target.result as string;
          }
        };
        reader.onerror = reject;
      });

    try {
      const base64DataUrl = await toBase64(file);
      const filename = "dr-arun-shah-urologist-janakpur.jpg";

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename,
          base64Content: base64DataUrl,
          commitMessage: `Upload hero image via Admin Portal`,
        }),
      });

      const rawText = await res.text();
      let data: {
        success?: boolean;
        error?: string;
        rawUrl?: string;
        url?: string;
      } = { success: false, error: rawText || "Server error" };
      try {
        data = JSON.parse(rawText);
      } catch {}

      if (data.success) {
        setHeroPhotoTimestamp(Date.now());
        if (data.rawUrl) {
          setHeroPhotoPreviewUrl(data.rawUrl);
        } else if (data.url) {
          setHeroPhotoPreviewUrl(`${data.url}?_ts=${Date.now()}`);
        }
        showToast(
          "Doctor Photo updated! Changes will be live in 1-2 mins.",
          "success",
        );
      } else {
        showToast("Upload failed: " + (data.error || "Unknown error"), "error");
      }
    } catch {
      showToast("Failed to upload image.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Homepage Settings
            </h2>
            <p className="text-sm text-slate-600">
              Manage the main text and hero photograph displayed on the home
              page.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <form
            onSubmit={handleSaveSettings}
            className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6"
          >
            <h3 className="mb-2 font-semibold text-slate-900">
              Title & Subtitle
            </h3>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Doctor Name (Main Title)
              </label>
              <input
                type="text"
                value={siteSettings.doctorName}
                onChange={(e) =>
                  setSiteSettings((s) => ({ ...s, doctorName: e.target.value }))
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Subtitle
              </label>
              <input
                type="text"
                value={siteSettings.subtitle}
                onChange={(e) =>
                  setSiteSettings((s) => ({ ...s, subtitle: e.target.value }))
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
              >
                {isSavingSettings ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mb-6 grid grid-cols-1 items-center gap-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Current Live Homepage Portrait
              </p>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
                <Image
                  src={
                    heroPhotoPreviewUrl ||
                    `/dr-arun-shah-urologist-janakpur.jpg?t=${heroPhotoTimestamp}`
                  }
                  alt="Dr. Arun Shah"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-slate-700">
                Select a high-resolution JPG or PNG image. The photo will
                automatically update across the 1st page Hero section.
              </p>

              <label className="block w-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-md transition hover:bg-blue-700">
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Uploading & Replacing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span>Upload New Photo</span>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

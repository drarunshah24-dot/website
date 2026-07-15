"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, Save, Image as ImageIcon } from "lucide-react";
import { AdminSection } from "./AdminNav";
import { ContentItem } from "./ContentList";
import { useToast } from "../ui/toast";

interface ContentEditorProps {
  activeSection: AdminSection;
  currentItem: ContentItem;
  setCurrentItem: React.Dispatch<React.SetStateAction<ContentItem>>;
  setActiveTab: React.Dispatch<React.SetStateAction<"list" | "editor">>;
  loadItems: () => Promise<void>;
}

export default function ContentEditor({
  activeSection,
  currentItem,
  setCurrentItem,
  setActiveTab,
  loadItems,
}: ContentEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const toBase64 = (f: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

    try {
      const base64DataUrl = await toBase64(file);
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase()}`;

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename,
          base64Content: base64DataUrl,
          commitMessage: `Upload image: ${filename} via Admin Portal`,
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
        setCurrentItem((prev) => ({
          ...prev,
          image: data.rawUrl ? data.rawUrl : data.url ? data.url : "",
        }));
        showToast("Image uploaded successfully!", "success");
      } else {
        showToast("Upload failed: " + (data.error || "Unknown error"), "error");
      }
    } catch (err) {
      showToast("Failed to upload image.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem.title) {
      showToast("Please enter a title.", "error");
      return;
    }

    const autoSlug =
      currentItem.slug ||
      currentItem.title
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeSection,
          ...currentItem,
          slug: autoSlug,
        }),
      });
      const data = await res.json();

      if (data.success) {
        showToast("Saved successfully!", "success");
        await loadItems();
        setTimeout(() => {
          setActiveTab("list");
        }, 1200);
      } else {
        showToast("Save failed: " + (data.error || "Unknown error"), "error");
      }
    } catch (err) {
      showToast("Failed to save.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setActiveTab("list")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </button>
      </div>

      <form onSubmit={handleSaveItem} className="space-y-6">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Title *
            </label>
            <input
              type="text"
              required
              value={currentItem.title}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, title: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {(activeSection === "blog" ||
            activeSection === "treatments" ||
            activeSection === "conditions" ||
            activeSection === "faq") && (
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </label>
              <input
                type="text"
                value={currentItem.category || ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, category: e.target.value })
                }
                placeholder={
                  activeSection === "faq"
                    ? "e.g., Surgery, Appointments, Symptoms"
                    : "e.g., Laser Urology, Kidney Health"
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              />
            </div>
          )}

          {activeSection !== "faq" && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Photo / Cover Image
              </label>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                {currentItem.image ? (
                  <img
                    src={currentItem.image}
                    alt="Preview"
                    className="h-20 w-20 rounded-xl border border-slate-300 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-200 text-slate-400">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                )}
                <div className="w-full flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={currentItem.image || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          image: e.target.value,
                        })
                      }
                      placeholder="/uploads/my-photo.jpg"
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-mono text-sm"
                    />
                    <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700">
                      <Upload className="h-3.5 w-3.5" />
                      <span>
                        {isUploading ? "Uploading..." : "Upload Photo"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-500">
                    Upload any JPG or PNG photo directly from your device or
                    paste an image URL.
                  </p>
                </div>
              </div>
            </div>
          )}

          {(activeSection === "books" ||
            activeSection === "treatments" ||
            activeSection === "conditions") && (
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                {activeSection === "books"
                  ? "Short Description"
                  : "Summary / Brief Overview"}
              </label>
              <textarea
                rows={3}
                value={currentItem.description || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    description: e.target.value,
                  })
                }
                placeholder={
                  activeSection === "books"
                    ? "Summary of publication or book..."
                    : "Concise summary that appears on cards and search..."
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm"
              />
            </div>
          )}

          {activeSection !== "books" && activeSection !== "gallery" && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {activeSection === "faq"
                    ? "FAQ Answer (Markdown or Text)"
                    : "Article / Guide Detailed Markdown Body"}
                </label>
              </div>
              <textarea
                rows={12}
                value={currentItem.body}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, body: e.target.value })
                }
                placeholder="Write your content here..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm shadow-inner focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <p className="mt-2 text-xs text-slate-500">
                You can use standard Markdown formatting (*italic*, **bold**, #
                headings, - lists).
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className="rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save Item"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

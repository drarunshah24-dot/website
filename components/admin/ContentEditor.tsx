"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Globe,
  FileText,
  Search,
} from "lucide-react";
import { AdminSection } from "./AdminNav";
import { ContentItem } from "./ContentList";
import { useToast } from "../ui/toast";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false },
);

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
  const [activePanel, setActivePanel] = useState<"content" | "seo">("content");
  const { showToast } = useToast();

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
    } catch {
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
        showToast(
          "Oops! We couldn't save that right now: " +
            (data.error || "Unknown error"),
          "error",
        );
      }
    } catch {
      showToast(
        "Oops! We couldn't save that right now. Please check your internet and try again.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setActiveTab("list")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </button>

        {/* Draft Mode Toggle */}
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <span className="text-sm font-medium text-slate-700">Status:</span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={!currentItem.draft}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, draft: !e.target.checked })
              }
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300"></div>
            <span className="ml-3 text-sm font-semibold text-slate-900">
              {currentItem.draft ? "Draft (Hidden)" : "Published (Live)"}
            </span>
          </label>
        </div>
      </div>

      <form onSubmit={handleSaveItem} className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActivePanel("content")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
              activePanel === "content"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="h-4 w-4" />
            Content Editor
          </button>
          <button
            type="button"
            onClick={() => setActivePanel("seo")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
              activePanel === "seo"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Search className="h-4 w-4" />
            SEO Engine
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {/* CONTENT PANEL */}
          <div
            className={activePanel === "content" ? "block space-y-6" : "hidden"}
          >
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Headline / Title *
              </label>
              <input
                type="text"
                required
                value={currentItem.title}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, title: e.target.value })
                }
                placeholder="Type the title of your post here..."
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
                  Cover Image
                </label>
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  {currentItem.image ? (
                    <div className="relative h-24 w-32 overflow-hidden rounded-xl border border-slate-300 shadow-sm">
                      <Image
                        src={currentItem.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-24 w-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 text-slate-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  <div className="w-full flex-1 space-y-3">
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
                      <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700">
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
                      Upload a high-quality photo to display at the top of your
                      article.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection !== "books" && activeSection !== "gallery" && (
              <div data-color-mode="light">
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Write Your Content
                </label>
                <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                  <MDEditor
                    value={currentItem.body}
                    onChange={(val) =>
                      setCurrentItem({ ...currentItem, body: val || "" })
                    }
                    preview="edit"
                    height={400}
                    className="w-full"
                    textareaProps={{
                      placeholder: "Start writing your content here...",
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Use the toolbar above to make text bold, italic, or create
                  lists.
                </p>
              </div>
            )}
          </div>

          {/* SEO PANEL */}
          <div className={activePanel === "seo" ? "block space-y-8" : "hidden"}>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-blue-900">
                <Search className="h-5 w-5" /> Live Google Preview
              </h3>
              <p className="mb-6 text-sm text-blue-700">
                This is exactly how your article will look when patients search
                for it on Google.
              </p>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm max-w-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-700">
                    drarunshah.com.np &gt; {activeSection}
                  </span>
                </div>
                <div className="text-xl text-blue-600 hover:underline cursor-pointer mb-1 truncate">
                  {currentItem.seoTitle ||
                    currentItem.title ||
                    "Your SEO Title Goes Here"}
                </div>
                <div className="text-sm text-slate-600 line-clamp-2">
                  {currentItem.seoDescription ||
                    currentItem.description ||
                    "Your SEO Description goes here. Write a compelling summary that encourages patients to click and read more about your services."}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    SEO Title
                  </label>
                  <span
                    className={`text-xs font-bold ${(currentItem.seoTitle || "").length > 60 ? "text-red-500" : "text-emerald-600"}`}
                  >
                    {(currentItem.seoTitle || "").length} / 60 characters
                  </span>
                </div>
                <input
                  type="text"
                  value={currentItem.seoTitle || ""}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, seoTitle: e.target.value })
                  }
                  placeholder={
                    currentItem.title || "Write a catchy SEO title..."
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    SEO Description (Meta Description)
                  </label>
                  <span
                    className={`text-xs font-bold ${(currentItem.seoDescription || currentItem.description || "").length > 160 ? "text-red-500" : "text-emerald-600"}`}
                  >
                    {
                      (
                        currentItem.seoDescription ||
                        currentItem.description ||
                        ""
                      ).length
                    }{" "}
                    / 160 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={
                    currentItem.seoDescription !== undefined
                      ? currentItem.seoDescription
                      : currentItem.description || ""
                  }
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      seoDescription: e.target.value,
                    })
                  }
                  placeholder="Summarize the page for Google..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
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
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>
                    {currentItem.draft ? "Save Draft" : "Publish to Live Site"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

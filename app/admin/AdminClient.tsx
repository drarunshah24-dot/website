"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { AdminNav, AdminSection } from "@/components/admin/AdminNav";
import { LoginForm } from "@/components/admin/LoginForm";
import { ContentList, ContentItem } from "@/components/admin/ContentList";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ToastProvider } from "@/components/ui/toast";

const ContentEditor = dynamic(
  () => import("@/components/admin/ContentEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    ),
  },
);

export function AdminClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("blog");
  const [activeTab, setActiveTab] = useState<"list" | "editor">("list");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  // Settings State
  const [siteSettings, setSiteSettings] = useState({
    doctorName: "Dr. Arun Shah",
    subtitle: "Senior Urologist & Gold Medalist",
  });
  const [heroPhotoTimestamp, setHeroPhotoTimestamp] = useState(1);
  const [heroPhotoPreviewUrl, setHeroPhotoPreviewUrl] = useState("");

  const [currentItem, setCurrentItem] = useState<ContentItem>({
    slug: "",
    title: "",
    date: new Date().toISOString().split("T")[0],
    author: "Dr. Arun Shah",
    category: "General Urology",
    draft: false,
    image: "",
    description: "",
    body: "",
  });

  // Check initial auth state on mount
  useEffect(() => {
    fetch("/api/admin/content?type=blog&_ts=" + Date.now())
      .then((res) => {
        if (res.status === 401) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const loadItems = async (section = activeSection) => {
    setIsLoadingItems(true);
    try {
      const res = await fetch(
        `/api/admin/content?type=${section}&_ts=${Date.now()}`,
        {
          cache: "no-store",
        },
      );
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        if (section === "settings" && data.settings) {
          setSiteSettings({
            doctorName: data.settings.doctorName || "Dr. Arun Shah",
            subtitle:
              data.settings.subtitle || "Senior Urologist & Gold Medalist",
          });
          if (data.settings.heroDoctorPhoto) {
            setHeroPhotoPreviewUrl(data.settings.heroDoctorPhoto);
          }
        } else {
          setItems(data.items || []);
        }
      }
    } catch (err) {
      console.error("Failed to load content:", err);
    } finally {
      setIsLoadingItems(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadItems(activeSection);
      if (activeSection !== "settings") {
        setActiveTab("list");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeSection]);

  const handleCreateNew = () => {
    const today = new Date().toISOString().split("T")[0];
    setCurrentItem({
      slug: "",
      title: "",
      date: today,
      author: "Dr. Arun Shah",
      category:
        activeSection === "books"
          ? "Urology Guide"
          : activeSection === "gallery"
            ? "Facility"
            : activeSection === "treatments"
              ? "Surgical Procedure"
              : activeSection === "conditions"
                ? "Patient Guide"
                : activeSection === "faq"
                  ? "General FAQ"
                  : "General Urology",
      draft: false,
      image: "",
      description: "",
      body: "",
    });
    setActiveTab("editor");
  };

  const handleEdit = (item: ContentItem) => {
    setCurrentItem({ ...item });
    setActiveTab("editor");
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(
        `/api/admin/content?type=${activeSection}&slug=${encodeURIComponent(slug)}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setItems(items.filter((i) => i.slug !== slug));
      } else {
        alert("Delete failed.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSignOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <AdminNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onSignOut={handleSignOut}
        />
        <main className="container mx-auto flex-1 px-4 py-8 md:px-6">
          {activeSection === "settings" ? (
            <SettingsForm
              siteSettings={siteSettings}
              setSiteSettings={setSiteSettings}
              heroPhotoPreviewUrl={heroPhotoPreviewUrl}
              setHeroPhotoPreviewUrl={setHeroPhotoPreviewUrl}
              heroPhotoTimestamp={heroPhotoTimestamp}
              setHeroPhotoTimestamp={setHeroPhotoTimestamp}
            />
          ) : activeTab === "list" ? (
            <ContentList
              activeSection={activeSection}
              items={items}
              isLoadingItems={isLoadingItems}
              loadItems={loadItems}
              handleCreateNew={handleCreateNew}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ) : (
            <Suspense fallback={<div>Loading editor...</div>}>
              <ContentEditor
                activeSection={activeSection}
                currentItem={currentItem}
                setCurrentItem={setCurrentItem}
                setActiveTab={setActiveTab}
                loadItems={loadItems}
              />
            </Suspense>
          )}
        </main>
      </div>
    </ToastProvider>
  );
}

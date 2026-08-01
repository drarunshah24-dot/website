# 🎯 ACTION PLAN — SEO Roadmap for Dr. Arun Shah Website

**Website**: [https://drarunshah.com.np](https://drarunshah.com.np)  
**Goal**: Maintain Top 1 Ranking for Urologists in Janakpur & Madhesh Province, Nepal

---

## 📌 Phase 1: Immediate Launch Checklist (Done)
- [x] **Verify Dynamic XML Sitemap (`/sitemap.xml`)**: Ensures Google indexes `/about`, `/contact`, `/treatments`, `/conditions`, `/blog`, and `/books`.
- [x] **Verify Robots.txt (`/robots.txt`)**: Allows Googlebot, Bingbot, and AI Search Crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`).
- [x] **Verify Schema.org Markup**: `Physician`, `MedicalClinic`, and `Article` JSON-LD schemas active.
- [x] **Verify AI Search Card (`/llms.txt`)**: Complete machine-readable profile for Answer Engines (Perplexity, ChatGPT Search, Claude).

---

## 🚀 Phase 2: Ongoing Growth & Local SEO Steps (For Dr. Arun Shah)

### 1. Google Business Profile (GBP) Synchronization
- **Action**: Ensure the Google Business Profile name matches **"National Urology Center - Dr. Arun Shah"**.
- **NAP Consistency**: Verify Address (*Near Dashrath Pond, Janakpurdham-06*), Phone (*+977-9814834756* / *+977-9744427743*), and Website URL (*https://drarunshah.com.np*) match the exact text on the Contact Page.

### 2. High-Intent Patient Blog Posts (Monthly)
- **Action**: Write 1-2 short patient awareness articles each month using the Admin Panel (`/admin`).
- **Recommended Topics**:
  - *"Laser Surgery for Kidney Stones (RIRS & HoLEP) in Janakpur"*
  - *"Early Warning Signs of Enlarged Prostate (BPH) and Modern Treatments"*
  - *"Preventing Recurrent UTIs & Kidney Stones in Hot Climates"*

### 3. Image Optimization Best Practice
- **Action**: When uploading photos via the Admin Panel, use standard JPEG or WEBP formats under 1MB for fastest loading speeds.

---

## 🛠️ Verification Commands

```bash
# Verify build & SEO page generation
npm run build

# Test sitemap & robots locally
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/robots.txt
curl http://localhost:3000/llms.txt
```

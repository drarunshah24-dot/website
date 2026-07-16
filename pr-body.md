## Overview
This PR completes the comprehensive overhaul of the Administration Panel. It transitions the previously monolithic `AdminClient.tsx` file into a modular, maintainable component-based architecture. Additionally, it fundamentally secures the authentication mechanism by replacing plaintext state tokens with secure HttpOnly session cookies. 

## 🛠 Component Extraction & Refactoring
The massive 1,100+ line `AdminClient.tsx` has been decoupled into single-responsibility components under `components/admin/`:
- **`AdminNav.tsx`**: Handles sidebar navigation and logout.
- **`ContentList.tsx`**: Displays content cards, handles search, and item management.
- **`ContentEditor.tsx`**: Provides the UI for creating and editing markdown content and uploading images.
- **`SettingsForm.tsx`**: Specifically handles homepage configuration and doctor profile settings.
- **`LoginForm.tsx`**: Encapsulates the authentication UI.
- **`Toast.tsx`**: A new reusable notification system for UX feedback.

## 🔒 Security & Hardening
- **HttpOnly Session Cookies**: Removed the vulnerable plaintext `adminToken` React state. Authentication is now handled server-side using secure, HttpOnly, SameSite cookies (`admin_session`) via Next.js `cookies()`. This prevents XSS attacks from extracting the token and ensures the user stays logged in across page refreshes.
- **Dedicated Auth Routes**: Added standard `/api/admin/login` and `/api/admin/logout` edge-compatible API routes.
- **Removed Dead Code**: Permanently deleted the insecure, unused `app/api/admin/posts/route.ts` API route which was incompatible with Cloudflare Pages and posed a security risk.

## ⚡ Performance Optimizations
- **Lazy Loading**: The heavy `ContentEditor` component (which includes the markdown parser) is now dynamically imported (`next/dynamic`) with `ssr: false`. It only loads the JS bundle when the user explicitly clicks "Add" or "Edit," keeping the initial admin dashboard load instantaneous.

## ✨ UX & Quality
- **Global Toast Notifications**: Implemented a non-blocking toast notification system to give the doctor clear visual feedback ("Saved successfully", "Image uploaded", "Login failed").
- **Error Observability**: Instrumented the new API routes with `console.error` logging in `catch` blocks to provide trace visibility for debugging authentication failures.

*All TypeScript and ESLint warnings have been resolved, and the Next.js compilation succeeds.*

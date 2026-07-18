# ADR-003: Hardening Authentication and Session Management

## Status
Accepted

## Date
2026-07-18

## Context
The previous authentication system used standard persistent cookies or localStorage to store the admin session. This led to two significant issues:
1. **Browser Closing Issue:** Because localStorage or persistent cookies persist across browser restarts, closing the browser did not force a re-authentication, leaving the admin session exposed if someone else used the computer.
2. **Multi-Device / Concurrent Login Issue:** There was no tracking of active sessions, meaning the admin could be logged in from multiple devices simultaneously, which increases the attack surface and potential for conflicting edits.

Additionally, the system needed robust defenses against brute-force attacks and DDOS protection.

## Decision
1. **Session-Only Storage:** We switched the authentication tokens to session cookies that are wiped when the browser is closed, strictly enforcing re-authentication on reopen.
2. **Single Active Session via Redis:** We introduced a Redis-based session tracker (`@upstash/redis`) to store a single active session ID for the admin. When a new login request is successful, the older session is immediately invalidated (kicked out).
3. **Stateless Fallback with SHA-256:** Implemented a stateless fallback mechanism using SHA-256 password hashing to securely verify tokens.
4. **Rate Limiting:** Integrated `@upstash/ratelimit` on authentication and API routes to protect the system from brute-force and DDOS attacks.

## Consequences
- The admin is automatically logged out when the browser is completely closed.
- Only one person can be logged in as admin at a time, preventing concurrent modifications and securing the single admin account.
- Redis (Upstash) is now a strict dependency for session tracking and rate limiting.
- The authentication module is significantly more robust and aligns with enterprise security practices.

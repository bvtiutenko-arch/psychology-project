# TASKS.md — Psychological Self-Tracking App

## Project Overview
React + TypeScript + Vite PWA with Firebase backend for psychological self-tracking.
Core features: Causal Matrix, Tomorrow Box, Experiments, Night Mode, Analytics, Grounding Exercises, Offline Sync.

---

## Phase 1 — Project Setup & Infrastructure
- [x] Initialize Vite + React + TypeScript project
- [x] Configure Tailwind CSS, PostCSS
- [x] Configure Firebase (firestore.rules, firebase.json, .firebaserc)
- [x] Set up tsconfig (app, node, base)
- [x] Create .env.example with required env vars
- [x] Set up .gitignore
- [x] Configure oxlinter (.oxlintrc.json)
- [x] Create PWA manifest, service worker, offline page
- [x] Set up deploy.js script
- [x] Create agent/supervisor shell scripts

## Phase 2 — Core Types & Data Layer
- [x] Define causal types (src/types/causal.ts)
- [x] Define tomorrowBox types (src/types/tomorrowBox.ts)
- [x] Define experiments types (src/types/experiments.ts)
- [x] Define nightMode types (src/types/nightMode.ts)
- [x] Implement Firebase initialization (src/firebase.ts)
- [x] Implement database service layer (src/services/db.ts)
- [x] Implement offline sync service (src/services/offlineSync.ts)
- [x] Implement auth hook (src/hooks/useAuth.ts)

## Phase 3 — Causal Engine & Pattern Detection
- [x] Implement causal engine (src/services/causalEngine.ts)
- [x] Implement pattern engine (src/services/patternEngine.ts)
- [x] Write causal engine tests (src/services/causalEngine.test.ts)
- [x] Implement metrics library (src/lib/metrics.ts)
- [ ] Review & validate causal engine algorithm correctness
- [ ] Add edge-case tests for pattern engine
- [ ] Add integration tests for causal → pattern pipeline

## Phase 4 — UI Components
- [x] Build auth Login component
- [x] Build BottomNav navigation
- [x] Build Onboarding flow
- [x] Build Dashboard
- [x] Build History view
- [x] Build Experiments view
- [x] Build Analytics view
- [x] Build TomorrowBox component
- [x] Build Settings view
- [x] Build NightMode component
- [x] Build GroundingExercise component
- [x] Build ConnectionMap component
- [x] Build CausalMatrixForm component
- [x] Build UI primitives (SelectField, Spinner, ErrorBoundary)
- [x] Build public Landing page
- [x] Build LegalPages component
- [ ] Review all components for accessibility (ARIA, keyboard nav)
- [ ] Add loading & error states to all async components
- [ ] Add responsive mobile-first layout audit

## Phase 5 — App Shell & Routing
- [x] Create App.tsx main shell
- [x] Create App.css global styles
- [x] Create index.css with Tailwind directives
- [x] Create main.tsx entry point
- [x] Create service-worker.ts
- [x] Create date utility (src/utils/date.ts)
- [ ] Implement proper routing (React Router or custom)
- [ ] Add protected route guards
- [ ] Add deep linking support

## Phase 6 — Offline & PWA
- [x] Create public/sw.js service worker
- [x] Create public/offline.html fallback
- [x] Create public/manifest.json
- [x] Implement offlineSync service
- [ ] Test offline data sync conflict resolution
- [ ] Add background sync support
- [ ] Add push notification support
- [ ] Verify install prompt flow

## Phase 7 — Firebase Backend
- [x] Configure firestore.rules
- [x] Configure firebase.json hosting & functions
- [ ] Deploy & verify Firestore security rules
- [ ] Add Firebase Cloud Functions if needed
- [ ] Set up Firebase Auth providers (email, Google)
- [ ] Configure Firebase Analytics & Crashlytics

## Phase 8 — Testing & Quality
- [x] Set up causal engine unit tests
- [ ] Set up Vitest/Jest test runner config
- [ ] Add component tests (React Testing Library)
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Set up CI/CD pipeline
- [ ] Add linting to CI (oxlint + eslint)
- [ ] Add type checking to CI

## Phase 9 — Polish & Launch
- [ ] Add app icons (public/icons.svg → PNG set)
- [ ] Add favicon optimization
- [ ] Add SEO meta tags & OpenGraph
- [ ] Add app store metadata
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (axe)
- [ ] Security audit (Firebase rules, XSS)
- [ ] Write user documentation
- [ ] Final production deploy

## Phase 10 — Post-Launch
- [ ] Add data export/import feature
- [ ] Add account deletion flow (GDPR)
- [ ] Add multi-language support (i18n)
- [ ] Add dark mode theme toggle
- [ ] Add reminder notifications
- [ ] Add social sharing (anonymous insights)

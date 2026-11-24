# TECHNOLOGY STACK

# Professional ERP & Business Management Platform

## 1. PURPOSE

This document defines the preferred technology stack for the ERP platform.

The stack must prioritize:

* stability
* maintainability
* performance
* security
* developer productivity
* open-source/free technologies where practical
* long-term ecosystem support
* JavaScript compatibility
* future mobile compatibility

Technology choices must not be changed casually.

If a technology must be replaced, the reason must be documented.

---

# 2. PRIMARY TECHNOLOGY PRINCIPLE

The project shall use:

# JavaScript

TypeScript is NOT part of the current project requirements.

Do not automatically convert JavaScript files to TypeScript.

---

# 3. FRONTEND

## Required Core Technologies

Use:

* React
* Next.js
* JavaScript
* HTML
* CSS

Next.js should provide the primary web application framework.

---

# 4. NEXT.JS

Next.js should be used for:

* routing
* layouts
* application pages
* server rendering where useful
* SEO/public pages where useful
* API/server capabilities where appropriate
* code splitting
* asset optimization

Do not use Next.js features merely because they exist.

Choose rendering strategies according to the actual page requirements.

---

# 5. REACT

React should be used for:

* reusable UI components
* interactive interfaces
* forms
* dashboards
* tables
* client-side interactions
* complex application views

Components should remain focused and reusable.

Avoid giant page components.

---

# 6. CSS

The project must use custom CSS architecture.

# TAILWIND CSS IS PROHIBITED.

Do not install or introduce Tailwind CSS.

Use:

* CSS variables
* CSS Modules where useful
* global styles
* component styles
* design tokens
* utility classes only where they are genuinely useful and maintainable

---

# 7. DESIGN TOKEN SYSTEM

All important visual values should be centralized.

Tokens should cover:

* colors
* typography
* spacing
* radius
* shadows
* borders
* z-index
* motion
* breakpoints
* component dimensions

Example conceptual structure:

```css
:root {
  --color-primary-500: ...;
  --color-surface-100: ...;
  --color-text-primary: ...;

  --space-1: ...;
  --space-2: ...;

  --radius-sm: ...;
  --radius-md: ...;

  --shadow-sm: ...;

  --motion-fast: ...;
}
```

Exact values belong to the design system specification.

---

# 8. UI COMPONENTS

The application should use accessible component primitives where appropriate.

Potential technologies include:

* Radix UI
* React Aria
* Headless UI-style primitives
* custom accessible components

Do not blindly install a complete UI framework if it prevents the distinctive design required by the product.

The final component system should look like one coherent ERP product.

---

# 9. ICONS

Use a consistent icon system.

Potential options include:

* Lucide
* other permissively licensed/open-source icon libraries

Do not mix many unrelated icon styles.

Icons must have consistent:

* stroke style
* visual weight
* size
* alignment

---

# 10. ANIMATION

Animation should use a professional React-compatible animation system.

Potential options:

* Motion for React
* CSS transitions
* CSS keyframes
* Web Animations API

Use JavaScript animation libraries only where they provide meaningful value.

Do not make the entire ERP dependent on heavy animation.

---

# 11. ADVANCED VISUAL MOTION

For selected marketing/public-facing experiences, advanced technologies may be considered:

* Three.js
* React Three Fiber
* WebGL
* Lottie
* SVG animation

These should be used selectively.

The core ERP workspace should remain lightweight.

---

# 12. SMOOTH SCROLLING

Smooth scrolling libraries may be used on:

* public marketing pages
* landing pages
* documentation
* promotional experiences

Do not force smooth scrolling onto dense ERP workflows where it could reduce usability.

---

# 13. STATE MANAGEMENT

Separate server state from local UI state.

Potential technologies:

### Server state

* TanStack Query

### Local/client state

* Zustand
* React state
* Context where appropriate

Redux Toolkit may be used if the application reaches a level of state complexity where it provides clear value.

Do not introduce multiple global state libraries unnecessarily.

---

# 14. FORM MANAGEMENT

Forms should use a reusable form architecture.

Potential technology:

* React Hook Form

The form system should support:

* validation
* dynamic fields
* conditional fields
* custom fields
* error handling
* autosave
* draft states

---

# 15. VALIDATION

Validation should exist on:

* frontend
* backend
* database

A JavaScript-compatible validation library may be used.

Potential technology:

* Zod

The final implementation must not depend solely on browser-side validation.

---

# 16. BACKEND

Use:

# Node.js

The backend must remain JavaScript-based.

Potential frameworks:

* Fastify
* Express
* NestJS

The chosen framework should provide:

* routing
* middleware
* validation integration
* authentication support
* error handling
* observability
* scalable project structure

---

# 17. BACKEND FRAMEWORK PRINCIPLE

Do not select a framework based solely on popularity.

The selected backend framework must support:

* modular architecture
* dependency management
* testing
* security
* validation
* API development
* background processing
* maintainability

---

# 18. DATABASE

Primary database:

# PostgreSQL

PostgreSQL should be the authoritative relational data store.

Use it for:

* users
* organizations
* products
* customers
* suppliers
* inventory
* sales
* purchases
* accounting
* HR
* projects
* workflows
* configuration

---

# 19. ORM / DATABASE ACCESS

A professional database access layer should be used.

Potential options:

* Prisma
* Drizzle
* Knex
* node-postgres

The final choice should be based on:

* JavaScript support
* migration quality
* query control
* performance
* maintainability
* transaction support

Do not hide important business-critical queries behind abstractions that prevent optimization.

---

# 20. DATABASE MIGRATIONS

Database changes must be version controlled.

Never manually modify production schemas without a controlled migration process.

Every schema change should be:

* documented
* reproducible
* reversible where practical
* tested

---

# 21. REDIS

Redis may be introduced for:

* caching
* queues
* rate limiting
* background jobs
* temporary state

Redis must never become the only storage location for critical business data.

---

# 22. JOB QUEUE

Background processing should use a reliable queue system.

Potential technologies:

* BullMQ
* Redis-based job processing
* another mature open-source queue

Use background jobs for:

* emails
* reports
* imports
* exports
* document generation
* notifications
* synchronization
* scheduled automation

---

# 23. FILE STORAGE

The system should support an abstraction around file storage.

Development may use:

* local storage

Production may use:

* S3-compatible storage

Potential open-source/self-hosted storage:

* MinIO

The application should not hard-code one storage provider.

---

# 24. API STYLE

Primary API style:

# REST

APIs should support:

* versioning
* authentication
* authorization
* pagination
* filtering
* sorting
* validation
* standardized errors
* bulk operations where appropriate
* webhooks

---

# 25. API DOCUMENTATION

The API should eventually be documented using an industry-standard API specification.

Potential technology:

* OpenAPI

API documentation should be generated or maintained from the implementation where practical.

---

# 26. REAL-TIME

Potential technologies:

* WebSocket
* Socket.IO
* Server-Sent Events

Use real-time communication for:

* notifications
* live status
* job progress
* collaborative workflows
* selected dashboards

Do not use real-time connections for every feature unnecessarily.

---

# 27. OFFLINE STORAGE

Browser offline storage should use:

# IndexedDB

Potential helper libraries may be evaluated if they improve maintainability.

Offline storage must support:

* drafts
* queued operations
* cached reference data
* sync metadata

Do not store sensitive data offline without a security review.

---

# 28. PWA

The web platform should be PWA-ready.

Potential PWA functionality:

* installability
* service worker
* offline shell
* cached assets
* selected offline workflows

PWA functionality must not be confused with full native mobile applications.

---

# 29. FUTURE MOBILE

Future mobile applications may use:

# React Native

The mobile application should communicate with the same backend APIs.

Do not duplicate business logic unnecessarily between web and mobile.

---

# 30. CHARTS

Business dashboards require a professional charting solution.

Potential libraries:

* Apache ECharts
* Recharts
* Chart.js

Choose based on:

* performance
* customization
* accessibility
* bundle size
* license
* dashboard requirements

---

# 31. TABLES

ERP tables may require advanced functionality.

Potential approaches:

* custom table implementation
* TanStack Table
* virtualization libraries

Tables must support enterprise-scale datasets.

---

# 32. DATE AND TIME

Use a reliable date/time library or native APIs where sufficient.

Potential technology:

* date-fns
* Temporal when sufficiently supported/appropriate

Always store timestamps consistently.

Display dates according to user/organization locale.

---

# 33. INTERNATIONALIZATION

Potential technology:

* next-intl
* another mature i18n solution compatible with Next.js

Support:

* translations
* locale formatting
* currencies
* dates
* numbers
* RTL

---

# 34. FILE PROCESSING

Potential libraries may be used for:

* PDF generation
* spreadsheet import/export
* CSV processing
* image processing
* document previews

All dependencies must be reviewed for:

* license
* security
* maintenance
* performance

---

# 35. PDF GENERATION

The system should support server-side PDF generation for:

* invoices
* quotations
* purchase orders
* receipts
* reports
* payslips
* documents

Templates should be configurable where appropriate.

---

# 36. EXCEL / CSV

The platform should support:

* CSV import
* CSV export
* XLSX import
* XLSX export

Import processes must support validation and error reporting.

---

# 37. AUTHENTICATION

Authentication implementation should use mature security practices.

Possible approaches:

* secure session-based authentication
* OAuth/OIDC where needed
* MFA readiness
* password reset
* email verification

Do not implement custom cryptography.

---

# 38. SECURITY LIBRARIES

Use established libraries for:

* password hashing
* secure tokens
* validation
* CSRF protection
* security headers
* rate limiting

Never invent security algorithms.

---

# 39. TESTING

Recommended testing technologies:

### Unit

* Vitest or Jest

### Component

* React Testing Library

### End-to-End

* Playwright

### API

* appropriate HTTP/API test tooling

The final choice should minimize unnecessary tooling duplication.

---

# 40. LINTING AND FORMATTING

Use:

* ESLint
* Prettier

Code formatting should be consistent across the project.

---

# 41. GIT

Use Git for source control.

Recommended workflow:

* protected main branch
* feature branches
* pull requests
* code review
* automated checks

Commit messages should be meaningful.

---

# 42. CI/CD

The project should eventually support:

* automated linting
* automated tests
* build validation
* security checks
* deployment pipelines

Potential platforms may include open-source/self-hosted or free-tier options depending on project stage.

---

# 43. CONTAINERIZATION

Use:

# Docker

Docker should support:

* local development
* testing
* staging
* production deployment

The system should be reproducible across environments.

---

# 44. REVERSE PROXY

Potential technologies:

* Nginx
* Caddy
* Traefik

The selected option should support:

* HTTPS
* routing
* compression
* headers
* proxying
* deployment requirements

---

# 45. MONITORING

Potential open-source monitoring stack:

* Prometheus
* Grafana
* Loki
* OpenTelemetry

Adopt only when appropriate for the project's operational maturity.

---

# 46. ERROR TRACKING

Potential technology:

* Sentry self-hosted or appropriate free/open-source alternatives

Error tracking must not expose sensitive business information.

---

# 47. LOGGING

Application logs should use structured logging.

Logs should support:

* timestamp
* level
* service
* request ID
* organization context where safe
* event
* error details

Do not log:

* passwords
* tokens
* secrets
* sensitive personal data unnecessarily

---

# 48. SECURITY SCANNING

The development process should include:

* dependency scanning
* secret scanning
* static analysis
* vulnerability checks
* container scanning where applicable

---

# 49. LICENSE PRINCIPLE

Prefer:

* open-source
* free
* permissively licensed

technologies.

However, "free" must not be assumed to mean "free for every commercial usage."

Before production adoption, verify the current license of significant dependencies.

Avoid introducing a paid-only dependency into the core platform unless explicitly approved.

---

# 50. DEPENDENCY PRINCIPLE

Every dependency should justify its existence.

Before adding a package, evaluate:

* maintenance
* security
* license
* bundle size
* performance
* compatibility
* alternatives
* necessity

Do not install packages for trivial functionality that can be safely implemented with platform APIs.

---

# 51. FINAL RECOMMENDED STACK

Initial preferred stack:

```text
Frontend:
React
Next.js
JavaScript
Custom CSS

Backend:
Node.js
Fastify / Express / NestJS

Database:
PostgreSQL

Caching / Jobs:
Redis
BullMQ where needed

State:
TanStack Query
Zustand where needed

Forms:
React Hook Form

Validation:
Zod or equivalent

Tables:
TanStack Table or custom enterprise table layer

Charts:
Apache ECharts / Recharts / equivalent

Testing:
Vitest/Jest
React Testing Library
Playwright

API:
REST
OpenAPI

Storage:
S3-compatible abstraction
MinIO for self-hosted development/production where appropriate

Infrastructure:
Docker

Version Control:
Git

Observability:
OpenTelemetry
Prometheus
Grafana
Loki where justified

Future Mobile:
React Native
```

---

# 52. TECHNOLOGY DECISION RULE

The goal is not to use the largest number of libraries.

The goal is to build the most maintainable professional platform with the smallest sensible technology surface.

END OF TECHNOLOGY STACK

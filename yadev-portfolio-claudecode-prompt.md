# Claude Code Prompt — Yadev's Developer Portfolio (Full Build)

---

## Overview

Build a full-stack, production-ready personal portfolio website for **Yadev**, a Senior Software Engineer based in Bangalore, India. The portfolio must feel less like a resume website and more like an **interactive experience** — gamified, dopamine-driven, unpredictable in layout but coherent in identity. Every section should reward curiosity. Every click should feel like opening something, discovering something, unlocking something.

This is not a template project. It is a bespoke, engineered experience.

---

## Tech Stack

### Frontend
- **React** (Vite + React 18)
- **React Router v6** — for routing between pages
- **Framer Motion** — all animations, transitions, page-level and micro
- **Three.js / React Three Fiber** — hero section 3D or particle element
- **Tailwind CSS** — utility-first styling
- **Zustand** — lightweight client-side state management
- **TanStack Query (React Query)** — data fetching + caching from backend
- **React Hook Form + Zod** — form validation in dashboard
- **Tiptap** — rich text editor for blog posts and project descriptions
- **Recharts or D3.js** — for the Journey Tree chart
- **react-tilt** or **vanilla-tilt** — card tilt effects
- **sonner** — toast notifications
- **lucide-react** — icon set

### Backend
- **Cloudflare Workers** (free tier) — serverless API layer
- **Hono.js** — lightweight router framework for Workers
- **JWT-based auth** — simple admin authentication for the dashboard (no OAuth needed — single user)
- **Cloudflare R2** (free tier) — media uploads (images, videos)

### Database
- **MongoDB Atlas** (free M0 tier) — primary database
- **Mongoose** — ODM (used via a Node-compatible adapter or direct driver in Workers)

> Note: Cloudflare Workers do not support Node natively. Use the `mongodb` driver's `browser`-compatible build or use **MongoDB Data API** (REST-based) as a fetch wrapper from Workers. Prefer the **MongoDB Atlas Data API** approach for simplicity and compatibility.

---

## Project Structure

```
/
├── frontend/                    # React app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Main portfolio page (hub)
│   │   │   ├── ProjectDetail.jsx     # Individual project detail
│   │   │   ├── Blog.jsx              # Blog listing
│   │   │   ├── BlogPost.jsx          # Individual blog post
│   │   │   └── dashboard/
│   │   │       ├── DashboardLayout.jsx
│   │   │       ├── DashboardLogin.jsx
│   │   │       ├── DashboardHome.jsx
│   │   │       ├── ManageProjects.jsx
│   │   │       ├── ManageMedia.jsx
│   │   │       ├── ManageJourney.jsx
│   │   │       └── ManageBlog.jsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── NavBar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── sections/
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── AboutSection.jsx
│   │   │   │   ├── ProjectsSection.jsx
│   │   │   │   ├── SkillsSection.jsx
│   │   │   │   ├── JourneySection.jsx
│   │   │   │   ├── MediaSection.jsx
│   │   │   │   └── BlogSection.jsx
│   │   │   ├── ui/
│   │   │   │   ├── MagneticButton.jsx
│   │   │   │   ├── TiltCard.jsx
│   │   │   │   ├── Terminal.jsx
│   │   │   │   ├── XPBar.jsx
│   │   │   │   ├── SectionTransition.jsx
│   │   │   │   └── CursorTrail.jsx
│   │   │   └── three/
│   │   │       └── HeroCanvas.jsx
│   │   ├── hooks/
│   │   │   ├── useProgress.js        # XP/exploration progress tracker
│   │   │   ├── useEasterEgg.js
│   │   │   └── useScrollReveal.js
│   │   ├── store/
│   │   │   └── useAppStore.js        # Zustand store
│   │   ├── lib/
│   │   │   ├── api.js                # API client (TanStack Query)
│   │   │   └── auth.js               # Token storage + auth helpers
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── App.jsx
│
├── backend/                     # Cloudflare Worker
│   ├── src/
│   │   ├── index.js              # Hono app entry
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   ├── media.js
│   │   │   ├── journey.js
│   │   │   ├── blog.js
│   │   │   └── skills.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   └── db/
│   │       └── mongoClient.js    # MongoDB Atlas Data API wrapper
│   └── wrangler.toml
```

---

## Public Portfolio — Pages & Sections

### 1. Home Page (`/`)

The home page is a **single vertical scroll experience**, with sections that each feel like a different "world." Navigation is via a floating minimal nav (pill-style, center-top, appears after scroll). Smooth scroll snapping between sections is optional but preferred.

#### 1a. Hero Section

- **Full viewport** — 100vh
- Background: A **Three.js canvas** with floating, softly glowing particles that form a loose constellation. Particles react subtly to mouse movement (parallax layer shift).
- Foreground: Yadev's name in a **large, distinctive display typeface** (suggest: Syne Mono or Space Grotesk display variant). Tagline beneath: animated in character by character with a staggered Framer Motion reveal.
- A **blinking cursor** after the tagline that cycles through rotating roles: `Senior Software Engineer_`, `Builder of Tools_`, `Debugging the World_` etc. — one fades out, next fades in.
- A subtle **scroll indicator** at the bottom: a small animated down-arrow or a pulsing dot.
- **CTA**: Two magnetic buttons — "View My Work" (primary) + "Say Hello" (secondary, opens mailto or contact modal).
- **Magnetic effect**: Buttons physically attract the cursor when within 80px radius using JS mouse tracking.

#### 1b. About Section

- **Layout**: Two-column on desktop — left is a styled "terminal window" component, right is a portrait photo (stylized with a CSS duotone filter or clip-path shape — not a boring rectangle).
- **Terminal component**: Simulates typing lines one by one. Lines load in with a 400ms delay each:
  ```
  > whoami
  Yadev — Senior SWE @ Tricog Health, Bangalore
  > interests
  ["developer tooling", "cloud infra", "building companies", "motorcycles"]
  > currently_building
  RequestLab — Postman × diff tool × open source
  > stack
  GCP | AWS | React | Node | MongoDB | Python
  > fun_fact
  Rides a Royal Enfield Interceptor 650. Will talk about it unprompted.
  ```
- Lines should auto-type at realistic keystroke speed (not instant). After all lines render, the cursor blinks forever.
- On mobile: Terminal stacks on top, photo below (or hidden).

#### 1c. Projects Section

- **Bento grid layout** — not a uniform card grid. Projects have varying widths (1-col, 2-col, full-width feature cards) arranged in an asymmetric masonry-like bento pattern.
- Each project card contains:
  - Project name + one-line description
  - Tech stack as small pill badges
  - A **hover state** that reveals a subtle gradient overlay + a "View →" CTA
  - Card uses `react-tilt` for a physics-tilt effect on hover
  - A unique accent color per card (pulled from project data in DB)
- Clicking a card **navigates to `/projects/:slug`** with a Framer Motion shared layout transition (the card expands/morphs into the detail page — use `layoutId`).
- Featured/pinned projects appear in the largest slots.

#### 1d. Skills & Stack Section

- **RPG Skill Tree layout** — rendered as an SVG or canvas-based tree graph using D3.js or a custom SVG with Framer Motion.
- Skill tree branches:
  - **Frontend** (React, Tailwind, Three.js, etc.)
  - **Backend** (Node, Python, Hono, etc.)
  - **Cloud** (GCP, AWS — S3, DynamoDB, ElastiCache, Amplify, Cloudflare)
  - **Databases** (MongoDB, Redis, Postgres)
  - **Tools** (Git, Docker, CI/CD, etc.)
- Each node is a circle with an icon + label. Nodes have a proficiency fill level (like health bar inside a circle, 0–100%).
- Hovering a node shows a tooltip with a fun one-liner: e.g., hovering "AWS" says `"Recently crossed over from GCP. No turning back."`.
- Lines connecting nodes animate in sequentially on section entry (Framer Motion `pathLength` animation on SVG paths).

#### 1e. Journey Section (Career Timeline Tree)

- A **horizontal scrollable timeline** (on desktop) or vertical (on mobile).
- Each node is a career event: job, role change, side project milestone, or personal achievement.
- Node design: circular badge with company logo or initials + role title + date range.
- Connecting lines animate in as user scrolls.
- Clicking a node **expands it** in-place with a pop-up panel showing full description, responsibilities, and tech used.
- Data is fully **CMS-driven** from the dashboard.
- This section is powered by the same data structure as the Journey Manager in the dashboard.

#### 1f. Media Gallery Section

- A **masonry photo/video grid** — not a slideshow, not a carousel.
- Mix of images and video thumbnails. Clicking opens a **lightbox** with smooth zoom-in animation.
- Videos play in the lightbox (embed-safe: YouTube, Vimeo, or direct Cloudflare R2 video URL).
- Filter bar at top: All / Photos / Videos / Design.
- Subtle stagger animation on entry — items cascade in with 60ms offset.

#### 1g. Blog Section

- Blog cards with: title, date, mood tag emoji, read time estimate, and excerpt.
- **Mood tags**: 🤔 Deep Dive / ⚡ Quick Take / 🔧 Built This / 💡 Thoughts
- Filter by mood — clicking a filter tag shuffles cards with a spring animation.
- Cards link to `/blog/:slug`.

#### 1h. Footer

- Minimal — dark background, name, links to GitHub / LinkedIn / Twitter, and a contact email.
- A small fun line: `"Built by Yadev. Powered by curiosity and too much coffee."`

---

### 2. Project Detail Page (`/projects/:slug`)

- Shared layout transition from the project card (Framer Motion `layoutId`).
- Hero: Full-width project banner image + title overlaid.
- Sections within the detail page:
  - **Overview** — Rich text rendered from Tiptap content stored in DB
  - **Tech Stack** — pill badges + brief notes
  - **Problem & Solution** — two-column layout
  - **Screenshots / Demo** — image gallery or video embed
  - **Links** — GitHub, Live Demo, Case Study (whatever is applicable)
  - **Related Projects** — 2–3 cards linking to other projects

---

### 3. Blog Post Page (`/blog/:slug`)

- Clean, editorial reading layout — centered, max-width ~680px.
- Distinctive typography (suggest: serif for body, mono for code blocks).
- **Reading progress bar** at top of viewport (thin line, fills as you scroll).
- **Table of contents** sidebar (desktop only) — auto-generated from headings.
- Code blocks use **Shiki** or **Prism** for syntax highlighting.
- Share buttons at bottom (Twitter/X, LinkedIn, copy link).

---

## Gamification Layer (Cross-Section)

### XP Progress Bar
- Persistent, floating element — thin horizontal bar pinned to the very bottom of the viewport (like a game HUD).
- Starts at 0%. Gains XP for:
  - Visiting each section: +10 XP each
  - Clicking a project: +15 XP
  - Reading a blog post: +20 XP
  - Opening a lightbox: +5 XP
  - Discovering the easter egg: +50 XP
- At 100%: Confetti burst (use `canvas-confetti`) + a toast: `"You've unlocked Yadev's full profile. Legend."`.
- Progress stored in `localStorage` so it persists across refreshes.

### Easter Egg
- Typing the Konami code (↑↑↓↓←→←→BA) on any page triggers a full-screen 3-second animation: Yadev's name explodes into particles that reform into a Royal Enfield silhouette, then fade. Play a vroom sound effect.
- Alternatively: clicking the logo 7 times triggers a "rage mode" where the entire site briefly inverts colors and shakes.
- Award +50 XP and show a toast: `"🏍️ Easter egg found. Respect."`.

### Custom Cursor
- Replace default cursor with a small glowing dot (CSS).
- A trailing ring element follows with a slight lag (Framer Motion spring).
- On hover over interactive elements, the ring scales up and changes color.

---

## Dashboard (Admin Panel) — `/dashboard`

Password-protected area for Yadev to manage all CMS content. Not publicly linked — accessed via direct URL.

### Auth Flow
- `/dashboard/login` — simple email + password form.
- On success: JWT stored in `httpOnly` cookie or `localStorage` (prefer httpOnly via Worker).
- All dashboard routes are protected. Unauthorized requests redirect to login.
- Backend: single hardcoded admin credential in Worker environment variables (no user DB needed for now).

### Dashboard Layout
- Sidebar navigation: Projects | Media | Journey | Blog | Skills | Settings.
- Top bar: Greeting (`Good morning, Yadev.`), logout button.
- Clean, functional design — contrast with the public site's creativity. Think Notion meets Linear.

---

### Dashboard Module 1: Project Manager

**List View (`/dashboard/projects`)**
- Table of all projects: name, status (published/draft), date, featured toggle.
- Add New Project button → navigates to `/dashboard/projects/new`.
- Edit / Delete actions per row.

**Project Form (`/dashboard/projects/new` or `/dashboard/projects/:id/edit`)**

Fields:
- `title` — text input
- `slug` — auto-generated from title (editable)
- `tagline` — short one-liner
- `description` — **Tiptap rich text editor** (full formatting: headings, bold, italic, code blocks, images)
- `problem` — rich text (the problem it solves)
- `solution` — rich text (how it solves it)
- `tech_stack` — multi-tag input (type tag, hit enter)
- `accent_color` — color picker (used in bento card)
- `cover_image` — file upload → uploads to Cloudflare R2, stores URL
- `gallery_images` — multi-file upload → array of R2 URLs
- `demo_video` — URL input (YouTube / Vimeo embed or R2 video)
- `github_url` — text input
- `live_url` — text input
- `case_study_url` — text input
- `status` — toggle: Draft / Published
- `featured` — boolean toggle (featured projects get larger bento slots)
- `order` — number (for manual ordering in bento grid)
- `related_projects` — multi-select from existing projects

On save: POST or PATCH to `/api/projects` → saves to MongoDB.

---

### Dashboard Module 2: Media Gallery Manager

**List View (`/dashboard/media`)**
- Masonry grid of all uploaded media items.
- Filter: All / Photos / Videos.
- Each item shows thumbnail + type badge + delete button.

**Upload Flow**
- Drag-and-drop upload zone (use `react-dropzone`).
- Supports: `.jpg`, `.png`, `.webp`, `.gif`, `.mp4`, `.mov`.
- On upload:
  1. File sent to Worker via `multipart/form-data`.
  2. Worker streams to Cloudflare R2.
  3. Returns public R2 URL.
  4. Worker saves metadata to MongoDB: `{ url, type, caption, tags, uploadedAt }`.
- After upload, user can add:
  - `caption` — text
  - `tags` — multi-tag (for filtering on public site)
  - `type` — auto-detected from MIME but overridable

---

### Dashboard Module 3: Journey Tree Manager

**View (`/dashboard/journey`)**
- Visual preview of the current journey tree (read-only, same component as public but simplified).
- List of all journey nodes below, sorted by date.

**Add / Edit Journey Node**

Fields:
- `type` — dropdown: Job / Role / Project Milestone / Achievement / Education
- `title` — e.g., "Senior Software Engineer"
- `organization` — e.g., "Tricog Health"
- `logo_url` — file upload or URL (company logo)
- `start_date` — date picker
- `end_date` — date picker (or toggle "Currently Here")
- `description` — rich text (responsibilities, achievements, tech used)
- `tech_stack` — tag input
- `highlight` — boolean (visually accents this node on public timeline)
- `order` — auto-computed from date, but manually overridable

Nodes are stored as an array in MongoDB. The public Journey Section fetches and renders them sorted by date.

---

### Dashboard Module 4: Blog Manager

**List View (`/dashboard/blog`)**
- Table: title, status, mood tag, date, word count.
- New Post button.

**Blog Post Form**
- `title` — text
- `slug` — auto-generated, editable
- `excerpt` — short summary (shown on card)
- `mood` — select: Deep Dive / Quick Take / Built This / Thoughts
- `cover_image` — upload to R2
- `content` — **Tiptap** full editor with: headings, bold/italic, code blocks (with language selector), images (uploads inline to R2), blockquotes, links
- `tags` — tag input
- `status` — Draft / Published
- `published_at` — date picker

---

### Dashboard Module 5: Skills Manager

**View (`/dashboard/skills`)**
- Edit the skill tree data: add/remove nodes, edit proficiency (0–100), edit category, edit tooltip text.
- Each skill: `{ name, category, proficiency, icon_url, tooltip, order }`.

---

## Backend API — Cloudflare Worker

Base URL: `https://api.yadev.dev` (or Workers subdomain)

### Auth
- `POST /api/auth/login` — validates credentials, returns JWT
- `POST /api/auth/logout` — clears session

### Projects
- `GET /api/projects` — all published (public)
- `GET /api/projects/:slug` — single project (public)
- `POST /api/projects` — create (auth required)
- `PATCH /api/projects/:id` — update (auth required)
- `DELETE /api/projects/:id` — delete (auth required)

### Media
- `GET /api/media` — all media items (public)
- `POST /api/media/upload` — upload file to R2 + save metadata (auth required)
- `DELETE /api/media/:id` — delete (auth required)

### Journey
- `GET /api/journey` — all nodes (public)
- `POST /api/journey` — create node (auth required)
- `PATCH /api/journey/:id` — update (auth required)
- `DELETE /api/journey/:id` — delete (auth required)

### Blog
- `GET /api/blog` — all published posts (public)
- `GET /api/blog/:slug` — single post (public)
- `POST /api/blog` — create (auth required)
- `PATCH /api/blog/:id` — update (auth required)
- `DELETE /api/blog/:id` — delete (auth required)

### Skills
- `GET /api/skills` — all skills (public)
- `POST /api/skills` — create (auth required)
- `PATCH /api/skills/:id` — update (auth required)
- `DELETE /api/skills/:id` — delete (auth required)

---

## MongoDB Schemas

### Project
```js
{
  title, slug, tagline, description, problem, solution,
  tech_stack: [String],
  accent_color, cover_image, gallery_images: [String],
  demo_video, github_url, live_url, case_study_url,
  status: 'draft' | 'published',
  featured: Boolean,
  order: Number,
  related_projects: [ObjectId],
  createdAt, updatedAt
}
```

### MediaItem
```js
{
  url, type: 'image' | 'video',
  caption, tags: [String],
  uploadedAt
}
```

### JourneyNode
```js
{
  type: 'job' | 'role' | 'milestone' | 'achievement' | 'education',
  title, organization, logo_url,
  start_date, end_date, is_current: Boolean,
  description, tech_stack: [String],
  highlight: Boolean, order: Number
}
```

### BlogPost
```js
{
  title, slug, excerpt, mood, cover_image,
  content, // Tiptap JSON
  tags: [String],
  status: 'draft' | 'published',
  published_at, createdAt, updatedAt
}
```

### Skill
```js
{
  name, category: 'frontend' | 'backend' | 'cloud' | 'database' | 'tools',
  proficiency: Number, // 0–100
  icon_url, tooltip, order: Number
}
```

---

## Design System

### Typography
- Display / Hero: **Syne** (Google Fonts) — bold, geometric, distinctive
- Body: **DM Sans** — clean and readable, not clichéd
- Code / Terminal: **JetBrains Mono** — technical credibility

### Color Palette
```css
--bg-primary: #0a0a0f;          /* Near-black with blue undertone */
--bg-secondary: #111118;
--bg-card: #16161f;
--accent-primary: #6EF7C4;      /* Electric mint — main CTA, hover states */
--accent-secondary: #F7A26E;    /* Warm amber — secondary accents */
--accent-tertiary: #A26EF7;     /* Soft violet — occasional pops */
--text-primary: #F0EFE8;        /* Off-white, slightly warm */
--text-secondary: #8B8A95;
--border: rgba(255,255,255,0.08);
```

### Motion Principles
- Page transitions: **crossfade + slight upward slide** (300ms ease-out)
- Section entry: **stagger reveal** — elements slide up from 20px with opacity 0→1
- Cards: **spring physics** on hover (Framer Motion spring, stiffness: 300, damping: 20)
- All durations: 200–500ms. Nothing over 600ms unless intentional (hero reveals).
- Easing: prefer `ease-out` for entrances, `ease-in-out` for transitions

---

## Performance & SEO

- Use **React Helmet Async** for per-page meta tags.
- Each project and blog post page should have OG tags for social sharing.
- Images served via Cloudflare R2 with proper caching headers.
- Lazy-load below-fold sections using `react-intersection-observer`.
- Code-split dashboard routes so public site bundle stays lean.
- Lighthouse target: ≥90 on Performance, ≥95 on Accessibility.

---

## Deployment

- **Frontend**: Deploy to **Cloudflare Pages** (free tier, CI/CD from GitHub).
- **Backend**: Deploy to **Cloudflare Workers** (free tier).
- **Media**: Stored in **Cloudflare R2** (free egress within Cloudflare network).
- **Database**: **MongoDB Atlas M0** (free, 512MB storage).
- **Domain**: Configure custom domain on Cloudflare Pages + Workers.

---

## Suggested Build Order

1. Backend: MongoDB schemas + Data API wrapper + all CRUD routes + auth
2. Frontend: Routing skeleton + layout components + global design system
3. Hero + About sections (establish the visual language)
4. Projects section + Project Detail page + shared layout transition
5. Skills Tree + Journey Timeline (data-driven)
6. Media Gallery + Blog sections
7. Dashboard: Auth + Projects manager
8. Dashboard: Media, Journey, Blog, Skills managers
9. Gamification layer: XP bar, cursor, easter egg
10. Polish: Page transitions, scroll animations, performance, SEO

---

## Notes for Claude Code

- Commit to the design system from the start — define CSS variables and Tailwind config before writing components.
- The XP system and cursor effects are **global** — implement them at the App level, not inside individual sections.
- All rich text content from Tiptap should be stored as **Tiptap JSON** in MongoDB and rendered using `@tiptap/react` on the frontend.
- For the Journey Tree on public site, the chart is purely presentational — render from API data. The dashboard is where structure is managed.
- The dashboard should feel **fast and utilitarian** — don't over-design it. Prioritize usability for Yadev managing content.
- Use environment variables for all secrets: MongoDB URI, JWT secret, R2 credentials, admin email/password hash.
- The Konami code easter egg should be implemented as a global `useEffect` listening to `keydown` events on `window`.
- Test on mobile early — the hero canvas, bento grid, and journey tree all need responsive fallbacks.

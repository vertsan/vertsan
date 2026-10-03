# Vert San - Portfolio

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://vertsan.netlify.app)
[![Netlify Status](https://img.shields.io/badge/deployed%20on-Netlify-blue)](https://vertsan.netlify.app)
[![Built with TanStack Start](https://img.shields.io/badge/built%20with-TanStack%20Start-orange)](https://tanstack.com/start)

A modern, full-stack personal portfolio showcasing projects, experience, education, certifications, and testimonials. Built with performance, accessibility, and developer experience in mind.

## 🚀 Live Demo

**[https://vertsan.netlify.app](https://vertsan.netlify.app)**

## ✨ Features

- **Interactive Hero Section** - Immersive 3D/animated background with smooth animations
- **Project Showcase** - Dynamic project portfolio with detailed project pages, tags, and external links (live demo, GitHub, app downloads)
- **Experience Timeline** - Professional work history with detailed role descriptions
- **Education & Certifications** - Academic background and professional certifications
- **Testimonials** - OAuth-authenticated testimonial system with GitHub/Discord providers
- **Admin Dashboard** - Protected admin panel for managing portfolio content (jobs, projects, education, certificates, technologies)
- **AI Resume Assistant** - Interactive chatbot powered by TanStack AI to answer questions about the resume
- **Live Presence** - Discord presence integration via Lanyard API
- **Theme System** - Dark/light/auto theme with SSR-safe hydration
- **Responsive Design** - Fully responsive across desktop, tablet, and mobile
- **Performance Optimized** - Code splitting, lazy loading, optimized assets, and aggressive caching
- **3D Visual Effects** - Custom Three.js components (Strands, DotGrid, etc.)

## 🏗️ Architecture

This portfolio is built with **TanStack Start**, a full-stack React meta-framework. It follows a type-safe, server-first architecture with file-based routing.

### Tech Stack

| Category | Technologies |
|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (via registry), [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/) |
| **3D Graphics** | [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), [React Three Drei](https://github.com/pmndrs/drei), [React Three Rapier](https://github.com/pmndrs/react-three-rapier), [Meshline](https://github.com/pmndrs/meshline) |
| **Routing** | [TanStack Router](https://tanstack.com/router) (file-based, type-safe) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (Neon), [Drizzle ORM](https://orm.drizzle.team/) |
| **Authentication** | OAuth (GitHub, Discord) with custom session tokens |
| **AI Integration** | [TanStack AI](https://tanstack.com/ai) (supports OpenAI, Anthropic, Gemini, Ollama) |
| **Data Fetching** | TanStack Router SSR + custom services/repositories |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Deployment** | [Netlify](https://www.netlify.com/) |
| **Linting/Formatting** | [Biome](https://biomejs.dev/) |
| **Testing** | [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/react) |

### Directory Structure

```text
vertsan/
├── public/              # Static assets (images, videos, resume, fonts, etc.)
├── src/
│   ├── components/      # React components
│   │   ├── admin/       # Admin dashboard components
│   │   ├── sections/    # Page section components (Hero, WhatICanDo, Testimonials, etc.)
│   │   ├── ui/          # shadcn/ui components
│   │   └── Lanyard/     # Discord presence components
│   ├── db/              # Database schema, client, and migrations
│   │   └── schema.ts    # Drizzle ORM schema definitions
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions, helpers, and configurations
│   ├── registry/        # shadcn/ui component registry
│   ├── repositories/    # Data access layer (abstraction over services)
│   ├── routes/          # TanStack Router file-based routes
│   │   ├── __root.tsx   # Root layout with meta tags, theme, devtools
│   │   ├── index.tsx    # Home page
│   │   ├── projects.*   # Projects routes (list + detail)
│   │   ├── admin.*      # Protected admin routes
│   │   ├── api.*        # API route handlers (server functions)
│   │   └── *.tsx        # Other pages
│   ├── services/        # Business logic layer
│   ├── styles.css       # Global styles (Tailwind v4)
│   ├── router.tsx       # Router configuration
│   └── routeTree.gen.ts # Auto-generated route tree
├── drizzle/             # Drizzle migrations
├── netlify.toml         # Netlify config
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
└── biome.json           # Biome config
```

### Data Flow

1. **Server Routes** (`src/routes/api.*`) handle API requests using TanStack Start's server handlers
2. **Services** (`src/services/*.service.ts`) contain business logic and validation
3. **Repositories** (`src/repositories/*.ts`) provide a clean data access abstraction
4. **Database** - Drizzle ORM queries PostgreSQL (Neon DB)
5. **Frontend** - TanStack Router with SSR fetches data on the server when possible, falling back to client-side fetching

### Key Features Implementation

- **Theme Management** - SSR-safe theme initialization via inline script in root layout, persisted in localStorage with light/dark/auto modes
- **Admin Auth** - Password-based login with cookie-based sessions; OAuth flow for testimonials
- **Testimonials** - GitHub/Discord OAuth integration to allow visitors to leave authenticated testimonials
- **Presence** - Real-time Discord status via [Lanyard API](https://api.lanyard.rest/)
- **Caching** - In-memory cache in public API routes (60s TTL) with appropriate HTTP cache headers
- **Code Splitting** - Lazy-loaded route sections for optimal bundle size
- **3D Effects** - Custom components with Three.js, optimized with proper cleanup and reduced motion support

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (v11+)
- PostgreSQL database (e.g., [Neon](https://neon.tech/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vertsan/vertsan.git
   cd vertsan
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL=postgresql://username:password@host:port/database

   # Admin Authentication
   ADMIN_SECRET=your-secure-admin-secret

   # OAuth (for testimonials)
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   DISCORD_CLIENT_ID=your-discord-client-id
   DISCORD_CLIENT_SECRET=your-discord-client-secret
   OAUTH_REDIRECT_URI=http://localhost:3000/api/auth

   # AI Resume Assistant (optional)
   OPENAI_API_KEY=your-openai-api-key
   ANTHROPIC_API_KEY=your-anthropic-api-key
   GEMINI_API_KEY=your-gemini-api-key

   # Cloudinary (for image uploads, optional)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Set up the database**

   ```bash
   pnpm db:generate
   pnpm db:migrate
   # or pnpm db:push
   pnpm seed  # optional
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

   App available at [http://localhost:3000](http://localhost:3000).

## 📜 Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run tests |
| `pnpm lint` | Lint code |
| `pnpm format` | Format code |
| `pnpm check` | Lint + format |
| `pnpm db:generate` | Generate migrations |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:push` | Push schema |
| `pnpm seed` | Seed database |

## 🚢 Deployment

Configured for Netlify with `netlify.toml` (build: `vite build`, publish: `dist/client`). Set environment variables in the Netlify dashboard and deploy on push to `main`.

## 🔐 Admin Panel

Admin dashboard at `/admin` for managing projects, jobs, education, certificates, and technologies.

## 🧪 Testing

```bash
pnpm test
```

## 📬 Contact

- **Website**: [https://vertsan.netlify.app](https://vertsan.netlify.app)
- **Email**: [itsanvert@gmail.com](mailto:itsanvert@gmail.com)
- **LinkedIn**: [https://linkedin.com/in/vertsan](https://linkedin.com/in/vertsan)
- **GitHub**: [https://github.com/vertsan](https://github.com/vertsan)

---

Built by Vert San
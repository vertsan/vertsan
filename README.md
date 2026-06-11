# Vert San

Software engineer building accessible, performant web applications with modern technologies.

## About

This is my personal portfolio and resume site — a full-stack web application built with [TanStack Start](https://tanstack.com/start). It showcases my work experience, projects, education, certifications, and technical skills, all managed through a custom CMS.

## Features

- **Portfolio & Resume** — Work experience, education, projects, certifications, and skills presented in a clean, responsive layout
- **CMS Admin Panel** — Manage all content (jobs, projects, education, certificates, technologies) through a password-protected admin interface
- **AI Resume Assistant** — Chat with an AI assistant that can answer questions about my background, skills, and experience
- **Dark/Light Theme** — Theme toggle with system preference detection
- **GSAP Animations** — Smooth scroll-triggered animations throughout the site
- **Cloudinary Integration** — Image hosting and optimization for project screenshots and headshots
- **SSR & Type-Safe Routing** — Full server-side rendering with TanStack Router's type-safe file-based routing

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + SSR) |
| Routing | [TanStack Router](https://tanstack.com/router) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 + [shadcn/ui](https://ui.shadcn.com/) |
| Database | [PostgreSQL](https://neon.tech/) via [Neon](https://neon.tech/) + [Drizzle ORM](https://orm.drizzle.team/) |
| AI | [TanStack AI](https://tanstack.com/ai) with LLM-powered resume chat |
| Animations | [GSAP](https://gsap.com/) |
| Images | [Cloudinary](https://cloudinary.com/) |
| Deployment | [Netlify](https://www.netlify.com/) |

## Getting Started

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:3000`.

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests with Vitest |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema to database |
| `npm run seed` | Seed database with sample data |

## Project Structure

```
├── content/              # Admin-managed content (via DB)
├── src/
│   ├── components/
│   │   ├── sections/     # Page sections (Hero, Projects, Experience, etc.)
│   │   ├── ui/           # shadcn/ui components
│   │   └── admin/        # Admin panel components
│   ├── db/               # Drizzle schema and database config
│   ├── lib/              # Utilities, hooks, and helpers
│   ├── services/         # API service layer
│   └── routes/           # TanStack Router file-based routes
└── public/               # Static assets
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
DATABASE_URL=          # Neon PostgreSQL connection string
ADMIN_PASSWORD=        # Password for CMS admin panel
CLOUDINARY_CLOUD_NAME= # Cloudinary cloud name
CLOUDINARY_API_KEY=    # Cloudinary API key
CLOUDINARY_API_SECRET= # Cloudinary API secret
```

## Deployment

This site is configured for [Netlify](https://netlify.com) deployment with `netlify.toml`. Server functions and API routes run on Netlify Functions.

## License

MIT

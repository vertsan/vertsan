import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Award,
  Cpu,
  ArrowLeft,
} from 'lucide-react'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/admin/education', label: 'Education', icon: GraduationCap },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/certificates', label: 'Certificates', icon: Award },
  { to: '/admin/technologies', label: 'Technologies', icon: Cpu },
]

export default function AdminSidebar() {
  const loc = useLocation()

  function isActive(to: string, exact?: boolean) {
    if (exact) return loc.pathname === to
    return loc.pathname.startsWith(to)
  }

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-card min-h-screen p-4 flex flex-col gap-1">
      <div className="px-3 py-4 mb-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          CMS
        </h2>
      </div>
      {links.map((link) => {
        const active = isActive(link.to, link.exact)
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <link.icon className="size-4 shrink-0" />
            {link.label}
          </Link>
        )
      })}
      <div className="mt-auto pt-4 border-t border-border">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4 shrink-0" />
          Back to Site
        </Link>
      </div>
    </aside>
  )
}

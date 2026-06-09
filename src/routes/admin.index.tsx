import { createFileRoute } from '@tanstack/react-router'
import {
  Briefcase,
  GraduationCap,
  FolderKanban,
  Award,
  Cpu,
} from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of all content in the CMS
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CardLink to="/admin/jobs" label="Jobs" icon={Briefcase} />
        <CardLink to="/admin/education" label="Education" icon={GraduationCap} />
        <CardLink to="/admin/projects" label="Projects" icon={FolderKanban} />
        <CardLink to="/admin/certificates" label="Certificates" icon={Award} />
        <CardLink to="/admin/technologies" label="Technologies" icon={Cpu} />
      </div>
    </div>
  )
}

function CardLink({
  to,
  label,
  icon: Icon,
}: {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <a
      href={to}
      className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow space-y-2 block"
    >
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{label}</h3>
          <p className="text-sm text-muted-foreground">Manage content</p>
        </div>
      </div>
    </a>
  )
}

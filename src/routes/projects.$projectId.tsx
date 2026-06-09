import { marked } from 'marked'
import { Link, createFileRoute } from '@tanstack/react-router'
import { allProjects } from 'content-collections'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'
import {
  Calendar,
  ExternalLink,
  Github,
  ArrowLeft,
} from 'lucide-react'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectDetail,
})

function ProjectDetail() {
  const { projectId } = Route.useParams()

  const project = allProjects.find((p) => p.slug === projectId)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-4xl font-bold">Project Not Found</h1>
        <p className="text-muted-foreground">
          The project you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" hash="projects">Projects</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="ghost" size="sm" asChild>
          <Link to="/" hash="projects" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Projects
          </Link>
        </Button>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {project.title}
            </h1>
            <Badge
              variant={
                project.status === 'Completed' ? 'default' : 'secondary'
              }
              className="shrink-0"
            >
              {project.status}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            {project.summary}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              <span>
                {project.startDate} — {project.endDate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {project.github && (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
              >
                <Github className="size-4" />
                Source Code
              </a>
            </Button>
          )}
          {project.link && (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="size-4" />
                Live Demo
              </a>
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <hr className="border-border" />

        <div
          className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: marked(project.content),
          }}
        />
      </div>
    </main>
  )
}

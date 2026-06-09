import { createFileRoute } from '@tanstack/react-router'
import CollectionManager from '#/components/admin/CollectionManager'

export const Route = createFileRoute('/admin/projects')({
  component: AdminProjects,
})

function AdminProjects() {
  return <CollectionManager collection="projects" />
}

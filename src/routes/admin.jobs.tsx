import { createFileRoute } from '@tanstack/react-router'
import CollectionManager from '#/components/admin/CollectionManager'

export const Route = createFileRoute('/admin/jobs')({
  component: AdminJobs,
})

function AdminJobs() {
  return <CollectionManager collection="jobs" />
}

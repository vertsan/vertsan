import { createFileRoute } from '@tanstack/react-router'
import CollectionManager from '#/components/admin/CollectionManager'

export const Route = createFileRoute('/admin/education')({
  component: AdminEducation,
})

function AdminEducation() {
  return <CollectionManager collection="education" />
}

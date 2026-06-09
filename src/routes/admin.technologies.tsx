import { createFileRoute } from '@tanstack/react-router'
import CollectionManager from '#/components/admin/CollectionManager'

export const Route = createFileRoute('/admin/technologies')({
  component: AdminTechnologies,
})

function AdminTechnologies() {
  return <CollectionManager collection="technologies" title="Technologies & Tools" />
}

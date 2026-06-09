import { createFileRoute } from '@tanstack/react-router'
import CollectionManager from '#/components/admin/CollectionManager'

export const Route = createFileRoute('/admin/certificates')({
  component: AdminCertificates,
})

function AdminCertificates() {
  return <CollectionManager collection="certificates" />
}

import { createFileRoute } from '@tanstack/react-router'
import {
  type CollectionKey,
  type ContentRecord,
  collectionConfig,
  list,
  get as mdGet,
  create as mdCreate,
  update as mdUpdate,
  remove as mdRemove,
  nextFile,
} from '#/lib/admin/markdown'

const validCollections = new Set(Object.keys(collectionConfig))

export const Route = createFileRoute('/api/admin')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { collection, action, id, data } = body as {
            collection: string
            action: string
            id?: string
            data?: ContentRecord
          }

          if (!validCollections.has(collection)) {
            return Response.json(
              { error: `Unknown collection: ${collection}` },
              { status: 400 },
            )
          }

          const col = collection as CollectionKey

          switch (action) {
            case 'list': {
              const items = await list(col)
              return Response.json({ items })
            }
            case 'get': {
              if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })
              const item = await mdGet(col, id)
              if (!item) return Response.json({ error: 'Not found' }, { status: 404 })
              return Response.json({ item })
            }
            case 'create': {
              if (!data) return Response.json({ error: 'Missing data' }, { status: 400 })
              const file = await nextFile(col)
              await mdCreate(col, file, data)
              return Response.json({ file })
            }
            case 'update': {
              if (!id || !data) return Response.json({ error: 'Missing id or data' }, { status: 400 })
              await mdUpdate(col, id, data)
              return Response.json({ success: true })
            }
            case 'delete': {
              if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })
              await mdRemove(col, id)
              return Response.json({ success: true })
            }
            default:
              return Response.json(
                { error: `Unknown action: ${action}` },
                { status: 400 },
              )
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          console.error('Admin API error:', err)
          return Response.json({ error: message }, { status: 500 })
        }
      },
    },
  },
})

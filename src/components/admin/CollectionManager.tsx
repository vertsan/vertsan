import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Save, X, Loader2, Eye } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { collectionConfig, type CollectionKey, type ContentRecord } from '#/lib/admin/markdown'
import TagInput from './TagInput'

interface Props {
  collection: CollectionKey
  title?: string
}

export default function CollectionManager({ collection, title }: Props) {
  const config = collectionConfig[collection]
  const [items, setItems] = useState<ContentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ContentRecord | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  const loadItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, action: 'list' }),
      })
      const data = await res.json()
      setItems(data.items || [])
    } catch {
      setError('Failed to load items')
    } finally {
      setLoading(false)
    }
  }, [collection])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  function emptyRecord(): ContentRecord {
    const record: Record<string, unknown> = { content: '' }
    for (const field of config.fields) {
      if (field.type === 'tags') {
        record[field.name] = [] as unknown as string
      } else {
        record[field.name] = ''
      }
    }
    return record as ContentRecord
  }

  function handleNew() {
    setEditing(emptyRecord())
    setIsNew(true)
    setError('')
    setPreview(null)
  }

  function handleEdit(item: ContentRecord) {
    setEditing({ ...item })
    setIsNew(false)
    setError('')
    setPreview(null)
  }

  function handleCancel() {
    setEditing(null)
    setIsNew(false)
    setError('')
    setPreview(null)
  }

  function handleFieldChange(name: string, value: unknown) {
    if (!editing) return
    setEditing({ ...editing, [name]: value })
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    setError('')

    try {
      if (isNew) {
        const res = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collection, action: 'create', data: editing }),
        })
        if (!res.ok) {
          const d = await res.json()
          throw new Error(d.error || 'Failed to create')
        }
      } else {
        const res = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection,
            action: 'update',
            id: editing._file,
            data: editing,
          }),
        })
        if (!res.ok) {
          const d = await res.json()
          throw new Error(d.error || 'Failed to update')
        }
      }

      setEditing(null)
      setIsNew(false)
      await loadItems()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(item: ContentRecord) {
    if (!confirm(`Delete this ${config.label.slice(0, -1).toLowerCase()}?`)) return

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection,
          action: 'delete',
          id: item._file,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to delete')
      }
      await loadItems()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  function getDisplayName(item: ContentRecord): string {
    return String(
      item.title || item.jobTitle || item.school || item.category || item._file || '',
    )
  }

  async function togglePreview() {
    if (preview) {
      setPreview(null)
    } else {
      const { marked } = await import('marked')
      const html = await marked(String(editing?.content || ''))
      setPreview(html)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title || config.label}</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} {config.label.toLowerCase()}
          </p>
        </div>
        {!editing && (
          <Button onClick={handleNew} className="gap-2">
            <Plus className="size-4" />
            Add {config.label.slice(0, -1)}
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">
          {error}
        </div>
      )}

      {editing ? (
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">
              {isNew
                ? `New ${config.label.slice(0, -1)}`
                : `Edit: ${getDisplayName(editing)}`}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleCancel}
              >
                <X className="size-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                className="gap-2"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {config.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1.5">
                  {field.label}
                  {'required' in field && field.required && (
                    <span className="text-destructive ml-0.5">*</span>
                  )}
                </label>
                {field.type === 'markdown' ? (
                  <div className="space-y-2">
                    <div className="flex gap-2 border rounded-lg overflow-hidden">
                      <textarea
                        value={String(editing[field.name] ?? '')}
                        onChange={(e) =>
                          handleFieldChange(field.name, e.target.value)
                        }
                        className="flex-1 min-h-[200px] p-3 text-sm font-mono bg-background border-0 focus:outline-none resize-y"
                        placeholder={`${field.label} (markdown)...`}
                      />
                      {preview && (
                        <div
                          className="flex-1 min-h-[200px] p-3 text-sm prose prose-sm dark:prose-invert max-w-none overflow-y-auto bg-muted/30"
                          dangerouslySetInnerHTML={{ __html: preview }}
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-xs"
                      onClick={togglePreview}
                    >
                      <Eye className="size-3.5" />
                      {preview ? 'Hide Preview' : 'Preview'}
                    </Button>
                  </div>
                ) : field.type === 'tags' ? (
                  <TagInput
                    value={
                      Array.isArray(editing[field.name])
                        ? (editing[field.name] as string[])
                        : []
                    }
                    onChange={(v) => handleFieldChange(field.name, v)}
                    placeholder={`Add ${field.label.toLowerCase()}...`}
                  />
                ) : (
                  <textarea
                    value={String(editing[field.name] ?? '')}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    placeholder={field.label}
                    rows={field.name === 'summary' ? 2 : 1}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No {config.label.toLowerCase()} yet.</p>
              <Button variant="link" onClick={handleNew} className="mt-2">
                Add your first{' '}
                {config.label.slice(0, -1).toLowerCase()}
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={item._file as string}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {getDisplayName(item)}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item._file as string}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

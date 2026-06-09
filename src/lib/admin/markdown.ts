import { readFile, writeFile, unlink, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import yaml from 'yaml'

const contentDir = join(process.cwd(), 'content')

export type ContentRecord = Record<string, unknown> & { content: string }

const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/

function parseMarkdown(raw: string): ContentRecord {
  const match = raw.match(frontmatterRegex)
  if (!match) return { content: raw }
  const data = yaml.parse(match[1]) as Record<string, unknown>
  const content = match[2]
  return { ...data, content }
}

function toMarkdown(data: ContentRecord): string {
  const { content, ...frontmatter } = data
  const fm = yaml.stringify(frontmatter).trim()
  return `---\n${fm}\n---\n\n${content ?? ''}`
}

export const collectionConfig = {
  jobs: {
    dir: 'jobs',
    label: 'Jobs',
    fields: [
      { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'summary', label: 'Summary', type: 'text', required: true },
      { name: 'startDate', label: 'Start Date', type: 'text', required: true },
      { name: 'endDate', label: 'End Date', type: 'text' },
      { name: 'tags', label: 'Tags', type: 'tags', required: true },
      { name: 'content', label: 'Content', type: 'markdown' },
    ],
  },
  education: {
    dir: 'education',
    label: 'Education',
    fields: [
      { name: 'school', label: 'School', type: 'text', required: true },
      { name: 'summary', label: 'Summary', type: 'text', required: true },
      { name: 'startDate', label: 'Start Date', type: 'text', required: true },
      { name: 'endDate', label: 'End Date', type: 'text' },
      { name: 'tags', label: 'Tags', type: 'tags', required: true },
      { name: 'content', label: 'Content', type: 'markdown' },
    ],
  },
  projects: {
    dir: 'projects',
    label: 'Projects',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'summary', label: 'Summary', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'text', required: true },
      { name: 'startDate', label: 'Start Date', type: 'text', required: true },
      { name: 'endDate', label: 'End Date', type: 'text', required: true },
      { name: 'image', label: 'Image', type: 'text' },
      { name: 'link', label: 'Link', type: 'text' },
      { name: 'github', label: 'GitHub', type: 'text' },
      { name: 'tags', label: 'Tags', type: 'tags', required: true },
      { name: 'content', label: 'Content', type: 'markdown' },
    ],
  },
  certificates: {
    dir: 'certificates',
    label: 'Certificates',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'issuer', label: 'Issuer', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'text', required: true },
      { name: 'summary', label: 'Summary', type: 'text', required: true },
      { name: 'credentialUrl', label: 'Credential URL', type: 'text' },
      { name: 'tags', label: 'Tags', type: 'tags', required: true },
      { name: 'content', label: 'Content', type: 'markdown' },
    ],
  },
  technologies: {
    dir: 'technologies',
    label: 'Technologies',
    fields: [
      { name: 'category', label: 'Category', type: 'text', required: true },
      { name: 'items', label: 'Items', type: 'tags', required: true },
      { name: 'content', label: 'Content', type: 'markdown' },
    ],
  },
} as const

export type CollectionKey = keyof typeof collectionConfig

export async function list(collection: CollectionKey): Promise<ContentRecord[]> {
  const dir = join(contentDir, collectionConfig[collection].dir)
  try {
    const files = await readdir(dir)
    const mdFiles = files.filter((f) => f.endsWith('.md')).sort()
    const items: ContentRecord[] = []
    for (const file of mdFiles) {
      const raw = await readFile(join(dir, file), 'utf-8')
      const item = parseMarkdown(raw)
      items.push({ ...item, _file: file })
    }
    return items
  } catch {
    return []
  }
}

export async function get(collection: CollectionKey, file: string): Promise<ContentRecord | null> {
  try {
    const raw = await readFile(join(contentDir, collectionConfig[collection].dir, file), 'utf-8')
    return { ...parseMarkdown(raw), _file: file }
  } catch {
    return null
  }
}

export async function create(collection: CollectionKey, file: string, data: ContentRecord): Promise<void> {
  const raw = toMarkdown(data)
  await writeFile(join(contentDir, collectionConfig[collection].dir, file), raw, 'utf-8')
}

export async function update(collection: CollectionKey, file: string, data: ContentRecord): Promise<void> {
  const raw = toMarkdown(data)
  await writeFile(join(contentDir, collectionConfig[collection].dir, file), raw, 'utf-8')
}

export async function remove(collection: CollectionKey, file: string): Promise<void> {
  await unlink(join(contentDir, collectionConfig[collection].dir, file))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function nextFile(collection: CollectionKey): Promise<string> {
  const dir = join(contentDir, collectionConfig[collection].dir)
  try {
    const files = await readdir(dir)
    const count = files.filter((f) => f.endsWith('.md')).length + 1
    return `${collection}-${count}.md`
  } catch {
    return `${collection}-1.md`
  }
}

import { readFile, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import pg from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_Z4d2KfDixclB@ep-divine-voice-ap5x6n42-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

const contentDir = join(__dirname, '..', 'content')

const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/

function parseMarkdown(raw: string) {
  const match = raw.match(frontmatterRegex)
  if (!match) return { frontmatter: {}, content: '' }
  return {
    frontmatter: parse(match[1]) as Record<string, unknown>,
    content: match[2].trim(),
  }
}

async function loadMdFiles(dir: string) {
  const files: { name: string; data: Record<string, unknown>; content: string }[] = []
  try {
    const entries = await readdir(dir)
    const mdFiles = entries.filter((f) => f.endsWith('.md'))
    for (const file of mdFiles) {
      const raw = await readFile(join(dir, file), 'utf-8')
      const { frontmatter, content } = parseMarkdown(raw)
      files.push({ name: file.replace('.md', ''), data: frontmatter, content })
    }
  } catch {
    // directory might not exist
  }
  return files
}

async function seed() {
  console.log('Connecting to database...')
  const pool = new pg.Pool({ connectionString: DATABASE_URL })
  const client = await pool.connect()

  try {
    // --- Jobs ---
    console.log('Seeding jobs...')
    const jobs = await loadMdFiles(join(contentDir, 'jobs'))
    for (const job of jobs) {
      const tags = (job.data.tags as string[]) || []
      await client.query(
        `INSERT INTO jobs (job_title, company, location, summary, start_date, end_date, tags, content)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING`,
        [
          job.data.jobTitle,
          job.data.company,
          job.data.location,
          job.data.summary,
          job.data.startDate,
          job.data.endDate || null,
          tags,
          job.content,
        ],
      )
    }
    console.log(`  -> ${jobs.length} jobs inserted`)

    // --- Education ---
    console.log('Seeding education...')
    const edu = await loadMdFiles(join(contentDir, 'education'))
    for (const item of edu) {
      const tags = (item.data.tags as string[]) || []
      await client.query(
        `INSERT INTO education (school, summary, start_date, end_date, tags, content)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [
          item.data.school,
          item.data.summary,
          item.data.startDate,
          item.data.endDate || null,
          tags,
          item.content,
        ],
      )
    }
    console.log(`  -> ${edu.length} education entries inserted`)

    // --- Projects ---
    console.log('Seeding projects...')
    const projects = await loadMdFiles(join(contentDir, 'projects'))
    for (const proj of projects) {
      const tags = (proj.data.tags as string[]) || []
      await client.query(
        `INSERT INTO projects (title, slug, summary, status, start_date, end_date, image, link, github, tags, content)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (slug) DO NOTHING`,
        [
          proj.data.title,
          proj.data.slug,
          proj.data.summary,
          proj.data.status,
          proj.data.startDate,
          proj.data.endDate,
          proj.data.image || null,
          proj.data.link || null,
          proj.data.github || null,
          tags,
          proj.content,
        ],
      )
    }
    console.log(`  -> ${projects.length} projects inserted`)

    // --- Certificates ---
    console.log('Seeding certificates...')
    const certs = await loadMdFiles(join(contentDir, 'certificates'))
    for (const cert of certs) {
      const tags = (cert.data.tags as string[]) || []
      await client.query(
        `INSERT INTO certificates (title, issuer, date, summary, credential_url, tags, content)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [
          cert.data.title,
          cert.data.issuer,
          cert.data.date,
          cert.data.summary,
          cert.data.credentialUrl || null,
          tags,
          cert.content,
        ],
      )
    }
    console.log(`  -> ${certs.length} certificates inserted`)

    // --- Technologies ---
    console.log('Seeding technologies...')
    const techs = await loadMdFiles(join(contentDir, 'technologies'))
    for (const tech of techs) {
      const items = (tech.data.items as string[]) || []
      await client.query(
        `INSERT INTO technologies (category, items, content)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [tech.data.category, items, tech.content],
      )
    }
    console.log(`  -> ${techs.length} technology entries inserted`)

    console.log('\nSeed completed successfully!')
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seed()

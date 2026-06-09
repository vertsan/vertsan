// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
var jobs = defineCollection({
  name: "jobs",
  directory: "content/jobs",
  include: "**/*.md",
  schema: z.object({
    jobTitle: z.string(),
    summary: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    company: z.string(),
    location: z.string(),
    tags: z.array(z.string()),
    content: z.string()
  })
});
var education = defineCollection({
  name: "education",
  directory: "content/education",
  include: "**/*.md",
  schema: z.object({
    school: z.string(),
    summary: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    tags: z.array(z.string()),
    content: z.string()
  })
});
var projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    link: z.string().optional(),
    github: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    status: z.string(),
    content: z.string()
  })
});
var certificates = defineCollection({
  name: "certificates",
  directory: "content/certificates",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    date: z.string(),
    summary: z.string(),
    credentialUrl: z.string().optional(),
    tags: z.array(z.string()),
    content: z.string()
  })
});
var content_collections_default = defineConfig({
  collections: [jobs, education, projects, certificates]
});
export {
  content_collections_default as default
};

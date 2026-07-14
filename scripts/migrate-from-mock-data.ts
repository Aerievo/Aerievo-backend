/**
 * One-off migration: reads the frontend's static mockData.ts and creates
 * matching documents in the Sanity dataset configured via .env (project
 * 2su1f8zh / production). Safe to re-run — every document uses a
 * deterministic _id (createOrReplace), so re-running updates in place
 * instead of duplicating.
 *
 * Run with:  npx tsx scripts/migrate-from-mock-data.ts
 */

import 'dotenv/config'
import path from 'node:path'
import fs from 'node:fs'
import {pathToFileURL} from 'node:url'
import {createClient, type SanityClient} from '@sanity/client'

const FRONTEND_ROOT = path.resolve(__dirname, '../../aerievo-frontend')
const PUBLIC_DIR = path.join(FRONTEND_ROOT, 'public')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_READ_TOKEN

if (!projectId || !token) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN must be set in .env')
}

const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
})

// ── Load mockData.ts from the frontend without needing a TS build step ──────
// mockData.ts is plain data (no Next.js/React imports), so a minimal global
// shim for its ambient ".d.ts" ambient ids (Setting, Social, etc. are types
// only — erased at runtime) lets tsx transpile-and-run it directly.
async function loadMockData() {
  const mod = await import(pathToFileURL(path.join(FRONTEND_ROOT, 'src/lib/mockData.ts')).href)
  return mod
}

// ── Image upload cache (avoid re-uploading the same file across sections) ──
const imageAssetCache = new Map<string, {_type: 'image'; asset: {_type: 'reference'; _ref: string}}>()

async function uploadImageByPublicPath(publicPath: string | null | undefined) {
  if (!publicPath) return undefined
  if (imageAssetCache.has(publicPath)) return imageAssetCache.get(publicPath)

  const relative = publicPath.replace(/^\/+/, '')
  const absPath = path.join(PUBLIC_DIR, relative)
  if (!fs.existsSync(absPath)) {
    console.warn(`  ! image not found on disk, skipping: ${publicPath}`)
    return undefined
  }

  const filename = path.basename(absPath)
  const asset = await client.assets.upload('image', fs.createReadStream(absPath), {filename})
  const value = {_type: 'image' as const, asset: {_type: 'reference' as const, _ref: asset._id}}
  imageAssetCache.set(publicPath, value)
  console.log(`  uploaded image: ${publicPath} -> ${asset._id}`)
  return value
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/^\/+/, '')
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function docId(prefix: string, key: string) {
  return `${prefix}-${slugify(key).replace(/\//g, '-')}`
}

// ── Reference maps built up as we create documents, so later sections can
// point at them (teamMember, testimonial, blogCategory, tag, form, page) ──
const teamMemberIds = new Map<string, string>() // slug -> _id
const testimonialIds = new Map<string, string>() // title -> _id
const blogCategoryIds = new Map<string, string>() // slug -> _id
const tagIds = new Map<string, string>() // slug -> _id
const pageTypeIds = new Map<string, string>() // name -> _id
const formIds = new Map<string, string>() // slug -> _id

async function ensurePageType(name: string) {
  if (pageTypeIds.has(name)) return pageTypeIds.get(name)!
  const id = docId('pageType', name)
  await client.createOrReplace({_id: id, _type: 'pageType', name, status: 1})
  pageTypeIds.set(name, id)
  return id
}

// ── Portable text passthrough (mock data already uses Sanity block shape) ──
function asBlocks(content: unknown) {
  return Array.isArray(content) ? content : []
}

// ── Section content transforms: mockData section.content -> Sanity object ──
async function transformCards(cards: any[] | undefined) {
  if (!Array.isArray(cards)) return undefined
  return Promise.all(
    cards.map(async (card) => ({
      _type: 'object',
      _key: cryptoKey(),
      icon: card.icon,
      image: card.image && card.image.startsWith('/') ? await uploadImageByPublicPath(card.image) : undefined,
      title: card.title,
      description: card.description,
      link: card.link,
    })),
  )
}

let keyCounter = 0
function cryptoKey() {
  keyCounter += 1
  return `k${keyCounter}`
}

async function transformHero(content: any) {
  return {
    _type: 'hero',
    _key: cryptoKey(),
    hideSection: false,
    title: content.title,
    subtitle: content.subtitle,
    variant: content.variant,
    image: content.image?.fileUrl ? await uploadImageByPublicPath(content.image.fileUrl) : undefined,
    primaryCta: content.primaryCta,
    secondaryCta: content.secondaryCta,
    columns: typeof content.columns === 'number' ? content.columns : undefined,
    cards: await transformCards(content.cards),
  }
}

async function transformIconFeatureGrid(content: any) {
  return {
    _type: 'iconFeatureGrid',
    _key: cryptoKey(),
    hideSection: false,
    title: content.title,
    subtitle: content.subtitle,
    description: content.description,
    variant: content.variant,
    columns: content.columns,
    cards: await transformCards(content.cards),
  }
}

function transformSolutionsGrid(content: any) {
  return {
    _type: 'solutionsGrid',
    _key: cryptoKey(),
    hideSection: false,
    title: content.title,
    subtitle: content.subtitle,
    items: Array.isArray(content.items)
      ? content.items.map((item: any) => ({
          _type: 'object',
          _key: cryptoKey(),
          icon: item.icon,
          title: item.title,
          description: item.description,
          linkLabel: item.linkLabel,
          link: item.link,
        }))
      : undefined,
  }
}

async function transformContentWithImage(content: any) {
  return {
    _type: 'contentWithImage',
    _key: cryptoKey(),
    hideSection: false,
    title: content.title,
    subtitle: content.subtitle,
    description: content.description,
    imagePosition: content.imagePosition,
    image: content.image?.fileUrl ? await uploadImageByPublicPath(content.image.fileUrl) : undefined,
    points: content.points,
    categories: Array.isArray(content.categories)
      ? content.categories.map((c: any) => ({_type: 'object', _key: cryptoKey(), title: c.title, items: c.items}))
      : undefined,
    primaryCta: content.primaryCta,
  }
}

function transformNarrativeSplit(content: any) {
  return {
    _type: 'narrativeSplit',
    _key: cryptoKey(),
    hideSection: false,
    sectionTitle: content.sectionTitle,
    columns: Array.isArray(content.columns)
      ? content.columns.map((col: any) => ({
          _type: 'object',
          _key: cryptoKey(),
          title: col.title,
          content: asBlocks(col.content),
        }))
      : undefined,
  }
}

function transformTeamGrid(content: any) {
  const members = Array.isArray(content.members)
    ? content.members
        .map((m: any) => teamMemberIds.get(m.slug))
        .filter(Boolean)
        .map((id: string) => ({_type: 'reference', _key: cryptoKey(), _ref: id}))
    : undefined
  return {
    _type: 'teamGrid',
    _key: cryptoKey(),
    hideSection: false,
    title: content.title,
    subtitle: content.subtitle,
    description: content.description,
    variant: content.variant,
    members,
    primaryCta: content.primaryCta,
  }
}

function transformTestimonialCarousel(content: any) {
  const testimonials = Array.isArray(content.testimonials)
    ? content.testimonials
        .map((t: any) => testimonialIds.get(t.title))
        .filter(Boolean)
        .map((id: string) => ({_type: 'reference', _key: cryptoKey(), _ref: id}))
    : undefined
  return {
    _type: 'testimonialCarousel',
    _key: cryptoKey(),
    hideSection: false,
    title: content.title,
    subtitle: content.subtitle,
    testimonials,
  }
}

async function transformSuccessStoriesTeaser(content: any) {
  return {
    _type: 'successStories',
    _key: cryptoKey(),
    hideSection: false,
    title: content.title,
    subtitle: content.subtitle,
    stories: content.stories
      ? await Promise.all(
          content.stories.map(async (s: any) => ({
            _type: 'object',
            _key: cryptoKey(),
            title: s.title,
            slug: s.slug,
            image: s.image ? await uploadImageByPublicPath(s.image) : undefined,
            description: s.description,
            stats: s.stats,
          })),
        )
      : undefined,
  }
}

async function transformLogoStrip(content: any) {
  return {
    _type: 'logoStrip',
    _key: cryptoKey(),
    hideSection: false,
    title: content.title,
    logos: content.logos
      ? await Promise.all(
          content.logos.map(async (l: any) => ({
            _type: 'object',
            _key: cryptoKey(),
            logo: l.image ? await uploadImageByPublicPath(l.image) : undefined,
            name: l.name,
          })),
        )
      : undefined,
  }
}

function transformCtaBanner(content: any) {
  return {
    _type: 'ctaBanner',
    _key: cryptoKey(),
    hideSection: false,
    title: content.title,
    description: content.description,
    primaryCta: content.primaryCta,
    secondaryCta: content.secondaryCta,
  }
}

function transformIconListPair(content: any) {
  return {
    _type: 'iconListPair',
    _key: cryptoKey(),
    hideSection: false,
    sectionTitle: content.sectionTitle,
    lists: Array.isArray(content.lists)
      ? content.lists.map((list: any) => ({
          _type: 'object',
          _key: cryptoKey(),
          title: list.title,
          items: Array.isArray(list.items)
            ? list.items.map((item: any) => ({
                _type: 'object',
                _key: cryptoKey(),
                icon: item.icon,
                title: item.title,
                description: item.description,
              }))
            : undefined,
        }))
      : undefined,
  }
}

function transformFaqAccordion(content: any) {
  return {
    _type: 'faqAccordion',
    _key: cryptoKey(),
    hideSection: false,
    title: content.title,
    subtitle: content.subtitle,
    items: Array.isArray(content.items)
      ? content.items.map((item: any) => ({
          _type: 'object',
          _key: cryptoKey(),
          question: item.question,
          answer: item.answer,
        }))
      : undefined,
  }
}

async function transformContactSection(content: any) {
  let formRef: {_type: 'reference'; _ref: string} | undefined
  if (content.form) {
    const formSlug = content.form.slug || slugify(content.form.name)
    let formId = formIds.get(formSlug)
    if (!formId) {
      formId = docId('form', formSlug)
      await client.createOrReplace({
        _id: formId,
        _type: 'form',
        name: content.form.name,
        slug: {_type: 'slug', current: formSlug},
        description: content.form.description,
        notificationEmail: content.form.notificationEmail,
        isActive: content.form.isActive ?? true,
        fields: Array.isArray(content.form.fields)
          ? content.form.fields.map((f: any) => ({
              _type: 'formField',
              _key: cryptoKey(),
              name: f.name,
              label: f.label,
              fieldType: f.fieldType,
              isRequired: f.isRequired,
              placeholder: f.placeholder,
              options: f.options,
            }))
          : [],
      })
      formIds.set(formSlug, formId)
      console.log(`  created form: ${content.form.name}`)
    }
    formRef = {_type: 'reference', _ref: formId}
  }

  return {
    _type: 'contactSection',
    _key: cryptoKey(),
    hideSection: false,
    title: content.title,
    form: formRef,
    locations: content.locations,
  }
}

function transformBenefitsGrid(content: any) {
  return {
    _type: 'benefitsGrid',
    _key: cryptoKey(),
    hideSection: false,
    title: content.title,
    subtitle: content.subtitle,
    videoUrl: content.videoUrl,
    benefits: content.benefits,
    primaryCta: content.primaryCta,
  }
}

function transformParagraphEditor(content: any) {
  return {
    _type: 'paragraphEditor',
    _key: cryptoKey(),
    hideSection: false,
    title: content.title,
    content: asBlocks(content.content),
  }
}

async function transformSection(section: any) {
  switch (section.sectionType) {
    case 'hero':
      return transformHero(section.content)
    case 'iconFeatureGrid':
      return transformIconFeatureGrid(section.content)
    case 'solutionsGrid':
      return transformSolutionsGrid(section.content)
    case 'contentWithImage':
      return transformContentWithImage(section.content)
    case 'narrativeSplit':
      return transformNarrativeSplit(section.content)
    case 'teamGrid':
      return transformTeamGrid(section.content)
    case 'testimonialCarousel':
      return transformTestimonialCarousel(section.content)
    case 'successStories':
      return transformSuccessStoriesTeaser(section.content)
    case 'logoStrip':
      return transformLogoStrip(section.content)
    case 'ctaBanner':
      return transformCtaBanner(section.content)
    case 'iconListPair':
      return transformIconListPair(section.content)
    case 'faqAccordion':
      return transformFaqAccordion(section.content)
    case 'contactSection':
      return transformContactSection(section.content)
    case 'benefitsGrid':
      return transformBenefitsGrid(section.content)
    case 'paragraphEditor':
      return transformParagraphEditor(section.content)
    default:
      console.warn(`  ! unknown section type, skipping: ${section.sectionType}`)
      return null
  }
}

async function migratePage(page: any) {
  const slug = page.slug === '/' ? '' : page.slug.replace(/^\/+/, '')
  const pageTypeName = page.pageType === 'home' ? 'home' : 'page'
  const pageTypeId = await ensurePageType(pageTypeName)

  const sections = (await Promise.all((page.sections || []).map(transformSection))).filter(Boolean)

  const id = docId('page', slug || 'home')
  await client.createOrReplace({
    _id: id,
    _type: 'page',
    title: page.title,
    slug: {_type: 'slug', current: slug},
    pageType: {_type: 'reference', _ref: pageTypeId},
    status: 'published',
    isIndex: true,
    sections,
    seo: {
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
    },
  })
  console.log(`page migrated: /${slug || ''}  (${sections.length} sections)`)
}

async function migrateTeamMembers(mockTeamMembers: any[]) {
  for (const m of mockTeamMembers) {
    const id = docId('team', m.slug)
    await client.createOrReplace({
      _id: id,
      _type: 'teamMember',
      name: m.name,
      slug: {_type: 'slug', current: m.slug},
      role: m.role,
      isLeadership: m.isLeadership,
      photo: m.photo ? await uploadImageByPublicPath(m.photo.fileUrl) : undefined,
      bio: asBlocks(m.bio),
      socialLinks: m.socialLinks,
      sortOrder: m.sortOrder,
      status: m.status,
    })
    teamMemberIds.set(m.slug, id)
  }
  console.log(`team members migrated: ${mockTeamMembers.length}`)
}

async function migrateTestimonials(mockTestimonials: any[]) {
  for (const t of mockTestimonials) {
    const id = docId('testimonial', t.title)
    await client.createOrReplace({
      _id: id,
      _type: 'testimonial',
      title: t.title,
      companyName: t.companyName,
      designation: t.designation,
      description: t.description,
      videoUrl: t.videoUrl,
      type: t.type,
      status: t.status,
      isIndex: t.isIndex,
      seo: {metaTitle: t.metaTitle, metaDescription: t.metaDescription},
    })
    testimonialIds.set(t.title, id)
  }
  console.log(`testimonials migrated: ${mockTestimonials.length}`)
}

async function ensureBlogCategory(cat: {slug: string; name: string}) {
  if (blogCategoryIds.has(cat.slug)) return blogCategoryIds.get(cat.slug)!
  const id = docId('blogCategory', cat.slug)
  await client.createOrReplace({
    _id: id,
    _type: 'blogCategory',
    name: cat.name,
    slug: {_type: 'slug', current: cat.slug},
    status: 'active',
  })
  blogCategoryIds.set(cat.slug, id)
  return id
}

async function ensureTag(tag: {slug: string; name: string}) {
  if (tagIds.has(tag.slug)) return tagIds.get(tag.slug)!
  const id = docId('tag', tag.slug)
  await client.createOrReplace({_id: id, _type: 'tag', name: tag.name, slug: {_type: 'slug', current: tag.slug}})
  tagIds.set(tag.slug, id)
  return id
}

async function migrateBlogPosts(mockBlogPosts: any[]) {
  for (const post of mockBlogPosts) {
    const categoryIds = await Promise.all((post.categories || []).map(ensureBlogCategory))
    const postTagIds = await Promise.all((post.tags || []).map(ensureTag))

    const id = docId('blog', post.slug)
    await client.createOrReplace({
      _id: id,
      _type: 'blog',
      title: post.title,
      slug: {_type: 'slug', current: post.slug},
      excerpt: post.excerpt,
      content: asBlocks(post.content),
      featuredImage: post.featuredImage ? await uploadImageByPublicPath(post.featuredImage.fileUrl) : undefined,
      authorName: post.authorName,
      authorLink: post.authorLink,
      status: post.status,
      publishedAt: post.publishedAt,
      categories: categoryIds.map((catId) => ({_type: 'reference', _key: cryptoKey(), _ref: catId})),
      tags: postTagIds.map((tagId) => ({_type: 'reference', _key: cryptoKey(), _ref: tagId})),
      seo: {metaTitle: post.metaTitle, metaDescription: post.metaDescription},
    })
  }
  console.log(`blog posts migrated: ${mockBlogPosts.length}`)
}

async function migrateSuccessStories(mockSuccessStories: any[]) {
  for (const story of mockSuccessStories) {
    const id = docId('successStory', story.slug)
    await client.createOrReplace({
      _id: id,
      _type: 'successStory',
      name: story.name,
      slug: {_type: 'slug', current: story.slug},
      shortDescription: story.sortDescription,
      client: story.client,
      industry: story.industry,
      content: asBlocks(story.content),
      featuredImage: story.media?.fileUrl ? await uploadImageByPublicPath(story.media.fileUrl) : undefined,
      status: story.status,
      isIndex: story.isIndex,
      seo: {metaTitle: story.metaTitle, metaDescription: story.metaDescription},
    })
  }
  console.log(`success stories migrated: ${mockSuccessStories.length}`)
}

async function migrateSiteSettings(mockSettings: any[]) {
  const byKey = Object.fromEntries(mockSettings.map((s: any) => [s.key, s.value]))
  await client.createOrReplace({
    _id: 'siteSettings-singleton',
    _type: 'siteSettings',
    contactPhone: byKey.contact_phone,
    contactEmail: byKey.contact_email,
    address: byKey.address,
    defaultMetaTitle: byKey.default_meta_title,
    defaultMetaDescription: byKey.default_page_description,
    socialLinks: [
      byKey.social_linkedin && {_type: 'object', _key: cryptoKey(), platform: 'linkedin', url: byKey.social_linkedin, status: 1},
      byKey.social_instagram && {_type: 'object', _key: cryptoKey(), platform: 'instagram', url: byKey.social_instagram, status: 1},
      byKey.social_twitter && {_type: 'object', _key: cryptoKey(), platform: 'twitter', url: byKey.social_twitter, status: 1},
      byKey.social_youtube && {_type: 'object', _key: cryptoKey(), platform: 'youtube', url: byKey.social_youtube, status: 1},
    ].filter(Boolean),
  })
  console.log('site settings migrated')
}

async function migrateSocials(mockSocials: any[]) {
  for (const s of mockSocials) {
    await client.createOrReplace({
      _id: docId('social', s.socialKey),
      _type: 'social',
      socialKey: s.socialKey,
      socialValue: s.socialValue,
      status: s.status === 'active',
    })
  }
  console.log(`socials migrated: ${mockSocials.length}`)
}

async function migrateMenus(mockHeaderMenu: any, mockFooterMenu: any, pageSlugToId: Map<string, string>) {
  const menuTypeHeaderId = docId('menuType', 'header')
  const menuTypeFooterId = docId('menuType', 'footer')
  await client.createOrReplace({_id: menuTypeHeaderId, _type: 'menuType', name: 'Header', status: 1})
  await client.createOrReplace({_id: menuTypeFooterId, _type: 'menuType', name: 'Footer', status: 1})

  function mapMenuItem(item: any): any {
    const link = item.link as string
    const normalized = link.replace(/^\/+/, '')
    const pageId = pageSlugToId.get(normalized) || (link === '/' ? pageSlugToId.get('') : undefined)
    return {
      _type: 'menuItem',
      _key: cryptoKey(),
      menuName: item.menuName,
      isClickable: item.isClickable,
      linkType: pageId ? 'page' : 'external',
      page: pageId ? {_type: 'reference', _ref: pageId} : undefined,
      externalLink: pageId ? undefined : link,
      sortOrder: item.sortOrder,
      status: item.status === 'active' ? 1 : 0,
      children: Array.isArray(item.children) ? item.children.map(mapMenuItem) : undefined,
    }
  }

  await client.createOrReplace({
    _id: docId('navMenu', 'header'),
    _type: 'navigationMenu',
    menuType: {_type: 'reference', _ref: menuTypeHeaderId},
    items: mockHeaderMenu.data.map(mapMenuItem),
  })
  await client.createOrReplace({
    _id: docId('navMenu', 'footer'),
    _type: 'navigationMenu',
    menuType: {_type: 'reference', _ref: menuTypeFooterId},
    items: mockFooterMenu.data.map(mapMenuItem),
  })
  console.log('navigation menus migrated')
}

async function main() {
  console.log(`Migrating into Sanity project ${projectId} / dataset ${dataset}\n`)
  const m = await loadMockData()

  // Order matters: create referenced documents (team, testimonials, forms via
  // pages) before the pages/sections that reference them.
  await migrateTeamMembers(m.mockTeamMembers)
  await migrateTestimonials(m.mockTestimonials)
  await migrateSuccessStories(m.mockSuccessStories)
  await migrateBlogPosts(m.mockBlogPosts)
  await migrateSiteSettings(m.mockSettings)
  await migrateSocials(m.mockSocials)

  const allPages = [
    m.mockHomePage,
    m.mockServicesHubPage,
    ...Object.values(m.mockServiceDetailPages),
    m.mockIndustriesHubPage,
    ...Object.values(m.mockIndustryDetailPages),
    m.mockTeamHubPage,
    m.mockAboutPage,
    m.mockWhyUsPage,
    m.mockContactPage,
    m.mockFaqPage,
    m.mockCareersPage,
    m.mockPrivacyPolicyPage,
    m.mockTermsConditionsPage,
  ]

  const pageSlugToId = new Map<string, string>()
  for (const page of allPages) {
    const slug = page.slug === '/' ? '' : page.slug.replace(/^\/+/, '')
    pageSlugToId.set(slug, docId('page', slug || 'home'))
  }

  for (const page of allPages) {
    await migratePage(page)
  }

  await migrateMenus(m.mockHeaderMenu, m.mockFooterMenu, pageSlugToId)

  console.log('\nMigration complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

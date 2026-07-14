import {defineType, defineField} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 200},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'reference',
      to: [{type: 'pageType'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'},
        ],
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'isIndex',
      title: 'Allow Search Engine Indexing',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        {type: 'hero'},
        {type: 'iconFeatureGrid'},
        {type: 'solutionsGrid'},
        {type: 'contentWithImage'},
        {type: 'narrativeSplit'},
        {type: 'teamGrid'},
        {type: 'testimonialCarousel'},
        {type: 'logoStrip'},
        {type: 'ctaBanner'},
        {type: 'iconListPair'},
        {type: 'faqAccordion'},
        {type: 'contactSection'},
        {type: 'benefitsGrid'},
        {type: 'paragraphEditor'},
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          type: 'string',
          title: 'Meta Title',
        }),
        defineField({
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          rows: 3,
        }),
        defineField({
          name: 'ogImage',
          type: 'image',
          title: 'OG Image',
          options: {hotspot: true},
        }),
        defineField({
          name: 'targetKeywords',
          type: 'string',
          title: 'Target Keywords',
        }),
        defineField({
          name: 'schemaMarkup',
          type: 'text',
          title: 'Schema Markup (JSON-LD)',
          description:
            'Paste your custom JSON-LD schema markup here (either with <script> tags or just the raw JSON object). It will be injected into the head of the page.',
          rows: 8,
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', status: 'status'},
    prepare({title, status}) {
      return {title, subtitle: status}
    },
  },
})

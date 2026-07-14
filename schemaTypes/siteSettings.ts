import {defineType, defineField} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — restrict to a single document in Sanity Studio desk structure
  fields: [
    // ── Contact ──────────────────────────────────────────────────────────────
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),
    // ── SEO & Analytics ───────────────────────────────────────────────────────
    defineField({
      name: 'defaultMetaTitle',
      title: 'Default Meta Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'defaultMetaDescription',
      title: 'Default Meta Description',
      type: 'text',
      group: 'seo',
    }),
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string',
      group: 'seo',
    }),
    // ── Social Media ──────────────────────────────────────────────────────────
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'social',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              title: 'Platform',
              description:
                'Lowercase platform key, e.g. facebook, instagram, youtube, twitter, linkedin',
            }),
            defineField({name: 'url', type: 'url', title: 'URL'}),
            defineField({
              name: 'status',
              type: 'number',
              title: 'Status',
              initialValue: 1,
            }),
          ],
          preview: {
            select: {title: 'platform', subtitle: 'url'},
          },
        },
      ],
    }),
    // ── Branding ─────────────────────────────────────────────────────────────
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      options: {hotspot: true},
      group: 'branding',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'branding',
    }),
  ],
  groups: [
    {name: 'contact', title: 'Contact'},
    {name: 'seo', title: 'SEO & Analytics'},
    {name: 'social', title: 'Social Media'},
    {name: 'branding', title: 'Branding'},
  ],
})

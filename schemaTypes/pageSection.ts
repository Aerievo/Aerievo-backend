// Legacy/generic fallback shape — not referenced in page.sections[]; kept for parity
// with the reference project's schema set. Prefer the typed blocks in sections.ts.
import {defineType, defineField} from 'sanity'

export const pageSection = defineType({
  name: 'pageSectionLegacy',
  title: 'Page Section (Legacy)',
  type: 'document',
  fields: [
    defineField({name: 'sectionType', title: 'Section Type', type: 'string'}),
    defineField({
      name: 'sectionData',
      title: 'Section Data',
      type: 'object',
      fields: [
        defineField({name: 'link', title: 'Link', type: 'string'}),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'object',
          fields: [
            defineField({name: 'id', title: 'Asset ID', type: 'string'}),
            defineField({name: 'altText', title: 'Alt Text', type: 'string'}),
            defineField({name: 'fileUrl', title: 'File URL', type: 'string'}),
          ],
        }),
        defineField({name: 'stats', title: 'Stats', type: 'array', of: [{type: 'string'}]}),
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'points', title: 'Points', type: 'array', of: [{type: 'string'}]}),
        defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
      ],
    }),
  ],
})

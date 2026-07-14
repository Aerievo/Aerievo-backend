import {defineType, defineField} from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Client Name / Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
    }),
    defineField({
      name: 'designation',
      title: 'Designation',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Review Text',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar / Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Text', value: 'text'},
          {title: 'Video', value: 'video'},
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'number',
      initialValue: 1,
      description: '1 = active, 0 = inactive',
    }),
    defineField({
      name: 'isIndex',
      title: 'Allow Search Engine Indexing',
      type: 'boolean',
      initialValue: true,
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
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'companyName', type: 'type', status: 'status'},
    prepare({title, subtitle, type, status}) {
      return {
        title,
        subtitle: `${subtitle ? `${subtitle} · ` : ''}${type || 'text'} · ${status === 1 ? 'Active' : 'Inactive'}`,
      }
    },
  },
})

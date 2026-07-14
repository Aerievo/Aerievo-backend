import {defineType, defineField} from 'sanity'

export const successStory = defineType({
  name: 'successStory',
  title: 'Case Study / Success Story',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 200},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'client',
      title: 'Client Name',
      type: 'string',
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
        },
      ],
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
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
        defineField({name: 'metaTitle', type: 'string', title: 'Meta Title'}),
        defineField({name: 'metaDescription', type: 'text', title: 'Meta Description', rows: 3}),
        defineField({name: 'ogImage', type: 'image', title: 'OG Image', options: {hotspot: true}}),
      ],
    }),
  ],
  preview: {
    select: {title: 'name', media: 'featuredImage', status: 'status'},
    prepare({title, media, status}) {
      return {title, media, subtitle: status === 1 ? 'Active' : 'Inactive'}
    },
  },
})

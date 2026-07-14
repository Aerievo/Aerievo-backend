import {defineType, defineField} from 'sanity'

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  fields: [
    defineField({
      name: 'fromSlug',
      title: 'From Path',
      type: 'string',
      description: 'Source path, e.g. /old-page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'toSlug',
      title: 'To Path',
      type: 'string',
      description: 'Destination path, e.g. /new-page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'statusCode',
      title: 'Status Code',
      type: 'number',
      options: {
        list: [
          {title: '301 — Permanent', value: 301},
          {title: '302 — Temporary', value: 302},
        ],
      },
      initialValue: 301,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'fromSlug', subtitle: 'toSlug'},
    prepare({title, subtitle}) {
      return {title: `${title} → ${subtitle}`}
    },
  },
})

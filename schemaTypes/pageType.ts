import {defineType, defineField} from 'sanity'

export const pageType = defineType({
  name: 'pageType',
  title: 'Page Type',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'number',
      initialValue: 1,
    }),
  ],
})

import {defineType, defineField} from 'sanity'

export const structuredData = defineType({
  name: 'structuredData',
  title: 'Structured Data',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Schema Type',
      type: 'string',
      description: 'Schema.org type — e.g. FAQPage, BreadcrumbList, Organization',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'refId',
      title: 'Reference ID',
      type: 'string',
      description: 'Slug or ID of the content this schema is attached to',
    }),
    defineField({
      name: 'schemaData',
      title: 'JSON-LD Data',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'type', subtitle: 'refId'},
  },
})

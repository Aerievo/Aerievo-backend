import {defineType, defineField} from 'sanity'

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'object',
  fields: [
    defineField({
      name: 'menuName',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Accessible Title',
      type: 'string',
    }),
    defineField({
      name: 'isClickable',
      title: 'Is Clickable',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          {title: 'Page', value: 'page'},
          {title: 'Blog', value: 'blog'},
          {title: 'External URL', value: 'external'},
        ],
      },
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{type: 'page'}],
      hidden: ({parent}) => (parent as {linkType?: string})?.linkType !== 'page',
    }),
    defineField({
      name: 'blog',
      title: 'Blog Post',
      type: 'reference',
      to: [{type: 'blog'}],
      hidden: ({parent}) => (parent as {linkType?: string})?.linkType !== 'blog',
    }),
    defineField({
      name: 'externalLink',
      title: 'External URL',
      type: 'string',
      hidden: ({parent}) => (parent as {linkType?: string})?.linkType !== 'external',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'children',
      title: 'Sub-items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'menuName', type: 'string', title: 'Label'}),
            defineField({
              name: 'title',
              type: 'string',
              title: 'Accessible Title',
            }),
            defineField({
              name: 'isClickable',
              type: 'boolean',
              title: 'Is Clickable',
              initialValue: true,
            }),
            defineField({
              name: 'linkType',
              type: 'string',
              title: 'Link Type',
              options: {
                list: [
                  {title: 'Page', value: 'page'},
                  {title: 'Blog', value: 'blog'},
                  {title: 'External URL', value: 'external'},
                ],
              },
            }),
            defineField({
              name: 'page',
              type: 'reference',
              title: 'Page',
              to: [{type: 'page'}],
            }),
            defineField({
              name: 'blog',
              type: 'reference',
              title: 'Blog Post',
              to: [{type: 'blog'}],
            }),
            defineField({
              name: 'externalLink',
              type: 'string',
              title: 'External URL',
            }),
            defineField({
              name: 'sortOrder',
              type: 'number',
              title: 'Sort Order',
            }),
            defineField({
              name: 'status',
              type: 'number',
              title: 'Status',
              initialValue: 1,
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'menuName'},
  },
})

export const navigationMenu = defineType({
  name: 'navigationMenu',
  title: 'Navigation Menu',
  type: 'document',
  fields: [
    defineField({
      name: 'menuType',
      title: 'Menu Type',
      type: 'reference',
      to: [{type: 'menuType'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Menu Items',
      type: 'array',
      of: [{type: 'menuItem'}],
    }),
  ],
  preview: {
    select: {title: 'menuType.name'},
    prepare({title}) {
      return {title: title || 'Navigation Menu'}
    },
  },
})

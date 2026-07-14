import {defineType, defineField} from 'sanity'

export const formField = {
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Field Name (Key)',
      type: 'string',
      description: 'Used as key in form submission (e.g. first_name, email, message)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Field Label',
      type: 'string',
      description: 'Displayed label text (e.g. First Name)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fieldType',
      title: 'Field Type',
      type: 'string',
      options: {
        list: [
          {title: 'Text', value: 'TEXT'},
          {title: 'Email', value: 'EMAIL'},
          {title: 'Number', value: 'NUMBER'},
          {title: 'Textarea (Multi-line)', value: 'TEXTAREA'},
          {title: 'Dropdown (Select)', value: 'SELECT'},
          {title: 'File Upload', value: 'FILE'},
          {title: 'Date Picker', value: 'DATE'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isRequired',
      title: 'Required',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'string',
    }),
    defineField({
      name: 'options',
      title: 'Options (comma-separated)',
      type: 'string',
      description: 'Only applicable for Dropdown (Select) type. e.g. "General Enquiry,Careers,Feedback"',
    }),
  ],
}

export const form = defineType({
  name: 'form',
  title: 'Forms (Form Builder)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Form Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'notificationEmail',
      title: 'Notification Email',
      type: 'string',
      description: 'Email where submission alerts will be sent',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [{type: 'formField'}],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      email: 'notificationEmail',
    },
    prepare({title, email}) {
      return {
        title,
        subtitle: email ? `Email: ${email}` : '',
      }
    },
  },
})

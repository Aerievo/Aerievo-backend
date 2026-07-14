import {defineType, defineField} from 'sanity'

const ctaField = () =>
  defineField({
    name: 'primaryCta',
    title: 'Primary CTA',
    type: 'object',
    fields: [
      defineField({name: 'label', title: 'Label', type: 'string'}),
      defineField({name: 'href', title: 'Href', type: 'string'}),
      defineField({name: 'link', title: 'Link', type: 'string'}),
    ],
  })

const iconTextArray = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [
      {
        type: 'object',
        fields: [
          defineField({name: 'icon', title: 'Icon (Lucide name)', type: 'string'}),
          defineField({
            name: 'image',
            title: 'Image (used instead of icon for photo/illustration cards)',
            type: 'image',
            options: {hotspot: true},
          }),
          defineField({name: 'title', title: 'Title', type: 'string'}),
          defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
          defineField({name: 'link', title: 'Link', type: 'string'}),
        ],
      },
    ],
  })

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3}),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      description: 'Optional visual variant key (e.g. dark, photo) consumed by the frontend renderer',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'altText', title: 'Alt Text', type: 'string'})],
    }),
    ctaField(),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'href', title: 'Href', type: 'string'}),
        defineField({name: 'link', title: 'Link', type: 'string'}),
      ],
    }),
    defineField({
      name: 'columns',
      title: 'Columns (when hero embeds a card grid, e.g. Why-Us hero)',
      type: 'number',
      options: {list: [2, 3, 4]},
    }),
    iconTextArray('cards', 'Cards (optional, e.g. Why-Us hero People/Purpose/Process)'),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle', media: 'image'},
    prepare({title, subtitle, media}) {
      return {title: 'Hero', subtitle: title || subtitle, media}
    },
  },
})

export const iconFeatureGrid = defineType({
  name: 'iconFeatureGrid',
  title: 'Icon Feature Grid',
  type: 'object',
  description: 'Reusable icon+title+description grid (value props, why-us rows, process/feature steps, benefits)',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      description: 'Optional visual variant key (e.g. dark, photo) consumed by the frontend renderer',
    }),
    defineField({
      name: 'columns',
      title: 'Columns (Desktop)',
      type: 'number',
      options: {list: [2, 3, 4]},
      initialValue: 4,
    }),
    iconTextArray('cards', 'Cards'),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
    prepare({title, subtitle}) {
      return {title: 'Icon Feature Grid', subtitle: title || subtitle}
    },
  },
})

export const solutionsGrid = defineType({
  name: 'solutionsGrid',
  title: 'Solutions / Services Grid',
  type: 'object',
  description: 'Grid linking out to service or industry detail pages ("Learn more" cards)',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'icon', title: 'Icon (Lucide name)', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
            defineField({name: 'linkLabel', title: 'Link Label', type: 'string', initialValue: 'Learn more'}),
            defineField({
              name: 'page',
              title: 'Linked Page',
              type: 'reference',
              to: [{type: 'page'}],
            }),
            defineField({name: 'link', title: 'External / Manual Link', type: 'string'}),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
    prepare({title, subtitle}) {
      return {title: 'Solutions Grid', subtitle: title || subtitle}
    },
  },
})

export const contentWithImage = defineType({
  name: 'contentWithImage',
  title: 'Content With Image',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {list: ['left', 'right']},
      initialValue: 'right',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'altText', title: 'Alt Text', type: 'string'})],
    }),
    defineField({name: 'points', title: 'Points', type: 'array', of: [{type: 'string'}]}),
    defineField({
      name: 'categories',
      title: 'Category Headings (e.g. tech-stack columns)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'items', title: 'Items', type: 'array', of: [{type: 'string'}]}),
          ],
        },
      ],
    }),
    ctaField(),
  ],
  preview: {
    select: {title: 'title', subtitle: 'imagePosition', media: 'image'},
    prepare({title, subtitle, media}) {
      return {
        title: 'Content With Image',
        subtitle: title ? `${title}${subtitle ? ` · image ${subtitle}` : ''}` : undefined,
        media,
      }
    },
  },
})

export const narrativeSplit = defineType({
  name: 'narrativeSplit',
  title: 'Narrative Split (Heading + Text)',
  type: 'object',
  description: 'Single heading + paragraph narrative block, optionally split into multiple columns (e.g. About "Beginning / Mission / Global")',
  fields: [
    defineField({name: 'sectionTitle', title: 'Section Title', type: 'string'}),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'content', title: 'Content', type: 'array', of: [{type: 'block'}]}),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'sectionTitle'},
    prepare({title}) {
      return {title: 'Narrative Split', subtitle: title}
    },
  },
})

export const teamGrid = defineType({
  name: 'teamGrid',
  title: 'Team Grid',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {list: [
        {title: 'Leadership (curated list)', value: 'leadership'},
        {title: 'Full team (all members)', value: 'all'},
      ]},
      initialValue: 'leadership',
    }),
    defineField({
      name: 'members',
      title: 'Featured Members (used when Variant = leadership)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'teamMember'}]}],
    }),
    ctaField(),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
    prepare({title, subtitle}) {
      return {title: 'Team Grid', subtitle: title || subtitle}
    },
  },
})

export const testimonialCarousel = defineType({
  name: 'testimonialCarousel',
  title: 'Testimonial Carousel',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'testimonial'}]}],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
    prepare({title, subtitle}) {
      return {title: 'Testimonial Carousel', subtitle: title || subtitle}
    },
  },
})

export const successStoriesTeaser = defineType({
  name: 'successStories',
  title: 'Success Stories Teaser',
  type: 'object',
  description: 'Homepage teaser grid of case-study cards (title, image, description, stat bullets, link)',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({
      name: 'stories',
      title: 'Stories',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'slug', title: 'Slug (links to /case-studies/:slug)', type: 'string'}),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
            defineField({name: 'stats', title: 'Stat Bullets', type: 'array', of: [{type: 'string'}]}),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'subtitle'},
    prepare({title, subtitle}) {
      return {title: 'Success Stories Teaser', subtitle: title || subtitle}
    },
  },
})

export const logoStrip = defineType({
  name: 'logoStrip',
  title: 'Client Logo Strip',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'altText', title: 'Alt Text', type: 'string'})],
            }),
            defineField({name: 'name', title: 'Client Name', type: 'string'}),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: 'Client Logo Strip', subtitle: title}
    },
  },
})

export const ctaBanner = defineType({
  name: 'ctaBanner',
  title: 'CTA Banner',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
    ctaField(),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'href', title: 'Href', type: 'string'}),
        defineField({name: 'link', title: 'Link', type: 'string'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: 'CTA Banner', subtitle: title}
    },
  },
})

export const iconListPair = defineType({
  name: 'iconListPair',
  title: 'Icon List Pair (Challenges / Services)',
  type: 'object',
  description: 'Used for industry-detail pages: "Current Challenges" + "Our Services" lists',
  fields: [
    defineField({name: 'sectionTitle', title: 'Section Title', type: 'string'}),
    defineField({
      name: 'lists',
      title: 'Lists',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'List Title', type: 'string'}),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({name: 'icon', title: 'Icon (Lucide name)', type: 'string'}),
                    defineField({name: 'title', title: 'Title', type: 'string'}),
                    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'sectionTitle'},
    prepare({title}) {
      return {title: 'Icon List Pair', subtitle: title}
    },
  },
})

export const faqAccordion = defineType({
  name: 'faqAccordion',
  title: 'FAQ Accordion',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string'}),
            defineField({name: 'answer', title: 'Answer', type: 'text', rows: 3}),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: 'FAQ Accordion', subtitle: title}
    },
  },
})

export const contactSection = defineType({
  name: 'contactSection',
  title: 'Contact Section (Form + Locations)',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'form',
      title: 'Select Form',
      type: 'reference',
      to: [{type: 'form'}],
    }),
    defineField({
      name: 'locations',
      title: 'Locations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label (e.g. India, USA)', type: 'string'}),
            defineField({name: 'address', title: 'Address', type: 'text', rows: 3}),
            defineField({name: 'phone', title: 'Phone', type: 'string'}),
            defineField({name: 'directionsUrl', title: 'Get Directions URL', type: 'url'}),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: 'Contact Section', subtitle: title}
    },
  },
})

export const benefitsGrid = defineType({
  name: 'benefitsGrid',
  title: 'Benefits Grid (Careers)',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'videoUrl', title: 'Video URL', type: 'url'}),
    iconTextArray('benefits', 'Benefits'),
    ctaField(),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: 'Benefits Grid', subtitle: title}
    },
  },
})

export const paragraphEditor = defineType({
  name: 'paragraphEditor',
  title: 'Paragraph Editor',
  type: 'object',
  description: 'Long-form rich text — used for legal pages (privacy policy, terms) and generic copy blocks',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {content: 'content', title: 'title'},
    prepare({content, title}) {
      const firstBlock = Array.isArray(content) && content[0]
      const text =
        firstBlock?.children
          ?.filter((c: {_type: string}) => c._type === 'span')
          ?.map((c: {text: string}) => c.text)
          ?.join('') ?? ''
      return {
        title: 'Paragraph Editor',
        subtitle: title || text || undefined,
      }
    },
  },
})

const rawSectionTypes = [
  hero,
  iconFeatureGrid,
  solutionsGrid,
  contentWithImage,
  narrativeSplit,
  teamGrid,
  testimonialCarousel,
  successStoriesTeaser,
  logoStrip,
  ctaBanner,
  iconListPair,
  faqAccordion,
  contactSection,
  benefitsGrid,
  paragraphEditor,
]

// Prepend the hideSection field to each section type dynamically for easy toggle in Sanity Studio
rawSectionTypes.forEach((section) => {
  if (section.fields) {
    section.fields.unshift(
      defineField({
        name: 'hideSection',
        title: 'Hide Section',
        type: 'boolean',
        initialValue: false,
      })
    )
  }
})

export const sectionTypes = rawSectionTypes

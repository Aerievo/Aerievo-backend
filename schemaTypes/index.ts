// Barrel export for all Sanity schemas.
// Import this file in your sanity.config.ts:
//
//   import { schemaTypes } from './schemaTypes'
//   export default defineConfig({ schema: { types: schemaTypes } })

export {blog} from './blog'
export {blogCategory} from './blogCategory'
export {tag} from './tag'
export {page} from './page'
export {pageType} from './pageType'
export {successStory} from './successStory'
export {testimonial} from './testimonial'
export {teamMember} from './team'
export {menuItem, navigationMenu} from './navigationMenu'
export {menuType} from './menuType'
export {siteSettings} from './siteSettings'
export {siteDetail} from './siteDetail'
export {social} from './social'
export {structuredData} from './structuredData'
export {redirect} from './redirect'
export {sectionTypes} from './sections'
export {form, formField} from './form'

import {blog} from './blog'
import {blogCategory} from './blogCategory'
import {tag} from './tag'
import {page} from './page'
import {pageType} from './pageType'
import {successStory} from './successStory'
import {testimonial} from './testimonial'
import {teamMember} from './team'
import {menuItem, navigationMenu} from './navigationMenu'
import {menuType} from './menuType'
import {siteSettings} from './siteSettings'
import {siteDetail} from './siteDetail'
import {social} from './social'
import {structuredData} from './structuredData'
import {redirect} from './redirect'
import {sectionTypes} from './sections'
import {form, formField} from './form'

export const schemaTypes = [
  // Document types
  blog,
  blogCategory,
  tag,
  page,
  pageType,
  successStory,
  testimonial,
  teamMember,
  navigationMenu,
  menuType,
  siteSettings,
  siteDetail,
  social,
  structuredData,
  redirect,
  form,

  // Object types (used inline inside documents)
  formField,
  menuItem,
  ...sectionTypes,
]

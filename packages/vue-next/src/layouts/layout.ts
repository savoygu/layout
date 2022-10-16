import type { ExtractPropTypes } from 'vue'

export const layoutProps = {
  fixedHeader: {
    type: Boolean,
    default: true
  },
  showTabbar: Boolean
} as const

export type SlvLayoutProps = ExtractPropTypes<typeof layoutProps>

export type SlvLayoutContext = Partial<SlvLayoutProps>

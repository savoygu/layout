import { computed, defineComponent, h, type Slots } from 'vue'
import { useSettingStore } from '@/store/setting'
import type { SlvTheProviderContext } from '@/composables/useGlobalConfig'
import { SlvTheProvider } from './SlvTheProvider'
import type { SlvLayoutContext } from '@/layouts/layout'
import type {
  SlvComprehensive,
  SlvFloat,
  SlvHorizontal,
  SlvVertical
} from '@/layouts'
import type { DeviceType } from '@/types'

export type SlvLayoutComponent =
  | typeof SlvFloat
  | typeof SlvHorizontal
  | typeof SlvVertical
  | typeof SlvComprehensive

export type SlvLayoutResponsive<T> = {
  [k in DeviceType]: T
}

export type SlvLayout =
  | SlvLayoutComponent
  | SlvLayoutResponsive<SlvLayoutComponent>

export type SlvContext = {
  config?: SlvTheProviderContext
  props?: SlvLayoutContext
  slots?: Slots
}

export const withSlvTheProvider = (
  Layout: SlvLayout,
  context: SlvContext = {}
) => {
  return defineComponent(() => {
    // store
    const settingsStore = useSettingStore()

    // computed
    const device = computed(() => {
      return settingsStore.device
    })
    const LayoutComponent = computed(() => {
      if (
        typeof Layout === 'object' &&
        'mobile' in Layout &&
        'desktop' in Layout
      ) {
        return Layout[device.value]
      }
      return Layout
    })

    return () => {
      const { config, props, slots } = context

      return h(SlvTheProvider, config, {
        default: () => h(LayoutComponent.value, props, slots),
        tools: () => (typeof slots?.tools === 'function' ? slots.tools() : null)
      })
    }
  })
}

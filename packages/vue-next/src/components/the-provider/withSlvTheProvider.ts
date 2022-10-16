import { computed, defineComponent, h } from 'vue'
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

export const withSlvTheProvider = (
  Layout: SlvLayout,
  config?: SlvTheProviderContext,
  props?: SlvLayoutContext
) => {
  return defineComponent(() => {
    // store
    const settingsStore = useSettingStore()

    const device = computed(() => {
      return settingsStore.device
    })

    // methods
    const LayoutComponent = () => {
      if (
        typeof Layout === 'object' &&
        'mobile' in Layout &&
        'desktop' in Layout
      ) {
        return Layout[device.value]
      }
      return Layout
    }

    return () => {
      return h(SlvTheProvider, config, [
        h(LayoutComponent(), {
          ...props,
          fixedHeader: props?.fixedHeader ?? config?.fixedHeader,
          showTabbar: props?.showTabbar ?? config?.showTabbar
        })
      ])
    }
  })
}

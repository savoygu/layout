import type { DeviceType } from '@/types'
import { computed, defineComponent, h, type DefineComponent } from 'vue'
import { useSettingStore } from '@/store'
import type { SlvTheProviderContext } from '@/composables'
import { SlvTheProvider } from './SlvTheProvider'
import type { SlvLayoutProps } from '@/layouts/layout'

export type ResponsiveComponent = {
  [k in DeviceType]: DefineComponent
}

export const withSlvTheProvider = (
  Layout: DefineComponent | ResponsiveComponent,
  config?: SlvTheProviderContext,
  props?: SlvLayoutProps
) => {
  return defineComponent(() => {
    // store
    const settingsStore = useSettingStore()

    const device = computed(() => {
      return settingsStore.device
    })

    // methods
    const LayoutComponent = (): DefineComponent => {
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

import {
  defineComponent,
  watch,
  type ExtractPropTypes,
  type PropType
} from 'vue'
import { DEVICE_BREAKPOINT, useMobile } from '@/composables/useMobile'
import { provideGlobalConfig } from '@/composables/useGlobalConfig'
import { useNamespace } from '@/composables/useNamespace'
import { useSettingStore } from '@/store/setting'
import { EDeviceType } from '@/types'

export const theProviderProps = {
  // layout
  fixedHeader: {
    type: Boolean,
    default: true
  },
  showTabbar: Boolean,
  breakpoint: {
    type: Number,
    default: DEVICE_BREAKPOINT
  }, // 移动端、PC端的分界线
  // namespace
  namespace: {
    type: String,
    default: 'slv'
  },
  epNamespace: {
    type: String,
    default: 'el'
  },
  // route
  keepAliveMaxNum: {
    type: Number,
    default: 20
  },
  isHashRouteMode: {
    type: Boolean,
    default: true
  },
  // logo
  title: String,
  logo: String,
  // menu
  defaultOpeneds: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  uniqueOpened: Boolean,
  // tabbar
  tabbarStyle: {
    type: String as PropType<'card' | 'smart' | 'smooth'>,
    default: 'smooth'
  },
  theme: {
    type: String as PropType<'dark' | 'light'>,
    default: 'dark'
  }
} as const

export type SlvTheProviderProps = ExtractPropTypes<typeof theProviderProps>

export const SlvTheProvider = defineComponent({
  name: 'SlvTheProvider',
  props: theProviderProps,
  setup(props, { slots }) {
    const config = provideGlobalConfig(props)

    // store
    const { setFoldSidebar, setDevice, setTheme } = useSettingStore()

    // composables
    const { mobile } = useMobile()
    const lNs = useNamespace('layout')

    // watch
    watch(mobile, (value) => {
      setFoldSidebar(value)
      setDevice(value ? EDeviceType.MOBILE : EDeviceType.DESKTOP)
    })
    watch(
      () => props.theme,
      (value) => {
        setTheme(value)
      },
      { immediate: true }
    )

    return () => (
      <div class={[lNs.b(), lNs.is('mobile', mobile.value)]}>
        {slots.default?.({ config: config?.value })}
        {slots.tools?.()}
      </div>
    )
  }
})

export type SlvTheProviderInstance = InstanceType<typeof SlvTheProvider>

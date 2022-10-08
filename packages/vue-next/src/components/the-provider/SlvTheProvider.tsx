import {
  DEVICE_BREAKPOINT,
  provideGlobalConfig,
  useMobile
} from '@/composables'
import { useSettingStore } from '@/store'
import { EDeviceType } from '@/types'
import {
  defineComponent,
  renderSlot,
  watch,
  type ExtractPropTypes,
  type PropType
} from 'vue'

export const theProviderProps = {
  title: String,
  logo: String,
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
  // route
  keepAliveMaxNum: {
    type: Number,
    default: 20
  },
  isHashRouteMode: {
    type: Boolean,
    default: true
  },
  // menu
  defaultOpeneds: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  uniqueOpened: Boolean,
  // namespace
  namespace: {
    type: String,
    default: 'slv'
  },
  epNamespace: {
    type: String,
    default: 'el'
  },
  // tabbar
  tabbarStyle: {
    type: String as PropType<'card' | 'smart' | 'smooth'>,
    default: 'smooth'
  }
} as const

export type SlvTheProviderProps = ExtractPropTypes<typeof theProviderProps>

export const SlvTheProvider = defineComponent({
  name: 'SlvTheProvider',
  props: theProviderProps,
  setup(props, { slots }) {
    const config = provideGlobalConfig(props)

    // store
    const { setFoldSidebar, setDevice } = useSettingStore()

    // composables
    const { mobile } = useMobile()

    // watch
    watch(mobile, (value) => {
      setFoldSidebar(value)
      setDevice(value ? EDeviceType.MOBILE : EDeviceType.DESKTOP)
    })

    return renderSlot(slots, 'default', { config: config?.value })
  }
})

export type SlvTheProvider = InstanceType<typeof SlvTheProvider>

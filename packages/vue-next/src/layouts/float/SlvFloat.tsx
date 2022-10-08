import {
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  type ExtractPropTypes
} from 'vue'
import { SlvAppMain, SlvNavbar, SlvSidebar, SlvTabbar } from '@/components'
import { useSettingStore } from '@/store/setting'
import { ELayoutType } from '@/types'
import { useNamespace } from '@/composables'
import { layoutProps } from '../layout'

export const floatProps = {
  ...layoutProps
} as const

export type SlvFloatProps = ExtractPropTypes<typeof floatProps>

export const SlvFloat = defineComponent({
  name: 'SlvFloat',
  components: { SlvAppMain, SlvNavbar, SlvSidebar, SlvTabbar },
  props: floatProps,
  setup(props) {
    // store
    const settingStore = useSettingStore()

    // composable
    const ns = useNamespace('float')
    const lNs = useNamespace('layout')

    // lifecycle
    onBeforeMount(() => {
      settingStore.setFoldSidebar(true)
    })
    onBeforeUnmount(() => {
      settingStore.setFoldSidebar(false)
    })

    return () => (
      <div
        class={[
          ns.b(),
          ns.is('fixed', props.fixedHeader),
          ns.is('no-tabbar', !props.showTabbar),
          lNs.m('float')
        ]}
      >
        <SlvSidebar layout={ELayoutType.FLOAT} />
        <div class={ns.b('main')}>
          <div class={[ns.b('top'), lNs.is('fixed-header', props.fixedHeader)]}>
            <SlvNavbar layout={ELayoutType.FLOAT} />
            <SlvTabbar v-if={props.showTabbar} />
          </div>
          <SlvAppMain />
        </div>
      </div>
    )
  }
})

export type SlvFloat = InstanceType<typeof SlvFloat>

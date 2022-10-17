import {
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  type ExtractPropTypes
} from 'vue'
import { SlvAppMain } from '@/components/app-main'
import { SlvNavbar } from '@/components/navbar'
import { SlvSidebar } from '@/components/sidebar'
import { SlvTabbar } from '@/components/tabbar'
import { useSettingStore } from '@/store/setting'
import { useNamespace } from '@/composables/useNamespace'
import { layoutProps } from '../layout'
import { ELayoutType } from '@/types'

export const floatProps = {
  ...layoutProps
} as const

export type SlvFloatProps = ExtractPropTypes<typeof floatProps>

export const SlvFloat = defineComponent({
  name: 'SlvFloat',
  props: floatProps,
  setup(props, { slots }) {
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
        <div class={lNs.b('main')}>
          <div
            class={[lNs.b('top'), lNs.is('fixed-header', props.fixedHeader)]}
          >
            <SlvNavbar
              layout={ELayoutType.FLOAT}
              v-slots={{ navbar: slots.navbar }}
            />
            {props.showTabbar && <SlvTabbar />}
          </div>
          <SlvAppMain v-slots={{ footer: slots.footer }} />
        </div>
      </div>
    )
  }
})

export type SlvFloatInstance = InstanceType<typeof SlvFloat>

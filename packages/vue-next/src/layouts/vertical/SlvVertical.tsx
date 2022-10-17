import { defineComponent, type ExtractPropTypes } from 'vue'
import { storeToRefs } from 'pinia'
import { SlvAppMain } from '@/components/app-main'
import { SlvNavbar } from '@/components/navbar'
import { SlvSidebar } from '@/components/sidebar'
import { SlvTabbar } from '@/components/tabbar'
import { useSettingStore } from '@/store/setting'
import { useNamespace } from '@/composables/useNamespace'
import { layoutProps } from '../layout'
import { ELayoutType } from '@/types'

export const verticalProps = {
  ...layoutProps
} as const

export type SlvVerticalProps = ExtractPropTypes<typeof verticalProps>

export const SlvVertical = defineComponent({
  name: 'SlvVertical',
  props: verticalProps,
  setup(props, { slots }) {
    // store
    const store = useSettingStore()
    const { foldSidebar } = storeToRefs(store)

    // composable
    const ns = useNamespace('vertical')
    const lNs = useNamespace('layout')

    return () => (
      <div
        class={[
          ns.b(),
          ns.is('fixed', props.fixedHeader),
          ns.is('no-tabbar', !props.showTabbar),
          lNs.m('vertical')
        ]}
      >
        <SlvSidebar layout={ELayoutType.VERTICAL} />
        <div class={[lNs.b('main'), lNs.is('folded', foldSidebar.value)]}>
          <div
            class={[lNs.b('top'), lNs.is('fixed-header', props.fixedHeader)]}
          >
            <SlvNavbar v-slots={{ navbar: slots.navbar }}></SlvNavbar>
            {props.showTabbar && <SlvTabbar />}
          </div>
          <SlvAppMain v-slots={{ footer: slots.footer }} />
        </div>
      </div>
    )
  }
})

export type SlvVerticalInstance = InstanceType<typeof SlvVertical>

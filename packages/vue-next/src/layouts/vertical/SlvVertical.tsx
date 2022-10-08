import { storeToRefs } from 'pinia'
import { defineComponent, type ExtractPropTypes } from 'vue'
import { SlvAppMain, SlvNavbar, SlvSidebar, SlvTabbar } from '@/components'
import { useSettingStore } from '@/store/setting'
import { ELayoutType } from '@/types'
import { useNamespace } from '@/composables'
import { layoutProps } from '../layout'

export const verticalProps = {
  ...layoutProps
} as const

export type SlvVerticalProps = ExtractPropTypes<typeof verticalProps>

export const SlvVertical = defineComponent({
  name: 'SlvVertical',
  components: { SlvAppMain, SlvNavbar, SlvSidebar, SlvTabbar },
  props: verticalProps,
  setup(props) {
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
            <SlvNavbar />
            {props.showTabbar && <SlvTabbar />}
          </div>
          <SlvAppMain />
        </div>
      </div>
    )
  }
})

export type SlvVertical = InstanceType<typeof SlvVertical>

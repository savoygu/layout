import { storeToRefs } from 'pinia'
import { defineComponent, type ExtractPropTypes } from 'vue'
import { SlvAppMain, SlvNavbar, SlvSidebar, SlvTabbar } from '@/components'
import { useSettingStore } from '@/store/setting'
import { ELayoutType } from '@/types'
import { useNamespace } from '@/composables'
import { layoutProps } from '../layout'

export const comprehensiveProps = {
  ...layoutProps
} as const

export type SlvComprehensiveProps = ExtractPropTypes<typeof comprehensiveProps>

export const SlvComprehensive = defineComponent({
  name: 'SlvComprehensive',
  components: { SlvAppMain, SlvNavbar, SlvSidebar, SlvTabbar },
  props: comprehensiveProps,
  setup(props) {
    // store
    const settingStore = useSettingStore()
    const { foldSidebar } = storeToRefs(settingStore)

    // composable
    const ns = useNamespace('comprehensive')
    const lNs = useNamespace('layout')

    return () => {
      return (
        <div
          class={[
            ns.b(),
            ns.is('fixed', props.fixedHeader),
            ns.is('no-tabbar', !props.showTabbar),
            lNs.m('comprehensive')
          ]}
        >
          <SlvSidebar layout={ELayoutType.COMPREHENSIVE} />
          <div class={[lNs.b('main'), lNs.is('folded', foldSidebar.value)]}>
            <div
              class={[lNs.b('top'), lNs.is('fixed-header', props.fixedHeader)]}
            >
              <SlvNavbar layout={ELayoutType.COMPREHENSIVE} />
              <SlvTabbar v-if={props.showTabbar} />
            </div>
            <SlvAppMain />
          </div>
        </div>
      )
    }
  }
})

export type SlvComprehensive = InstanceType<typeof SlvComprehensive>

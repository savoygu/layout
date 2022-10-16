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

export const comprehensiveProps = {
  ...layoutProps
} as const

export type SlvComprehensiveProps = ExtractPropTypes<typeof comprehensiveProps>

export const SlvComprehensive = defineComponent({
  name: 'SlvComprehensive',
  props: comprehensiveProps,
  setup(props, { slots }) {
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
              <SlvNavbar
                layout={ELayoutType.COMPREHENSIVE}
                v-slots={{ navbar: () => slots.navbar?.() }}
              />
              {props.showTabbar && <SlvTabbar />}
            </div>
            <SlvAppMain />
          </div>
        </div>
      )
    }
  }
})

export type SlvComprehensiveInstance = InstanceType<typeof SlvComprehensive>

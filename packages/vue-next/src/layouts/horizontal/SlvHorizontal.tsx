import { defineComponent, type ExtractPropTypes } from 'vue'
import { SlvAppMain } from '@/components/app-main'
import { SlvTheHeader } from '@/components/the-header'
import { SlvTabbar } from '@/components/tabbar'
import { useNamespace } from '@/composables'
import { layoutProps } from '../layout'
import { ELayoutType } from '@/types'

export const horizontalProps = {
  ...layoutProps
} as const

export type SlvHorizontalProps = ExtractPropTypes<typeof horizontalProps>

export const SlvHorizontal = defineComponent({
  name: 'SlvHorizontal',
  props: horizontalProps,
  setup(props, { slots }) {
    // composable
    const ns = useNamespace('horizontal')
    const lNs = useNamespace('layout')

    return () => (
      <div
        class={[
          ns.b(),
          ns.is('fixed', props.fixedHeader),
          ns.is('no-tabbar', !props.showTabbar),
          lNs.m('horizontal')
        ]}
      >
        <div class={[lNs.b('top'), lNs.is('fixed-header', props.fixedHeader)]}>
          <SlvTheHeader
            layout={ELayoutType.HORIZONTAL}
            v-slots={{ header: () => slots.header?.() }}
          />
          <div
            v-show={props.showTabbar}
            class={ns.is('horizontal', props.showTabbar)}
          >
            <div class={lNs.b('main')}>
              <SlvTabbar />
            </div>
          </div>
        </div>
        <div class={lNs.b('main')}>
          <SlvAppMain />
        </div>
      </div>
    )
  }
})

export type SlvHorizontalInstance = InstanceType<typeof SlvHorizontal>

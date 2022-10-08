import { defineComponent, type ExtractPropTypes } from 'vue'
import { SlvAppMain, SlvTheHeader, SlvTabbar } from '@/components'
import { ELayoutType } from '@/types'
import { useNamespace } from '@/composables'
import { layoutProps } from '../layout'

export const horizontalProps = {
  ...layoutProps
} as const

export type SlvHorizontalProps = ExtractPropTypes<typeof horizontalProps>

export const SlvHorizontal = defineComponent({
  name: 'SlvHorizontal',
  components: { SlvAppMain, SlvTheHeader, SlvTabbar },
  props: horizontalProps,
  setup(props) {
    // composable
    const ns = useNamespace('float')
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
          <SlvTheHeader layout={ELayoutType.HORIZONTAL} />
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

export type SlvHorizontal = InstanceType<typeof SlvHorizontal>

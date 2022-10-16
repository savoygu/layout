import {
  computed,
  defineComponent,
  type ExtractPropTypes,
  type PropType
} from 'vue'
import { RouterLink } from 'vue-router'
import { SlvIcon } from '@/components/icon'
import { useGlobalConfig, useNamespace } from '@/composables'
import { ELayoutType } from '@/types'

export const logoProps = {
  layout: {
    type: String as PropType<ELayoutType>,
    required: true
  }
} as const

export type SlvLogoProps = ExtractPropTypes<typeof logoProps>

export const SlvLogo = defineComponent({
  name: 'SlvLogo',
  props: logoProps,
  setup(props) {
    // composable
    const ns = useNamespace('logo')
    const globalConfig = useGlobalConfig()

    // computed
    const logoClass = computed(() => {
      return {
        [ns.m(props.layout)]: true
      }
    })
    const titleClass = computed(() => {
      return {
        'hidden-xs-only': props.layout === ELayoutType.HORIZONTAL
      }
    })

    return () => (
      <div class={[ns.b(), logoClass.value]}>
        <RouterLink to="/">
          <span class={ns.e('icon')}>
            {globalConfig.value?.logo && (
              <SlvIcon icon={globalConfig.value?.logo} isCustomSvg />
            )}
          </span>
          <span class={[ns.e('title'), titleClass.value]}>
            {globalConfig.value?.title}
          </span>
        </RouterLink>
      </div>
    )
  }
})

export type SlvLogoInstance = InstanceType<typeof SlvLogo>

import { computed, defineComponent, type ExtractPropTypes } from 'vue'
import { SlvIcon } from '@/components/icon'
import { ELayoutType } from '@/types'
import { useGlobalConfig, useNamespace } from '@/composables'

export const logoProps = {
  layout: {
    type: String,
    default: ''
  }
} as const

export type SlvLogoProps = ExtractPropTypes<typeof logoProps>

export const SlvLogo = defineComponent({
  name: 'SlvLogo',
  components: { SlvIcon },
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
      <div class={[ns.b(), logoClass]}>
        <router-link to="/">
          <span class={ns.e('pic')}>
            {globalConfig.value.logo && (
              <SlvIcon icon={globalConfig.value.logo} />
            )}
          </span>
          <span class={[ns.e('title'), titleClass]}>
            {globalConfig.value.title}
          </span>
        </router-link>
      </div>
    )
  }
})

export type SlvLogo = InstanceType<typeof SlvLogo>

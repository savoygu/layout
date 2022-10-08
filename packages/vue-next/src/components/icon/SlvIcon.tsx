import 'remixicon/fonts/remixicon.css'
import remixIconPath from 'remixicon/fonts/remixicon.symbol.svg'
import {
  computed,
  defineComponent,
  type ExtractPropTypes,
  type PropType
} from 'vue'
import { isExternal } from '@/utils'
import { useNamespace } from '@/composables'

export const iconProps = {
  icon: {
    type: String,
    required: true
  },
  // 是否使用自定义图标
  isCustomSvg: {
    type: Boolean,
    default: false
  },
  // 是否使用本地库Remix图标
  isDefaultSvg: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  },
  onClick: Function as PropType<(e: MouseEvent) => void>
} as const

export type SlvIconProps = ExtractPropTypes<typeof iconProps>

export const SlvIcon = defineComponent({
  name: 'SlvIcon',
  props: iconProps,
  setup(props) {
    // composable
    const ns = useNamespace('icon')

    // computed
    const isImage = computed(() => {
      return ['data:image', '.png', '.jpeg', '.jpg', '.webp'].some((suffix) =>
        props.icon.includes(suffix)
      )
    })
    const svgClass = computed(() => {
      if (props.className) return [ns.e('svg'), props.className]
      else return ns.e('svg')
    })
    const iconClass = computed(() => {
      return props.icon.startsWith('el-icon')
        ? {
            [props.icon]: true
          }
        : {
            ['ri-' + props.icon]: true
          }
    })
    const isExternalIcon = computed(() => isExternal(props.icon))

    return () => {
      const { icon, isCustomSvg, isDefaultSvg } = props

      if (isExternalIcon.value || isImage) {
        return <img src={icon} class={ns.e('img')} />
      } else if (isCustomSvg) {
        return (
          <svg class={svgClass.value} aria-hidden="true">
            <use xlinkHref={'#icon-' + icon} />
          </svg>
        )
      } else if (isDefaultSvg) {
        // 内置svg雪碧图较大，对性能要求苛刻的用户请勿使用isDefaultSvg属性
        return (
          <svg class={ns.e('svg')}>
            <use xlinkHref={remixIconPath + '#ri-' + icon} />
          </svg>
        )
      } else {
        return <i v-else class={iconClass} aria-hidden="true" />
      }
    }
  }
})

export type SlvIcon = InstanceType<typeof SlvIcon>

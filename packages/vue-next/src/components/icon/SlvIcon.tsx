import {
  computed,
  defineComponent,
  type ExtractPropTypes,
  type PropType
} from 'vue'
import { isExternal } from '@/utils'
import { useNamespace } from '@/composables/useNamespace'

export const iconProps = {
  icon: {
    type: String,
    required: true
  },
  isLocalImage: {
    type: Boolean,
    default: false
  },
  isCustomSvg: {
    type: Boolean,
    default: false
  },
  isRemixSvg: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  },
  svgPrefix: {
    type: String,
    default: 'slv-svg-'
  },
  iconPrefix: {
    type: String,
    default: 'ri-'
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
    const svgClass = computed(() => {
      return [ns.e('svg'), props.className].filter(Boolean)
    })

    return () => {
      const { icon, isCustomSvg, isRemixSvg, svgPrefix, iconPrefix } = props

      if (isExternal(icon) || props.isLocalImage) {
        return <img src={icon} class={ns.e('img')} onClick={props.onClick} />
      } else if (isCustomSvg) {
        return (
          <svg class={svgClass.value} aria-hidden onClick={props.onClick}>
            <use xlinkHref={`#${svgPrefix + icon}`} />
          </svg>
        )
      } else if (isRemixSvg) {
        // 内置 svg 雪碧图较大，对性能要求苛刻的用户请勿使用 isRemixSvg 属性
        const remixIconPath = require('remixicon/fonts/remixicon.symbol.svg')
        return (
          <svg class={ns.e('svg')} onClick={props.onClick}>
            <use xlinkHref={`${remixIconPath}#${iconPrefix + icon}`} />
          </svg>
        )
      } else {
        return (
          <i class={iconPrefix + icon} aria-hidden onClick={props.onClick} />
        )
      }
    }
  }
})

export type SlvIconInstance = InstanceType<typeof SlvIcon>

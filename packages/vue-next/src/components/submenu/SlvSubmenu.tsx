import { defineComponent, type ExtractPropTypes, type PropType } from 'vue'
import { SlvIcon } from '@/components/icon'
import type { SlvRouteMeta, SlvRouteRecord } from '@/types'

export const submenuProps = {
  itemOrMenu: {
    type: Object as PropType<SlvRouteRecord>,
    default: () => ({})
  }
} as const

export type SlvSubmenuProps = ExtractPropTypes<typeof submenuProps>

export const SlvSubmenu = defineComponent({
  name: 'SlvSubmenu',
  components: { SlvIcon },
  props: submenuProps,
  setup(props) {
    // methods
    // render
    const renderSlotTitle = (meta: SlvRouteMeta) => {
      return () => (
        <>
          {meta.icon && (
            <SlvIcon icon={meta.icon} is-custom-svg={meta.isCustomSvg} />
          )}
          <span>{meta.title}</span>
        </>
      )
    }

    return () => {
      const { path, meta } = props.itemOrMenu
      return (
        <el-sub-menu index={path} popper-append-to-body>
          {{
            title: renderSlotTitle(meta)
          }}
          <slot />
        </el-sub-menu>
      )
    }
  }
})

export type SlvSubmenu = InstanceType<typeof SlvSubmenu>

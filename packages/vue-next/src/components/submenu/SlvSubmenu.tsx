import { defineComponent, type ExtractPropTypes, type PropType } from 'vue'
import { ElSubMenu } from 'element-plus'
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
  setup(props, { slots }) {
    // methods
    // render
    const renderSubmenuTitle = (meta: SlvRouteMeta) => {
      const { title, icon, isCustomSvg } = meta
      return () => (
        <>
          {icon && <SlvIcon icon={icon} isCustomSvg={isCustomSvg} />}
          <span>{title}</span>
        </>
      )
    }

    return () => {
      const { path, meta } = props.itemOrMenu
      return (
        <ElSubMenu index={path} popperAppendToBody>
          {{
            title: renderSubmenuTitle(meta),
            default: slots.default
          }}
        </ElSubMenu>
      )
    }
  }
})

export type SlvSubmenu = InstanceType<typeof SlvSubmenu>

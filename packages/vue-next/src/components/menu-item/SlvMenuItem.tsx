import { defineComponent, type ExtractPropTypes, type PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SlvIcon } from '@/components/icon'
import type { SlvRouteMeta, SlvRouteRecord } from '@/types'
import { isExternal } from '@/utils'
import { useGlobalConfig, useNamespace } from '@/composables'

export const menuItemProps = {
  itemOrMenu: {
    type: Object as PropType<SlvRouteRecord>,
    required: true
  }
} as const

export type SlvMenuItemProps = ExtractPropTypes<typeof menuItemProps>

export const SlvMenuItem = defineComponent({
  name: 'SlvMenuItem',
  components: { SlvIcon },
  props: menuItemProps,
  setup(props) {
    // store
    const route = useRoute()
    const router = useRouter()

    // composable
    const ns = useNamespace('menu-item')
    const isHashRouteMode = useGlobalConfig('isHashRouteMode')

    // methods
    const handleMenuItemClick = () => {
      const { path, meta } = props.itemOrMenu
      const target = meta.target
      if (target === '_blank') {
        if (isExternal(path)) {
          window.open(path)
        } else if (route.fullPath !== path) {
          window.open(isHashRouteMode.value ? `/#${path}` : path)
        }
      } else {
        if (isExternal(path)) window.location.href = path
        else if (route.fullPath !== path) router.push(path)
      }
    }
    // render
    const renderIcon = (meta: SlvRouteMeta) => {
      return (
        meta.icon && (
          <SlvIcon icon={meta.icon} is-custom-svg={meta.isCustomSvg} />
        )
      )
    }
    const renderBadge = (meta: SlvRouteMeta) => {
      return (
        meta.badge && (
          <el-tag effect="dark" type="danger">
            {meta.badge}
          </el-tag>
        )
      )
    }
    const renderDot = (meta: SlvRouteMeta) => {
      return (
        meta.dot && (
          <span class={ns.e('dot')}>
            <span />
          </span>
        )
      )
    }

    return () => {
      const { meta, path } = props.itemOrMenu
      return (
        <el-menu-item class={ns.b()} index={path} onClick={handleMenuItemClick}>
          {renderIcon(meta)}
          <span title={meta.title}>{meta.title}</span>
          {renderBadge(meta)}
          {renderDot(meta)}
        </el-menu-item>
      )
    }
  }
})

export type SlvMenuItem = InstanceType<typeof SlvMenuItem>

import { defineComponent, type ExtractPropTypes, type PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMenuItem, ElTag } from 'element-plus'
import { SlvIcon } from '@/components/icon'
import { useSettingStore } from '@/store/setting'
import { useNamespace } from '@/composables/useNamespace'
import { useGlobalConfig } from '@/composables/useGlobalConfig'
import { isExternal } from '@/utils'
import { EDeviceType, type SlvRouteMeta, type SlvRouteRecord } from '@/types'

export const menuItemProps = {
  itemOrMenu: {
    type: Object as PropType<SlvRouteRecord>,
    required: true
  }
} as const

export type SlvMenuItemProps = ExtractPropTypes<typeof menuItemProps>

export const SlvMenuItem = defineComponent({
  name: 'SlvMenuItem',
  props: menuItemProps,
  setup(props) {
    // store
    const route = useRoute()
    const router = useRouter()
    const settingStore = useSettingStore()
    const { device } = storeToRefs(settingStore)

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
        else if (route.fullPath !== path) {
          if (device.value === EDeviceType.MOBILE) {
            settingStore.setFoldSidebar(true)
          }
          router.push(path)
        }
      }
    }
    // render
    const renderIcon = (meta: SlvRouteMeta) => {
      return (
        meta.icon && <SlvIcon icon={meta.icon} isCustomSvg={meta.isCustomSvg} />
      )
    }
    const renderTitle = (meta: SlvRouteMeta) => {
      return <span title={meta.title}>{meta.title}</span>
    }
    const renderBadge = (meta: SlvRouteMeta) => {
      return (
        meta.badge && (
          <ElTag effect="dark" type="danger">
            {meta.badge}
          </ElTag>
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
        <ElMenuItem class={ns.b()} index={path} onClick={handleMenuItemClick}>
          {renderIcon(meta)}
          {renderTitle(meta)}
          {renderBadge(meta)}
          {renderDot(meta)}
        </ElMenuItem>
      )
    }
  }
})

export type SlvMenuItemInstance = InstanceType<typeof SlvMenuItem>

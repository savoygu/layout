import {
  computed,
  defineComponent,
  type ExtractPropTypes,
  type PropType
} from 'vue'
import { storeToRefs } from 'pinia'
import { ElMenu, ElScrollbar } from 'element-plus'
import { SlvTheMenu } from '@/components/the-menu'
import { SlvLogo } from '@/components/logo'
import { useRouteStore } from '@/store/route'
import { useSettingStore } from '@/store/setting'
import { useGlobalConfig, useNamespace } from '@/composables'
import variables from '@/styles/menu.module.scss'
import { ELayoutType } from '@/types'

export const sidebarProps = {
  layout: {
    type: String as PropType<ELayoutType>,
    default: ELayoutType.VERTICAL
  }
} as const

export type SlvSidebarProps = ExtractPropTypes<typeof sidebarProps>

export const SlvSidebar = defineComponent({
  name: 'SlvSidebar',
  props: sidebarProps,
  setup(props) {
    // store
    const routeStore = useRouteStore()
    const settingStore = useSettingStore()
    const { activeMenu, routes, partialRoutes } = storeToRefs(routeStore)
    const { foldSidebar } = storeToRefs(settingStore)

    // composable
    const ns = useNamespace('sidebar')
    const globalConfig = useGlobalConfig()

    // computed
    const finalRoutes = computed(() => {
      return props.layout === ELayoutType.COMPREHENSIVE
        ? partialRoutes.value
        : routes.value.flatMap((route) => {
            return route.meta.noOneLevel && route.children
              ? [...route.children]
              : route
          })
    })
    const showLogo = computed(() => {
      return [
        ELayoutType.COMPREHENSIVE,
        ELayoutType.VERTICAL,
        ELayoutType.FLOAT
      ].includes(props.layout)
    })

    return () => (
      <ElScrollbar class={[ns.b(), ns.is('folded', foldSidebar.value)]}>
        {showLogo.value && <SlvLogo layout={props.layout} />}
        <ElMenu
          activeTextColor={variables.menuColorActive}
          backgroundColor={variables.menuBgColor}
          collapse={foldSidebar.value}
          collapseTransition={false}
          defaultActive={activeMenu.value}
          defaultOpeneds={globalConfig.value.defaultOpeneds}
          menuTrigger="click"
          mode="vertical"
          textColor={variables.menuColor}
          uniqueOpened={globalConfig.value.uniqueOpened}
        >
          {finalRoutes.value.map((route, index) => {
            return (
              route.meta &&
              !route.meta.hidden && (
                <SlvTheMenu key={index + route.name} route={route} />
              )
            )
          })}
        </ElMenu>
      </ElScrollbar>
    )
  }
})

export type SlvSidebarInstance = InstanceType<typeof SlvSidebar>

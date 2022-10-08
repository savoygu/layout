import { storeToRefs } from 'pinia'
import {
  computed,
  defineComponent,
  type ExtractPropTypes,
  type PropType
} from 'vue'
import { SlvLogo, SlvTheMenu } from '@/components'
import { useRouteStore, useSettingStore } from '@/store'
import variables from '@/styles/menu.module.scss'
import { ELayoutType } from '@/types'
import { useGlobalConfig, useNamespace } from '@/composables'

export const sidebarProps = {
  layout: {
    type: String as PropType<ELayoutType>,
    default: ELayoutType.VERTICAL
  }
} as const

export type SlvSidebarProps = ExtractPropTypes<typeof sidebarProps>

export const SlvSidebar = defineComponent({
  name: 'SlvSidebar',
  components: { SlvLogo, SlvTheMenu },
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
      <div class={[ns.b(), ns.is('folded', foldSidebar.value)]}>
        <SlvLogo v-if={showLogo.value} layout={props.layout} />
        <el-menu
          active-text-color={variables.menuColorActive}
          background-color={variables.menuBackgroundColor}
          collapse={foldSidebar.value}
          collapse-transition={false}
          default-active={activeMenu}
          default-openeds={globalConfig.value.defaultOpeneds}
          menu-trigger="click"
          mode="vertical"
          text-color={variables.menuColor}
          unique-opened={globalConfig.value.uniqueOpened}
        >
          {finalRoutes.value.map((route, index) => {
            return (
              <SlvTheMenu
                v-if={route.meta && !route.meta.hidden}
                key={index + route.name}
                route={route}
              />
            )
          })}
        </el-menu>
      </div>
    )
  }
})

export type SlvSidebar = InstanceType<typeof SlvSidebar>

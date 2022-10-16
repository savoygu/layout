import {
  computed,
  defineComponent,
  unref,
  type ExtractPropTypes,
  type PropType
} from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  ElCol,
  ElRow,
  ElTabPane,
  ElTabs,
  type TabsPaneContext
} from 'element-plus'
import { SlvBreadcrumb, SlvFold, SlvIcon } from '@/components'
import { useRouteStore } from '@/store/route'
import { useNamespace } from '@/composables'
import { isExternal } from '@/utils'
import { ELayoutType, type SlvRouteMeta, type SlvRouteRecord } from '@/types'

export const navbarProps = {
  layout: {
    type: String as PropType<ELayoutType>
  }
} as const

export type SlvNavbarProps = ExtractPropTypes<typeof navbarProps>

export const SlvNavbar = defineComponent({
  name: 'SlvNavbar',
  props: navbarProps,
  setup(props, { slots }) {
    // store
    const router = useRouter()
    const store = useRouteStore()
    const { routes, activeRoute, activeTab } = storeToRefs(store)

    // composable
    const ns = useNamespace('navbar')

    // computed
    const finalRoutes = computed(() => {
      return routes.value.filter(
        (route) => route.meta && route.meta.hidden !== true
      )
    })

    // methods
    const handleTabClick = (tab: TabsPaneContext) => {
      if (tab.props.name === activeTab.value) return
      store.setActiveTab(tab.props.name as string)

      const route = unref(activeRoute) as SlvRouteRecord
      if (isExternal(route.path)) {
        window.open(route.path)
        router.push('/')
      } else {
        router.push(route.redirect || route)
      }
    }
    // render
    const renderTabPaneLabel = (meta: SlvRouteMeta) => {
      const { title, icon, isCustomSvg } = meta
      return () => (
        <span>
          {icon && (
            <SlvIcon
              icon={icon}
              isCustomSvg={isCustomSvg}
              style="min-width: 16px"
            />
          )}
          {title}
        </span>
      )
    }

    return () => (
      <div class={ns.b()}>
        <ElRow gutter={15}>
          <ElCol lg={12} md={12} sm={12} xl={12} xs={4}>
            <div class={ns.e('left-panel')}>
              {props.layout !== ELayoutType.FLOAT && <SlvFold />}
              {props.layout === ELayoutType.COMPREHENSIVE ? (
                <ElTabs
                  v-model={activeTab.value}
                  tabPosition="top"
                  onTabClick={handleTabClick}
                >
                  {finalRoutes.value.map((route, index) => {
                    const { meta, name } = route
                    return (
                      <ElTabPane
                        key={index + name}
                        name={name}
                        v-slots={{
                          label: renderTabPaneLabel(meta)
                        }}
                      ></ElTabPane>
                    )
                  })}
                </ElTabs>
              ) : (
                <SlvBreadcrumb />
              )}
            </div>
          </ElCol>
          <ElCol lg={12} md={12} sm={12} xl={12} xs={4}>
            <div class={ns.e('right-panel')}>{slots.navbar?.()}</div>
          </ElCol>
        </ElRow>
      </div>
    )
  }
})

export type SlvNavbarInstance = InstanceType<typeof SlvNavbar>

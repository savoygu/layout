import { storeToRefs } from 'pinia'
import {
  computed,
  defineComponent,
  unref,
  type ExtractPropTypes,
  type PropType
} from 'vue'
import { useRouter } from 'vue-router'
import { SlvBreadcrumb, SlvFold, SlvIcon } from '@/components'
import { ELayoutType, type SlvRouteRecord, type SlvTab } from '@/types'
import { useRouteStore } from '@/store/route'
import { isExternal } from '@/utils'
import { useNamespace } from '@/composables'

export const navbarProps = {
  layout: {
    type: String as PropType<ELayoutType>
  }
} as const

export type SlvNavbarProps = ExtractPropTypes<typeof navbarProps>

export const SlvNavbar = defineComponent({
  name: 'SlvNavbar',
  components: { SlvBreadcrumb, SlvFold, SlvIcon },
  props: navbarProps,
  setup(props) {
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
    const handleTabClick = (tab: SlvTab) => {
      if (tab.name === activeTab.value) return
      store.setActiveTab(tab.name)

      const route = unref(activeRoute) as SlvRouteRecord
      if (isExternal(route.path)) {
        window.open(route.path)
        router.push('/')
      } else {
        router.push(route.redirect || route)
      }
    }

    return () => (
      <div class={ns.b()}>
        <el-row gutter={15}>
          <el-col lg={12} md={12} sm={12} xl={12} xs={4}>
            <div class={ns.e('left-panel')}>
              {props.layout !== ELayoutType.FLOAT && <SlvFold />}
              {props.layout === ELayoutType.COMPREHENSIVE ? (
                <el-tabs
                  value={activeTab.value}
                  tab-position="top"
                  onTabClick={handleTabClick}
                >
                  {finalRoutes.value.map((route, index) => {
                    const { meta, name } = route
                    return (
                      <el-tab-pane key={index + name} name={name}>
                        {{
                          label: () => (
                            <span>
                              {meta.icon && (
                                <SlvIcon
                                  icon={meta.icon}
                                  is-custom-svg={meta.isCustomSvg}
                                  style="min-width: 16px"
                                />
                              )}
                              {meta.title}
                            </span>
                          )
                        }}
                      </el-tab-pane>
                    )
                  })}
                </el-tabs>
              ) : (
                <SlvBreadcrumb />
              )}
            </div>
          </el-col>
        </el-row>
      </div>
    )
  }
})

export type SlvNavbar = InstanceType<typeof SlvNavbar>

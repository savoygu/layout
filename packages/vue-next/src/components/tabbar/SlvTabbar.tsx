import { storeToRefs } from 'pinia'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SlvIcon } from '@/components'
import type { SlvRoute, SlvRouteRecord, SlvTab } from '@/types'
import { getActiveMenuByRoute, useRouteStore } from '@/store/route'
import { useTabbarStore, getTabByRoute } from '@/store/tabbar'
import { useElNamespace, useGlobalConfig, useNamespace } from '@/composables'

export type SlvTabbarContextMenu = {
  position: {
    left: number
    top: number
  }
  route: SlvTab | null
  visible: boolean
}

export const SlvTabbar = defineComponent({
  name: 'SlvTabbar',
  components: { SlvIcon },
  setup() {
    // store
    const router = useRouter()
    const route = useRoute() as SlvRoute
    const routeStore = useRouteStore()
    const tabbarStore = useTabbarStore()
    const { routes } = storeToRefs(routeStore)
    const { visitedRoutes } = storeToRefs(tabbarStore)

    // composable
    const ns = useNamespace('tabbar')
    const nsEl = useElNamespace('dropdown-menu')
    const tabbarStyle = useGlobalConfig('tabbarStyle')

    // data
    const tabbarRef = ref<HTMLDivElement | null>(null)
    const tabActive = ref('')
    const tabMoreActive = ref(false)
    const contextmenu = reactive<SlvTabbarContextMenu>({
      position: {
        left: 0,
        top: 0
      },
      route: null,
      visible: false
    })

    // computed
    const tabbarClass = computed(() => {
      return {
        [ns.em('list', tabbarStyle.value)]: true
      }
    })
    const contextmenuStyle = computed(() => {
      const { left, top } = contextmenu.position
      return {
        left: left + 'px',
        top: top + 'px'
      }
    })

    // methods
    const isClosable = (route: SlvTab) => {
      return !route.meta.noClosable
    }
    const isActive = (path: string) => {
      return getActiveMenuByRoute(route, true) === path
    }
    const isFirstVisitedRoute = (route: SlvTabbarContextMenu['route']) => {
      return route && visitedRoutes.value.indexOf(route) === 0
    }
    const isLastVisitedRoute = (route: SlvTabbarContextMenu['route']) => {
      const routes = visitedRoutes.value
      return route && routes.indexOf(route) === routes.length - 1
    }
    const addTab = async (route: SlvRoute | SlvRouteRecord) => {
      const tab = getTabByRoute(route)
      if (tab) {
        await tabbarStore.addTab(tab)
        tabActive.value = tab.path
      }
    }
    const initTabs = (routes: SlvRouteRecord[]) => {
      routes.forEach((route) => {
        if (route.meta.noClosable) {
          addTab(route)
        }
        if (route.children && route.children.length) {
          initTabs(route.children)
        }
      })
    }
    const toLastTab = () => {
      const lastTab = visitedRoutes.value.at(-1)
      if (lastTab && isActive(lastTab.path)) {
        return
      }
      router.push((lastTab as unknown as SlvRouteRecord) ?? '/')
    }
    const handleTabClick = <T extends { name: string; index: number }>(
      tab: T
    ) => {
      if (!isActive(tab.name)) {
        router.push(visitedRoutes.value[tab.index] as unknown as SlvRouteRecord)
      }
    }
    const handleTabRemove = (path: string) => {
      tabbarStore.removeTab(path)
      if (isActive(path)) toLastTab()
    }
    const handleContextMenuOpen = (event: MouseEvent, route: SlvTab) => {
      event.preventDefault()

      const tabbarEl = tabbarRef.value
      if (!tabbarEl) return

      const rect = tabbarEl.getBoundingClientRect()
      console.log(rect, tabbarEl.offsetWidth, event.clientX, event.clientY)
      contextmenu.position.left = Math.round(
        Math.min(event.clientX - rect.left, tabbarEl.offsetWidth)
      )
      contextmenu.position.top = Math.round(event.clientY - rect.top)
      contextmenu.route = route
      contextmenu.visible = true
    }
    const closeContextmenu = () => {
      contextmenu.visible = false
      contextmenu.route = null
    }
    const handleOthersTabsClose = () => {
      const currentRoute = contextmenu.route
      if (currentRoute) {
        tabbarStore.removeOtherTabs(currentRoute.path)
        if (!isActive(currentRoute.path)) {
          router.push(currentRoute as unknown as SlvRouteRecord)
        }
      } else {
        tabbarStore.removeOtherTabs(getActiveMenuByRoute(route, true))
      }
      closeContextmenu()
    }
    const handleLeftTabsClose = () => {
      const currentRoute = contextmenu.route
      if (currentRoute) {
        tabbarStore.removeLeftTabs(currentRoute.path)
        if (!isActive(currentRoute.path)) {
          router.push(currentRoute as unknown as SlvRouteRecord)
        }
      } else {
        tabbarStore.removeLeftTabs(getActiveMenuByRoute(route, true))
      }
      closeContextmenu()
    }
    const handleRightTabsClose = () => {
      const currentRoute = contextmenu.route
      if (currentRoute) {
        tabbarStore.removeRightTabs(currentRoute.path)
        if (!isActive(currentRoute.path)) {
          router.push(currentRoute as unknown as SlvRouteRecord)
        }
      } else {
        tabbarStore.removeRightTabs(getActiveMenuByRoute(route, true))
      }
      closeContextmenu()
    }
    const handleAllTabsClose = () => {
      tabbarStore.removeAllTabs()
      toLastTab()
      closeContextmenu()
    }
    const handleCommand = (command: string) => {
      switch (command) {
        case 'closeOthersTabs':
          handleOthersTabsClose()
          break
        case 'closeLeftTabs':
          handleLeftTabsClose()
          break
        case 'closeRightTabs':
          handleRightTabsClose()
          break
        case 'closeAllTabs':
          handleAllTabsClose()
          break
      }
    }
    const handleVisibleChange = (value: boolean) => {
      tabMoreActive.value = value
    }
    // render
    const renderSlotLabel = (route: SlvTab) => {
      const { meta, parentIcon } = route
      return () => (
        <span
          class={ns.e('label')}
          onContextmenu={($event) => handleContextMenuOpen($event, route)}
        >
          {meta.icon ? (
            <SlvIcon icon={meta.icon} is-custom-svg={meta.isCustomSvg} />
          ) : (
            parentIcon && <SlvIcon icon={parentIcon} />
          )}
          <span>{route.meta.title}</span>
        </span>
      )
    }
    const renderSlotDropdown = () => (
      <el-dropdown-menu>
        <el-dropdown-item command="closeOthersTabs">
          <SlvIcon icon="close-line" />
          <span>关闭其他</span>
        </el-dropdown-item>
        <el-dropdown-item command="closeLeftTabs">
          <SlvIcon icon="arrow-left-line" />
          <span>关闭左侧</span>
        </el-dropdown-item>
        <el-dropdown-item command="closeRightTabs">
          <SlvIcon icon="arrow-right-line" />
          <span>关闭右侧</span>
        </el-dropdown-item>
        <el-dropdown-item command="closeAllTabs">
          <SlvIcon icon="close-line" />
          <span>关闭全部</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    )
    const renderContextMenu = () =>
      contextmenu.visible && (
        <ul
          class={[ns.e('contextmenu'), nsEl.b(), nsEl.m('small')]}
          style={contextmenuStyle.value}
        >
          <li
            class={[
              nsEl.e('item'),
              nsEl.is('disabled', visitedRoutes.value.length === 1)
            ]}
            onClick={handleOthersTabsClose}
          >
            <SlvIcon icon="close-line" />
            <span>关闭其他</span>
          </li>
          <li
            class={[
              nsEl.e('item'),
              nsEl.is('disabled', isFirstVisitedRoute(contextmenu.route))
            ]}
            onClick={handleLeftTabsClose}
          >
            <SlvIcon icon="arrow-left-line" />
            <span>关闭左侧</span>
          </li>
          <li
            class={[
              nsEl.e('item'),
              nsEl.is('disabled', isLastVisitedRoute(contextmenu.route))
            ]}
            onClick={handleRightTabsClose}
          >
            <SlvIcon icon="arrow-right-line" />
            <span>关闭右侧</span>
          </li>
          <li class={nsEl.e('item')} onClick={handleAllTabsClose}>
            <SlvIcon icon="close-line" />
            <span>关闭全部</span>
          </li>
        </ul>
      )

    // lifecycle
    onMounted(() => {
      initTabs(routes.value)
    })

    // watch
    watch(
      () => route.path,
      () => {
        addTab(route)
      },
      { immediate: true }
    )

    return () => (
      <div ref="tabbarRef" class={ns.b()}>
        <el-tabs
          v-model={tabActive.value}
          class={[ns.e('list'), tabbarClass.value]}
          type="card"
          onTabClick={handleTabClick}
          onTabRemove={handleTabRemove}
        >
          {visitedRoutes.value.map((route) => {
            return (
              <el-tab-pane
                key={route.path}
                closable={isClosable(route)}
                name={route.path}
                v-slots={{
                  label: renderSlotLabel(route)
                }}
              ></el-tab-pane>
            )
          })}
        </el-tabs>
        <el-dropdown
          size="small"
          onCommand={handleCommand}
          onVisibleChange={handleVisibleChange}
          v-slots={{ dropdown: renderSlotDropdown }}
        >
          <SlvIcon
            icon="el-icon-menu"
            class={[ns.e('more'), ns.is('active', tabMoreActive.value)]}
          />
        </el-dropdown>
        {renderContextMenu()}
      </div>
    )
  }
})

export type SlvTabbar = InstanceType<typeof SlvTabbar>

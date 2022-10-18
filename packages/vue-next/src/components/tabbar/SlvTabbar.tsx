import { computed, defineComponent, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElTabPane,
  ElTabs,
  type TabPaneName,
  type TabsPaneContext
} from 'element-plus'
import { SlvIcon } from '@/components/icon'
import { getActiveMenuByRoute, useRouteStore } from '@/store/route'
import { useTabbarStore, getTabByRoute } from '@/store/tabbar'
import { useElNamespace, useGlobalConfig, useNamespace } from '@/composables'
import type { SlvRoute, SlvRouteRecord, SlvTab } from '@/types'

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
    const dNs = useElNamespace('dropdown-menu')
    const tabbarStyle = useGlobalConfig('tabbarStyle')

    // data
    const tabbarRef = ref<HTMLDivElement | null>(null)
    const tabActive = ref('')
    const tabMoreActive = ref(false)
    const contextMenu = reactive<SlvTabbarContextMenu>({
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
    const contextMenuStyle = computed(() => {
      const { left, top } = contextMenu.position
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
    const handleTabClick = (tab: TabsPaneContext) => {
      if (!isActive(tab.props.name as string)) {
        router.push(visitedRoutes.value[Number(tab.index)])
      }
    }
    const handleTabRemove = (path: TabPaneName) => {
      tabbarStore.removeTab(path as string)
      if (isActive(path as string)) toLastTab()
    }
    const handleContextMenuOpen = (event: MouseEvent, route: SlvTab) => {
      event.preventDefault()

      const tabbarEl = tabbarRef.value
      if (!tabbarEl) return

      const rect = tabbarEl.getBoundingClientRect()
      contextMenu.position.left = Math.round(
        Math.min(event.clientX - rect.left, tabbarEl.offsetWidth)
      )
      contextMenu.position.top = Math.round(event.clientY - rect.top)
      contextMenu.route = route
      contextMenu.visible = true
    }
    const closeContextMenu = () => {
      contextMenu.visible = false
      contextMenu.route = null
    }
    const handleOthersTabsClose = () => {
      const currentRoute = contextMenu.route
      if (currentRoute) {
        tabbarStore.removeOtherTabs(currentRoute.path)
        if (!isActive(currentRoute.path)) {
          router.push(currentRoute as unknown as SlvRouteRecord)
        }
      } else {
        tabbarStore.removeOtherTabs(getActiveMenuByRoute(route, true))
      }
      closeContextMenu()
    }
    const handleLeftTabsClose = () => {
      const currentRoute = contextMenu.route
      if (currentRoute) {
        tabbarStore.removeLeftTabs(currentRoute.path)
        if (!isActive(currentRoute.path)) {
          router.push(currentRoute as unknown as SlvRouteRecord)
        }
      } else {
        tabbarStore.removeLeftTabs(getActiveMenuByRoute(route, true))
      }
      closeContextMenu()
    }
    const handleRightTabsClose = () => {
      const currentRoute = contextMenu.route
      if (currentRoute) {
        tabbarStore.removeRightTabs(currentRoute.path)
        if (!isActive(currentRoute.path)) {
          router.push(currentRoute as unknown as SlvRouteRecord)
        }
      } else {
        tabbarStore.removeRightTabs(getActiveMenuByRoute(route, true))
      }
      closeContextMenu()
    }
    const handleAllTabsClose = () => {
      tabbarStore.removeAllTabs()
      toLastTab()
      closeContextMenu()
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
    const renderTabPaneLabel = (route: SlvTab) => {
      const { meta, parentIcon } = route
      return () => (
        <span
          class={ns.e('label')}
          onContextmenu={($event) => handleContextMenuOpen($event, route)}
        >
          {meta.icon ? (
            <SlvIcon icon={meta.icon} isCustomSvg={meta.isCustomSvg} />
          ) : (
            parentIcon && <SlvIcon icon={parentIcon} />
          )}
          <span>{route.meta.title}</span>
        </span>
      )
    }
    const renderDropdownMenu = () => (
      <ElDropdownMenu class={ns.e('dropdown-menu')}>
        <ElDropdownItem command="closeOthersTabs">
          <SlvIcon icon="close-line" />
          <span>关闭其他</span>
        </ElDropdownItem>
        <ElDropdownItem command="closeLeftTabs">
          <SlvIcon icon="arrow-left-line" />
          <span>关闭左侧</span>
        </ElDropdownItem>
        <ElDropdownItem command="closeRightTabs">
          <SlvIcon icon="arrow-right-line" />
          <span>关闭右侧</span>
        </ElDropdownItem>
        <ElDropdownItem command="closeAllTabs">
          <SlvIcon icon="close-line" />
          <span>关闭全部</span>
        </ElDropdownItem>
      </ElDropdownMenu>
    )
    const renderDropdownDefault = () => (
      <SlvIcon
        icon="function-fill"
        class={[ns.e('more'), ns.is('active', tabMoreActive.value)]}
      />
    )
    const renderContextMenu = () =>
      contextMenu.visible && (
        <ul
          class={[ns.e('context-menu'), dNs.b()]}
          style={contextMenuStyle.value}
        >
          <li
            class={[
              dNs.e('item'),
              dNs.is('disabled', visitedRoutes.value.length === 1)
            ]}
            onClick={handleOthersTabsClose}
          >
            <SlvIcon icon="close-line" />
            <span>关闭其他</span>
          </li>
          <li
            class={[
              dNs.e('item'),
              dNs.is('disabled', isFirstVisitedRoute(contextMenu.route))
            ]}
            onClick={handleLeftTabsClose}
          >
            <SlvIcon icon="arrow-left-line" />
            <span>关闭左侧</span>
          </li>
          <li
            class={[
              dNs.e('item'),
              dNs.is('disabled', isLastVisitedRoute(contextMenu.route))
            ]}
            onClick={handleRightTabsClose}
          >
            <SlvIcon icon="arrow-right-line" />
            <span>关闭右侧</span>
          </li>
          <li class={dNs.e('item')} onClick={handleAllTabsClose}>
            <SlvIcon icon="close-line" />
            <span>关闭全部</span>
          </li>
        </ul>
      )

    // lifecycle
    initTabs(routes.value)

    // watch
    watch(
      () => route.path,
      () => {
        addTab(route)
      },
      { immediate: true }
    )

    return () => (
      <div ref={tabbarRef} class={ns.b()}>
        <ElTabs
          v-model={tabActive.value}
          class={[ns.e('list'), tabbarClass.value]}
          type="card"
          onTabClick={handleTabClick}
          onTabRemove={handleTabRemove}
        >
          {visitedRoutes.value.map((route) => {
            return (
              <ElTabPane
                key={route.path}
                closable={isClosable(route)}
                name={route.path}
                v-slots={{
                  label: renderTabPaneLabel(route)
                }}
              ></ElTabPane>
            )
          })}
        </ElTabs>
        <ElDropdown
          onCommand={handleCommand}
          onVisible-change={handleVisibleChange}
          v-slots={{
            default: renderDropdownDefault,
            dropdown: renderDropdownMenu
          }}
        ></ElDropdown>
        {renderContextMenu()}
      </div>
    )
  }
})

export type SlvTabbarInstance = InstanceType<typeof SlvTabbar>

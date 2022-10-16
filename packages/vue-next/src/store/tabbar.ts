import { defineStore } from 'pinia'
import { getActiveMenuByRoute } from './route'
import type { SlvRoute, SlvRouteRecord, SlvTab } from '@/types'

export type TabbarState = {
  visitedRoutes: SlvTab[]
}

export const useTabbarStore = defineStore('tabbar', {
  state: (): TabbarState => ({
    visitedRoutes: []
  }),
  getters: {},
  actions: {
    addTab(route: SlvTab) {
      const currentRoute = this.visitedRoutes.find(
        (item) => item.path === route.path
      )
      // 如果已经添加过该路由，要确保不是动态参数路由
      if (currentRoute && !route.meta.openNewTab) {
        this.visitedRoutes = this.visitedRoutes.map((item) => {
          if (item.path === route.path) {
            return Object.assign(item, route)
          }
          return item
        })
      } else if (!currentRoute) {
        this.visitedRoutes.push(Object.assign({}, route))
      }

      // 如果所有访问过的路由都未配置 noClosable，默认第一个 tab 不可关闭
      const hasNoClosableRoute = this.visitedRoutes.find(
        (item) => item.meta.noClosable
      )
      if (!hasNoClosableRoute) {
        if (this.visitedRoutes[0].meta) {
          this.visitedRoutes[0].meta.noClosable = true
        }
      }
    },
    removeTab(path: SlvTab['path']) {
      this.visitedRoutes.splice(
        this.visitedRoutes.findIndex((route) => route.path === path),
        1
      )
    },
    removeOtherTabs(path: SlvTab['path']) {
      this.visitedRoutes = this.visitedRoutes.filter(
        (route) => route.path === path || route.meta.noClosable
      )
    },
    removeLeftTabs(path: SlvTab['path']) {
      let found = false
      this.visitedRoutes = this.visitedRoutes.filter((route) => {
        if (route.path === path) found = true
        return route.meta.noClosable || found
      })
    },
    removeRightTabs(path: SlvTab['path']) {
      let found = false
      this.visitedRoutes = this.visitedRoutes.filter((route) => {
        const close = found
        if (route.path === path) found = true
        return route.meta.noClosable || !close
      })
    },
    removeAllTabs() {
      this.visitedRoutes = this.visitedRoutes.filter((route) => {
        return route.meta.noClosable
      })
    }
  }
})

export const getTabByRoute = <T extends SlvRoute | SlvRouteRecord>(
  route: T
): SlvTab | undefined => {
  let parentIcon = null
  if ('matched' in route) {
    for (let i = route.matched.length - 2; i >= 0; i--) {
      if (!parentIcon && route.matched[i].meta.icon) {
        parentIcon = route.matched[i].meta.icon
        break
      }
    }
  }
  if (!parentIcon) parentIcon = 'menu-line'
  const path = getActiveMenuByRoute(route as SlvRoute, true)
  if (route.name && route.meta && route.meta.noTab !== true) {
    return {
      name: route.name as string,
      path,
      query: (route as SlvRoute)?.query ?? {},
      params: (route as SlvRoute)?.params ?? {},
      parentIcon,
      meta: route.meta
    }
  }
}

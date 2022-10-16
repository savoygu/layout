import { resolve } from 'node:path'
import { defineStore } from 'pinia'
import qs from 'qs'
import type { SlvRoute, SlvRouteRecord } from '@/types'
import { isExternal } from '@/utils'

export type RouteState = {
  activeTab: string
  activeMenu: string
  routes: SlvRouteRecord[]
}

export const useRouteStore = defineStore('route', {
  state: (): RouteState => ({
    activeTab: '', // 当前标签页 — 路由名称
    activeMenu: '', // 当前激活菜单
    routes: [] // 所有路由
  }),
  getters: {
    activeRoute(state) {
      return state.activeTab
        ? state.routes.find((route) => route.name === state.activeTab)
        : {
            path: '',
            meta: { title: '' },
            redirect: '404'
          }
    },
    partialRoutes(state) {
      return (
        state.routes.find((route) => route.name === state.activeTab)
          ?.children ?? []
      )
    }
  },
  actions: {
    setActiveTab(activeTab: RouteState['activeTab']) {
      this.activeTab = activeTab
    },
    setActiveMenu(activeMenu: RouteState['activeMenu']) {
      this.activeMenu = activeMenu
    },
    setRoutes({
      routes,
      staticRoutes,
      dynamicRoutes
    }: {
      routes: SlvRouteRecord[]
      staticRoutes: SlvRouteRecord[]
      dynamicRoutes: SlvRouteRecord[]
    }) {
      this.routes = resolveRoutes([
        ...(staticRoutes ?? []),
        ...(dynamicRoutes ?? []),
        ...(routes ?? [])
      ])
    }
  }
})

export const getActiveMenuByRoute = (route: SlvRoute, isTabbar = false) => {
  const { path, meta, query, matched } = route
  const rawPath = matched?.at(-1)?.path ?? path
  const fullPath =
    query && Object.keys(query).length ? `${path}?${qs.stringify(query)}` : path
  if (isTabbar) return meta.openNewTab ? fullPath : rawPath
  if (meta.activeMenu) return meta.activeMenu
  return fullPath
}

export const resolveRoutes = (routes: SlvRouteRecord[], baseUrl = '/') => {
  return routes.map((route) => {
    if (route.path !== '*' && !isExternal(route.path)) {
      route.path = resolve(baseUrl, route.path)
    }

    if (route.children && route.children.length > 0) {
      route.children = resolveRoutes(route.children, route.path)

      if (route.children.length > 0) {
        route.childrenPathList = route.children.flatMap(
          (_) => _.childrenPathList ?? []
        )

        if (!route.redirect) {
          const firstChild = route.children[0]
          route.redirect = firstChild.redirect || firstChild.path
        }
      }
    } else {
      route.childrenPathList = [route.path]
    }

    return route
  })
}

export const getMatchedRoutes = (
  routes: SlvRouteRecord[],
  name: string
): SlvRouteRecord[] => {
  return routes
    .filter((route) => (route.childrenPathList ?? []).includes(name))
    .flatMap((route) =>
      route.children
        ? [route, ...getMatchedRoutes(route.children, name)]
        : [route]
    )
}

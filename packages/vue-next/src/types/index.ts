import type { Ref } from 'vue'
import type { RouteLocation, RouteRecordRaw } from 'vue-router'

// 布局
export type SlvConfig = {
  breakpoint?: number
  mobile?: boolean
}

export enum ELayoutType {
  COMPREHENSIVE = 'comprehensive',
  FLOAT = 'float',
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}
export type LayoutType = `${ELayoutType}`

// 设备
export enum EDeviceType {
  MOBILE = 'mobile',
  DESKTOP = 'desktop'
}

export type DeviceType = `${EDeviceType}` // keyof typeof EDeviceType

// 权限
export type GuardType = {
  role?: string[] // 角色
  permission?: string[] // 权限
  /**
   * 模式
   *   allOf: 满足以上全部角色和权限，通过验证
   *   oneOf: 满足以上角色和权限任一个，通过验证
   *   except: 取反，不包含以上角色和权限，通过验证
   */
  mode?: 'allOf' | 'oneOf' | 'except'
}

// 路由
// 【作用范围】: 菜单、面包屑、标签页
export type SlvRouteMeta = {
  title?: string // 菜单列表、面包屑、标签页显示的名称
  icon?: string // 菜单图标
  isCustomSvg?: boolean // 是否自定义 SVG 图标
  guard?: string[] | GuardType // 权限
  target?: '_blank' | false // 在新窗口打开

  // 菜单
  activeMenu?: string // 访问当前路由时，高亮指定菜单
  hidden?: boolean // 是否在菜单中隐藏当前路由
  noKeepAlive?: boolean // 是否不缓存当前路由
  noColumn?: boolean // 是否隐藏侧边栏
  noOneLevel?: boolean // 是否隐藏一级菜单
  dot?: boolean // 是否显示红点
  badge?: string // 徽标内容

  // 面包屑
  noBreadcrumb?: boolean // 是否隐藏面包屑(默认: false, 也就是显示)

  // 标签
  noTab?: boolean // 是否隐藏标签页(默认: false, 也就是显示)
  noClosable?: boolean // 标签页是否不可关闭(默认: false, 也就是可关闭)
  openNewTab?: boolean // 动态传参时，是否新开标签页
}

export type SlvRouteRecord = Omit<
  RouteRecordRaw,
  'name' | 'meta' | 'children'
> & {
  name: string
  meta: SlvRouteMeta
  children?: SlvRouteRecord[]
  childrenPathList?: string[]
  parentIcon?: string
  redirect?: string
}

export type SlvRoute = Omit<RouteLocation, 'meta' | 'matched'> & {
  meta: SlvRouteMeta
  matched: SlvRouteRecord[]
  parentIcon?: string
}

export type SlvTab = Pick<RouteLocation, 'path' | 'query' | 'params'> & {
  name: string
  meta: SlvRouteMeta
  parentIcon?: string
}

export type MaybeRef<T> = T | Ref<T>

import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { SlvIcon } from '@/components/icon'
import { useRouteStore, getMatchedRoutes } from '@/store/route'
import { useNamespace } from '@/composables'

export const SlvBreadcrumb = defineComponent({
  name: 'SlvBreadcrumb',
  setup() {
    // store
    const route = useRoute()
    const routeStore = useRouteStore()
    const { routes } = storeToRefs(routeStore)

    // composable
    const ns = useNamespace('breadcrumb')

    // computed
    const breadcrumbList = computed(() => {
      return getMatchedRoutes(routes.value, route.path).filter(
        (route) => route.meta.noBreadcrumb !== true
      )
    })

    return () => (
      <ElBreadcrumb class={ns.b()} separator=">">
        {breadcrumbList.value.map((route, index) => {
          const { meta, redirect } = route
          return (
            <ElBreadcrumbItem key={index} to={{ path: redirect ?? '' }}>
              {meta.icon && (
                <SlvIcon icon={meta.icon} isCustomSvg={meta.isCustomSvg} />
              )}
              {meta.title && <span>{meta.title}</span>}
            </ElBreadcrumbItem>
          )
        })}
      </ElBreadcrumb>
    )
  }
})

export type SlvBreadcrumbInstance = InstanceType<typeof SlvBreadcrumb>

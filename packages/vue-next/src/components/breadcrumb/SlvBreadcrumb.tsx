import { storeToRefs } from 'pinia'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { SlvIcon } from '@/components/icon'
import { useRouteStore, getMatchedRoutes } from '@/store/route'
import { useNamespace } from '@/composables'

export const SlvBreadcrumb = defineComponent({
  name: 'SlvBreadcrumb',
  components: { SlvIcon },
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
      <el-breadcrumb class={ns.b()} separator=">">
        {breadcrumbList.value.map((route, index) => {
          const { meta, redirect } = route
          return (
            <el-breadcrumb-item key={index} to={{ path: redirect }}>
              {meta.icon && <SlvIcon icon={meta.icon} />}
              {meta.title}
            </el-breadcrumb-item>
          )
        })}
      </el-breadcrumb>
    )
  }
})

export type SlvBreadcrumb = InstanceType<typeof SlvBreadcrumb>

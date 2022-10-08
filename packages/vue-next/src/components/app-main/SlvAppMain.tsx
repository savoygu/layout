import { computed, defineComponent, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { SlvRoute } from '@/types'
import { SlvTheRouteView } from '@/components/the-router-view'
import { getActiveMenuByRoute, useRouteStore } from '@/store/route'
import { useNamespace } from '@/composables'

export const SlvAppMain = defineComponent({
  name: 'SlvAppMain',
  components: { SlvTheRouteView },
  setup() {
    // store
    const route = useRoute() as SlvRoute
    const store = useRouteStore()
    const activeTab = computed(() => store.activeTab)

    // composable
    const ns = useNamespace('app-main')

    // watch
    watch(
      () => route.path,
      () => {
        const matchedFirstRoute = route.matched[0]
        if (activeTab.value !== matchedFirstRoute.name) {
          store.setActiveTab(matchedFirstRoute.name)
        }
        store.setActiveMenu(getActiveMenuByRoute(route))
      },
      { immediate: true }
    )

    return () => (
      <div class={ns.b()}>
        <SlvTheRouteView />
      </div>
    )
  }
})

export type SlvAppMain = InstanceType<typeof SlvAppMain>

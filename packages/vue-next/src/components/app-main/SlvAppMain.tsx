import { computed, defineComponent, watch } from 'vue'
import { useRoute } from 'vue-router'
import { SlvTheRouteView } from '@/components/the-router-view'
import { SlvTheFooter } from '@/components/the-footer'
import { getActiveMenuByRoute, useRouteStore } from '@/store/route'
import { useNamespace } from '@/composables'
import type { SlvRoute } from '@/types'

export const SlvAppMain = defineComponent({
  name: 'SlvAppMain',
  setup(props, { slots }) {
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
        <SlvTheFooter v-slots={{ footer: slots.footer }}></SlvTheFooter>
      </div>
    )
  }
})

export type SlvAppMainInstance = InstanceType<typeof SlvAppMain>

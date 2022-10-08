import { storeToRefs } from 'pinia'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { SlvRoute } from '@/types'
import { getActiveMenuByRoute } from '@/store/route'
import { useTabbarStore } from '@/store/tabbar'
import { useGlobalConfig } from '@/composables'

export const SlvTheRouteView = defineComponent({
  name: 'SlvTheRouteView',
  setup() {
    // store
    const route = useRoute() as SlvRoute
    const tabbarStore = useTabbarStore()
    const { visitedRoutes } = storeToRefs(tabbarStore)

    // provide
    const keepAliveMaxNum = useGlobalConfig('keepAliveMaxNum')

    // data
    const routerKey = ref('')
    const keepAliveNameList = ref<string[]>([])

    // methods
    const updateKeepAliveNameList = () => {
      keepAliveNameList.value = visitedRoutes.value
        .filter((route) => route.meta && !route.meta.noKeepAlive)
        .map((route) => route.name)
    }

    // lifecycle
    onMounted(() => {
      updateKeepAliveNameList()
    })

    // watch
    watch(
      () => route.path,
      () => {
        routerKey.value = getActiveMenuByRoute(route, true)
      },
      { immediate: true }
    )
    watch(visitedRoutes, () => {
      updateKeepAliveNameList()
    })

    return () => (
      <transition mode="out-in" name="fade-transform">
        <keep-alive
          include={keepAliveNameList.value}
          max={keepAliveMaxNum.value}
        >
          <router-view key={routerKey.value} />
        </keep-alive>
      </transition>
    )
  }
})

export type SlvTheRouteView = InstanceType<typeof SlvTheRouteView>

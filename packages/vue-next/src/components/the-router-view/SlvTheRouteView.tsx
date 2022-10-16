import { storeToRefs } from 'pinia'
import {
  defineComponent,
  KeepAlive,
  onMounted,
  ref,
  Transition,
  watch
} from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { getActiveMenuByRoute } from '@/store/route'
import { useTabbarStore } from '@/store/tabbar'
import { useGlobalConfig } from '@/composables/useGlobalConfig'
import type { SlvRoute } from '@/types'

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

    return () => {
      return (
        <RouterView
          v-slots={{
            default: ({ Component }: { Component: any }) => (
              <Transition mode="out-in" name="fade-transform">
                <KeepAlive
                  include={keepAliveNameList.value}
                  max={keepAliveMaxNum.value}
                >
                  <Component key={routerKey.value}></Component>
                </KeepAlive>
              </Transition>
            )
          }}
        ></RouterView>
      )
    }
  }
})

export type SlvTheRouteViewInstance = InstanceType<typeof SlvTheRouteView>

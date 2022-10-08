import { storeToRefs } from 'pinia'
import { defineComponent, type ExtractPropTypes, type PropType } from 'vue'
import { SlvLogo, SlvTheMenu } from '@/components'
import { useRouteStore } from '@/store'
import variables from '@/styles/menu.module.scss'
import { ELayoutType } from '@/types'
import { useNamespace } from '@/composables'

export const theHeaderProps = {
  layout: {
    type: String as PropType<ELayoutType>,
    default: ''
  }
} as const

export type SlvTheHeaderProps = ExtractPropTypes<typeof theHeaderProps>

export const SlvTheHeader = defineComponent({
  name: 'SlvTheHeader',
  components: { SlvLogo, SlvTheMenu },
  props: theHeaderProps,
  setup(props) {
    // store
    const routeStore = useRouteStore()
    const { activeMenu, routes } = storeToRefs(routeStore)

    // composable
    const ns = useNamespace('the-header')
    const lNs = useNamespace('layout')

    return () => {
      const layout = props.layout
      return (
        <div class={ns.b()}>
          <div class={lNs.b('main')}>
            <el-row gutter={20}>
              <el-col span={6}>
                <SlvLogo layout={layout} />
              </el-col>
              <el-col span={18}>
                <div class={ns.e('right-panel')}>
                  <el-menu
                    v-if={layout === ELayoutType.HORIZONTAL}
                    text-color={variables.menuColor}
                    active-text-color={variables.menuColorActive}
                    background-color={variables.menuBackgroundColor}
                    default-active={activeMenu.value}
                    menu-trigger="hover"
                    mode="horizontal"
                  >
                    {routes.value.map((route, index) => (
                      <SlvTheMenu
                        v-if={route.meta && !route.meta.hidden}
                        key={index + route.name}
                        route={route}
                        layout={layout}
                      />
                    ))}
                  </el-menu>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      )
    }
  }
})

export type SlvTheHeader = InstanceType<typeof SlvTheHeader>

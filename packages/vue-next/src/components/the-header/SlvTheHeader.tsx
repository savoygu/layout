import { storeToRefs } from 'pinia'
import { defineComponent, type ExtractPropTypes, type PropType } from 'vue'
import { ElCol, ElMenu, ElRow } from 'element-plus'
import { SlvLogo } from '@/components/logo'
import { SlvTheMenu } from '@/components/the-menu'
import { useRouteStore } from '@/store/route'
import { useNamespace } from '@/composables'
import variables from '@/styles/menu.module.scss'
import { ELayoutType } from '@/types'

export const theHeaderProps = {
  layout: {
    type: String as PropType<ELayoutType>,
    required: true
  }
} as const

export type SlvTheHeaderProps = ExtractPropTypes<typeof theHeaderProps>

export const SlvTheHeader = defineComponent({
  name: 'SlvTheHeader',
  props: theHeaderProps,
  setup(props, { slots }) {
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
            <ElRow gutter={20}>
              <ElCol span={6}>
                <SlvLogo layout={layout} />
              </ElCol>
              <ElCol span={18}>
                <div class={ns.e('right-panel')}>
                  {layout === ELayoutType.HORIZONTAL && (
                    <ElMenu
                      textColor={variables.menuColor}
                      activeTextColor={variables.menuColorActive}
                      backgroundColor={variables.menuBgColor}
                      defaultActive={activeMenu.value}
                      menuTrigger="hover"
                      mode="horizontal"
                    >
                      {routes.value.map(
                        (route, index) =>
                          route.meta &&
                          !route.meta.hidden && (
                            <SlvTheMenu
                              key={index + route.name}
                              route={route}
                              layout={layout}
                            />
                          )
                      )}
                    </ElMenu>
                  )}
                  {slots.header?.()}
                </div>
              </ElCol>
            </ElRow>
          </div>
        </div>
      )
    }
  }
})

export type SlvTheHeaderInstance = InstanceType<typeof SlvTheHeader>

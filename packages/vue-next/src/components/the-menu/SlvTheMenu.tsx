import {
  computed,
  defineComponent,
  toRef,
  type ExtractPropTypes,
  type PropType
} from 'vue'
import { storeToRefs } from 'pinia'
import { ElScrollbar } from 'element-plus'
import { SlvMenuItem } from '@/components/menu-item'
import { SlvSubmenu } from '@/components/submenu'
import { useSettingStore } from '@/store/setting'
import { useNamespace } from '@/composables/useNamespace'
import { ELayoutType, type SlvRouteRecord } from '@/types'

export const theMenuProps = {
  route: {
    type: Object as PropType<SlvRouteRecord>,
    required: true
  },
  layout: {
    type: String as PropType<ELayoutType>,
    default: ''
  }
} as const

export type SlvTheMenuProps = ExtractPropTypes<typeof theMenuProps>

export const SlvTheMenu = defineComponent({
  name: 'SlvTheMenu',
  props: theMenuProps,
  setup(props) {
    // store
    const store = useSettingStore()
    const { foldSidebar } = storeToRefs(store)

    // composable
    const ns = useNamespace('the-menu')

    // props
    const route = toRef(props, 'route')

    // computed
    const showScrollbar = computed(() => {
      return (
        (props.layout === ELayoutType.HORIZONTAL || foldSidebar.value) &&
        (props.route.children?.length ?? 0) > 18
      )
    })
    const menuComponent = computed(() => {
      const children = props.route.children ?? []
      return children.some((route) => route.meta.hidden !== true)
        ? SlvSubmenu
        : SlvMenuItem
    })

    // methods
    // render
    const renderChildren = (children: SlvRouteRecord[]) => {
      return children.map((item) => <SlvTheMenu key={item.path} route={item} />)
    }

    return () => {
      const { meta, children } = route.value
      const Component = menuComponent.value
      return (
        !meta.hidden && (
          <Component class={ns.b()} itemOrMenu={route.value}>
            {children &&
              children.length > 0 &&
              (showScrollbar.value ? (
                <ElScrollbar class={ns.e('scrollbar')}>
                  {renderChildren(children)}
                </ElScrollbar>
              ) : (
                renderChildren(children)
              ))}
          </Component>
        )
      )
    }
  }
})

export type SlvTheMenuInstance = InstanceType<typeof SlvTheMenu>

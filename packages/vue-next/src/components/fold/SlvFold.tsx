import { storeToRefs } from 'pinia'
import { computed, defineComponent } from 'vue'
import { SlvIcon } from '@/components/icon'
import { useSettingStore } from '@/store/setting'
import { useNamespace } from '@/composables'

export const SlvFold = defineComponent({
  name: 'SlvFold',
  components: { SlvIcon },
  setup() {
    // store
    const store = useSettingStore()
    const { foldSidebar } = storeToRefs(store)

    // composables
    const ns = useNamespace('fold')

    // computed
    const foldStyle = computed(() => {
      return {}
    })

    //methods
    const handleFold = () => {
      store.setFoldSidebar(!foldSidebar.value)
    }

    return () => (
      <SlvIcon
        class={ns.b()}
        icon={foldSidebar.value ? 'menu-unfold-line' : 'menu-fold-line'}
        style={foldStyle.value}
        onClick={handleFold}
      />
    )
  }
})

export type SlvFold = InstanceType<typeof SlvFold>

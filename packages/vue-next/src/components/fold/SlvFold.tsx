import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { SlvIcon } from '@/components/icon'
import { useSettingStore } from '@/store/setting'
import { useNamespace } from '@/composables/useNamespace'

export const SlvFold = defineComponent({
  name: 'SlvFold',
  setup() {
    // store
    const store = useSettingStore()
    const { foldSidebar } = storeToRefs(store)

    // composables
    const ns = useNamespace('fold')

    //methods
    const handleFold = () => {
      store.setFoldSidebar(!foldSidebar.value)
    }

    return () => (
      <SlvIcon
        class={ns.b()}
        icon={foldSidebar.value ? 'menu-unfold-line' : 'menu-fold-line'}
        onClick={handleFold}
      />
    )
  }
})

export type SlvFoldInstance = InstanceType<typeof SlvFold>

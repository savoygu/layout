import { defineComponent } from 'vue'

export const SlvTheFooter = defineComponent({
  name: 'SlvTheFooter',
  setup(props, { slots }) {
    return () => {
      return (
        slots.footer && <div class="slv-the-footer">{slots.footer?.()}</div>
      )
    }
  }
})

export type SlvTheFooterInstance = InstanceType<typeof SlvTheFooter>

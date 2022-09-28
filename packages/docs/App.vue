<template>
  <div>
    <HelloWorld ref="helloworldRef" :msg="msg" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue'
import { HelloWorld } from '@savoygu/layout-vue-next'
const msg = ref(0)

const helloworldRef = ref<InstanceType<typeof HelloWorld> | null>(null)

helloworldRef.value?.$props.msg

// export default defineComponent({
//   components: { HelloWorld },
//   setup() {
//     return {
//       msg
//     }
//   }
// })
</script>

<style lang="scss" scoped></style>

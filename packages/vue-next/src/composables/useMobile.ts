import { onMounted, onUnmounted, ref } from 'vue'
import { useGlobalConfig, type SlvTheProviderContext } from './useGlobalConfig'

export const DEVICE_BREAKPOINT = 992

export const useMobile = (breakpoint?: SlvTheProviderContext['breakpoint']) => {
  const mobile = ref(false)

  const handleResize = () => {
    mobile.value = isMobile(breakpoint)
  }
  handleResize()

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    mobile,
    handleResize
  }
}

export const isMobile = (breakpoint?: SlvTheProviderContext['breakpoint']) => {
  const breakpointRef = useGlobalConfig('breakpoint')
  return (
    screen.width < ((breakpoint || breakpointRef?.value) ?? DEVICE_BREAKPOINT)
  )
}

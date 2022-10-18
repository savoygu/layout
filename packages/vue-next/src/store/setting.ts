// import { ref } from 'vue'
// import { useCssVar } from '@vueuse/core'
import { defineStore } from 'pinia'
import {
  defaultNamespace
  // defaultEpNamespace
} from '@/composables/useNamespace'
import { useGlobalConfig } from '@/composables/useGlobalConfig'
import { EDeviceType, type DeviceType } from '@/types'

export type SettingState = {
  foldSidebar: boolean
  device: DeviceType
  theme: 'dark' | 'light'
}

export const useSettingStore = defineStore('setting', {
  state: (): SettingState => ({
    foldSidebar: false,
    device: EDeviceType.DESKTOP,
    theme: 'dark'
  }),
  actions: {
    setFoldSidebar(foldSidebar: SettingState['foldSidebar']) {
      this.foldSidebar = foldSidebar
    },
    setDevice(device: SettingState['device']) {
      this.device = device
    },
    setTheme(theme: SettingState['theme']) {
      this.theme = theme || 'dark'
      // let variables = require(`@/styles/modules/${this.theme}.module.scss`)
      // if (variables.default) variables = variables.default

      const ns = useGlobalConfig('namespace', defaultNamespace)
      // const epNs = useGlobalConfig('epNamespace', defaultEpNamespace)
      // Object.keys(variables).forEach((key) => {
      //   if (key.startsWith(`${ns}-`)) {
      //     useCssVar(key.replace(`${ns}-`, `--${epNs}-`), ref(null)).value =
      //       variables[key]
      //   }
      // })

      document.getElementsByTagName(
        'body'
      )[0].className = `${ns.value}-theme-${this.theme}`
    }
  }
})

import { defineStore } from 'pinia'
import { EDeviceType, type DeviceType } from '@/types'

export type SettingState = {
  foldSidebar: boolean
  device: DeviceType
}

export const useSettingStore = defineStore('setting', {
  state: (): SettingState => ({
    foldSidebar: false,
    device: EDeviceType.DESKTOP
  }),
  actions: {
    setFoldSidebar(foldSidebar: SettingState['foldSidebar']) {
      this.foldSidebar = foldSidebar
    },
    setDevice(device: SettingState['device']) {
      this.device = device
    }
  }
})

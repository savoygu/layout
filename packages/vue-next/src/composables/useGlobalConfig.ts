import {
  computed,
  getCurrentInstance,
  inject,
  provide,
  ref,
  unref,
  type App,
  type InjectionKey,
  type Ref
} from 'vue'
import type { SlvTheProviderProps } from '@/components/the-provider'
import { keysOf } from '@/utils'
import type { MaybeRef } from '@/types'

export type SlvTheProviderContext = Partial<SlvTheProviderProps>

const theProviderContextKey: InjectionKey<Ref<SlvTheProviderContext>> = Symbol()

const globalConfig = ref<SlvTheProviderContext>({})

export function useGlobalConfig<
  K extends keyof SlvTheProviderContext,
  D extends SlvTheProviderContext[K]
>(
  key: K,
  defaultValue?: D
): Ref<Exclude<SlvTheProviderContext[K], undefined> | D>
export function useGlobalConfig(): Ref<SlvTheProviderContext>
export function useGlobalConfig(
  key?: keyof SlvTheProviderContext,
  defaultValue = undefined
) {
  const config = getCurrentInstance()
    ? inject(theProviderContextKey, globalConfig)
    : globalConfig
  if (key) {
    return computed(() => config.value?.[key] ?? defaultValue)
  }
  return config
}

export const provideGlobalConfig = (
  config: MaybeRef<SlvTheProviderContext>,
  app?: App,
  global = false
) => {
  const isSetup = !!getCurrentInstance()

  console.log(isSetup, getCurrentInstance())

  const oldConfig = isSetup ? useGlobalConfig() : undefined

  const provideFn = app?.provide ?? (isSetup ? provide : undefined)

  if (!provideFn) {
    console.warn('provideGlobalConfig() must be called in setup')
    return
  }

  const context = computed(() => {
    const cfg = unref(config)
    if (!oldConfig?.value) return cfg
    return mergeConfig(oldConfig.value, cfg)
  })
  provideFn(theProviderContextKey, context)
  if (global || !globalConfig.value) {
    globalConfig.value = context.value
  }
  return context
}

const mergeConfig = (
  a: SlvTheProviderContext,
  b: SlvTheProviderContext
): SlvTheProviderContext => {
  const keys = [...new Set([...keysOf(a), ...keysOf(b)])]
  const obj: Record<string, any> = {}
  for (const key of keys) {
    obj[key] = b[key] ?? a[key]
  }
  return obj
}

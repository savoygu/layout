import type { Ref } from 'vue'
import { useGlobalConfig } from './useGlobalConfig'

export const defaultNamespace = 'slv'
export const defaultEpNamespace = 'el'
const statePrefix = 'is-'

const _bem = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string
) => {
  let bem = namespace + '-' + block
  if (blockSuffix) {
    bem += '-' + blockSuffix
  }
  if (element) {
    bem += '__' + element
  }
  if (modifier) {
    bem += '--' + modifier
  }
  return bem
}

export const useNamespace = (block: string, ns?: Ref<string>) => {
  const namespace = ns ?? useGlobalConfig('namespace', defaultNamespace)

  const b = (blockSuffix: string = '') =>
    _bem(namespace.value, block, blockSuffix, '', '')
  const e = (element?: string) =>
    element ? _bem(namespace.value, block, '', element, '') : ''
  const m = (modifier?: string) =>
    modifier ? _bem(namespace.value, block, '', '', modifier) : ''
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element
      ? _bem(namespace.value, block, blockSuffix, element, '')
      : ''
  const em = (element?: string, modifier?: string) =>
    element && modifier
      ? _bem(namespace.value, block, '', element, modifier)
      : ''
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier
      ? _bem(namespace.value, block, blockSuffix, '', modifier)
      : ''
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? _bem(namespace.value, block, blockSuffix, element, modifier)
      : ''
  const is: {
    (name: string, state: boolean | undefined | null): string
    (name: string): string
  } = (name: string, ...args: [boolean | undefined | null] | []) => {
    const state = args.length >= 1 ? args[0] : true
    return name && state ? statePrefix + name : ''
  }
  // for css var
  // --el-xxx: value;
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${key}`] = object[key]
      }
    }
    return styles
  }
  // with block
  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object[key]
      }
    }
    return styles
  }
  const cssVarName = (name: string) => `--${namespace.value}-${name}`
  const cssVarBlockName = (name: string) =>
    `--${namespace.value}-${block}-${name}`

  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    cssVar,
    cssVarBlock,
    cssVarName,
    cssVarBlockName
  }
}

export const useElNamespace = (block: string) => {
  const namespace = useGlobalConfig('epNamespace', defaultEpNamespace)
  return useNamespace(block, namespace)
}

export type UserNamespaceReturn = ReturnType<typeof useNamespace>

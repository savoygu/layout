export const isExternal = (path: string) => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const keysOf = <T extends object>(arr: T) =>
  Object.keys(arr) as Array<keyof T>

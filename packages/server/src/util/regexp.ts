export const basenameOf = (filename: string): string => {
  const matched = filename.match(/([^/]+)\.[^.]+$/)
  if (!matched || !matched[1]) {
    throw new Error(`Filename(${filename}) is invalid filename format.`)
  }

  return matched[1]
}

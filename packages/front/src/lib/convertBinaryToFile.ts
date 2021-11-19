export const convertBinaryToFile = (
  binary: string,
  fileName: string,
  mimeType: string,
) => {
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const file = new File([bytes], fileName, {
    type: mimeType,
  })

  return file
}

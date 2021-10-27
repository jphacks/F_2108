export const formatSec = (duration: number) => {
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration - minutes * 60)
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`
}

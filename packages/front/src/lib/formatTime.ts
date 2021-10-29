export const formatSec = (duration: number) => {
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration - minutes * 60)
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`
}

export const formatTime = (date: Date) => {
  const target = date.getTime() / (1000.0 * 60)
  const base = new Date().getTime() / (1000.0 * 60)
  const diff = base - target
  if (diff < 10) {
    return `${diff}分前`
  } else if (diff < 60) {
    return `${Math.floor(diff / 10)}0分前`
  } else if (diff < 60 * 24) {
    return `${Math.floor(diff / 60)}時間前`
  } else if (diff < 60 * 24 * 30) {
    return `${Math.floor(diff / (60 * 24))}日前`
  } else if (diff < 60 * 24 * 365) {
    return `${Math.floor(diff / (60 * 24 * 30))}ヶ月前`
  } else {
    return `${Math.floor(diff / (60 * 24 * 365))}年前`
  }
}

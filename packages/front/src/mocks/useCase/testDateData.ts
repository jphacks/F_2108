export const today = () => new Date().toISOString()
export const nextday = (day: number) => {
  const date = new Date()
  date.setDate(date.getDate() + day)
  return date.toISOString()
}
export const prevday = (day: number) => {
  const date = new Date()
  date.setDate(date.getDate() - day)
  return date.toISOString()
}

const NEVER_SHOW_TUTORIAL = "NEVER_SHOW_TUTORIAL"

export const isFirstAccess = () => {
  const value = localStorage.getItem(NEVER_SHOW_TUTORIAL)
  return value !== "true"
}

export const neverShowTutorial = () => {
  localStorage.setItem(NEVER_SHOW_TUTORIAL, "true")
}

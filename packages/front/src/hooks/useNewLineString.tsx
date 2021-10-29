import React from "react"

export const useNewLineString = (message: string | null): JSX.Element[] => {
  if (!message) {
    return []
  }
  const newLineString = message
    .split(/(\n)/)
    .map((str, index) => (
      <React.Fragment key={index}>
        {str.match(/\n/) ? <br /> : str}
      </React.Fragment>
    ))
  return newLineString
}

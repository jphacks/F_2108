import React from "react"

export type HighlightTextProps = {
  children: string
  highlightText: string
}

/**
 * テキストをハイライトする
 */
const HighlightText: React.VFC<HighlightTextProps> = ({
  children,
  highlightText,
}) => {
  return (
    <div>
      {children.split(highlightText).map((textSpan, index) => (
        <>
          {index !== 0 && (
            <span key={`${textSpan}_${index}`} className="highlight">
              {highlightText}
            </span>
          )}
          {textSpan}
        </>
      ))}
    </div>
  )
}

export default HighlightText

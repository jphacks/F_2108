import React, { Fragment, useState } from "react"
import { Stage, Layer, Rect } from "react-konva"

type AudioGraphProps = {
  data: number[]
  /** 進行割合 (0~1) */
  progress: number
  /** キャンバス幅 */
  width: number
  /** キャンバス高さ */
  height: number
  /** グラフの棒がクリックされた時のコールバック関数 */
  onClickUnit: (index: number) => void
}

const AudioGraph: React.VFC<AudioGraphProps> = ({
  data,
  progress,
  width,
  height,
  onClickUnit,
}) => {
  // ホバーしているグラフの棒のindex
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const samplingCount = data.length
  /** 一つのグラフの棒の幅 */
  const unitWidth = width / samplingCount

  return (
    <Stage
      width={width}
      height={height}
      onMouseLeave={() => {
        setHoveredIndex(null)
      }}
      className="bg-black"
    >
      <Layer>
        {data.map((num, i) => (
          <Fragment key={i}>
            <Rect
              fill="white"
              x={unitWidth * i}
              y={height / 2 - (height * 0.8 * num) / 2}
              width={unitWidth * 0.8}
              height={Math.max(height * 0.8 * num, height * 0.02)}
              cornerRadius={12}
              onMouseEnter={() => setHoveredIndex(i)}
              listening={false}
            />
            {/* クリック判定用のRect */}
            <Rect
              fill="transparent"
              x={unitWidth * i}
              y={0}
              width={unitWidth * 0.8}
              height={height}
              cornerRadius={12}
              onMouseEnter={() => setHoveredIndex(i)}
            />
          </Fragment>
        ))}
        <Rect
          x={width * progress}
          y={0}
          width={width * (1 - progress)}
          height={height}
          fill="rgba(51, 51, 51, 0.7)"
          listening={false}
        />
        {hoveredIndex != null && (
          <Fragment>
            <Rect
              fill="#ff69b4"
              x={unitWidth * hoveredIndex}
              y={
                height / 2 - (height * 0.8 * (data[hoveredIndex] as number)) / 2
              }
              width={unitWidth}
              height={Math.max(
                height * 0.8 * (data[hoveredIndex] as number),
                height * 0.02,
              )}
              cornerRadius={12}
              listening={false}
            />
            {/* ホバー表示用のRect */}
            <Rect
              fill="#ff69b488"
              x={unitWidth * hoveredIndex}
              y={0}
              width={unitWidth}
              height={height}
              cornerRadius={12}
              onClick={() => onClickUnit(hoveredIndex)}
            />
          </Fragment>
        )}
      </Layer>
    </Stage>
  )
}

export default AudioGraph

/**
 * ArrayBufferをデコードし、サンプリングする
 * @param audioData オーディオを表すArrayBuffer
 * @param peakLength サンプリング数
 * @returns サンプリング結果
 */
export const analyzeAudioWave = async (
  audioData: ArrayBuffer,
  peakLength: number,
) => {
  // AudioBufferにデコードする
  const audioCtx = new AudioContext()
  const buffer = await audioCtx.decodeAudioData(audioData)

  // ステレオの場合を考慮してサンプリングする
  const ch1 = buffer.getChannelData(0)
  const ch2 = buffer.getChannelData(1)
  const peaks1 = getPeaks(ch1, peakLength)
  const peaks2 = getPeaks(ch2, peakLength)

  // サンプリング結果を足し合わせて正規化する
  const peaks: number[] = []
  for (let i = 0; i < peaks1.length; i++) {
    const peak1 = peaks1?.[i] ?? 0
    const peak2 = peaks2?.[i] ?? 0
    peaks[i] = (peak1 + peak2) / 2.0
  }
  return normalize(peaks)
}

const getPeaks = (array: Float32Array, peakLength: number) => {
  const step = Math.max(Math.floor(array.length / peakLength), 1)
  const peaks: number[] = []
  for (let i = 0, len = array.length; i < len; i += step) {
    const peak = getPeak(array.slice(i, i + step))
    peaks.push(peak)
  }
  return peaks
}

const getPeak = (array: Float32Array) => {
  let peak = -Infinity
  const length = array.length
  for (let i = 0; i < length; i++) {
    const sample = array[i] as number
    if (sample > peak) {
      peak = sample
    }
  }
  return peak
}

const normalize = (array: number[]) => {
  const max = Math.max(...array)
  return array.map((num) => num / max)
}

// class PeakAnalyzer {
//   audioCtx = new AudioContext()

//   /**
//    * 音ファイルからPeakを取得します
//    * @param url 分析する音ファイル
//    * @param peakLength 欲しいpeakの配列の長さ
//    * @return {*}
//    */
//   async analyze(url: string, peakLength?: number) {
//     const res = await axios.get(url, {
//       responseType: "arraybuffer",
//     })
//     const array = await this.onLoadSound(res.data as ArrayBuffer, peakLength)
//     return array
//   }

//   async onLoadSound(
//     audioData: ArrayBuffer,
//     peakLength?: number,
//   ): Promise<number[]> {
//     const buffer = await this.audioCtx.decodeAudioData(audioData)
//     const ch1 = buffer.getChannelData(0)
//     const peaks1 = this.getPeaks(ch1, peakLength)

//     const ch2 = buffer.getChannelData(1)
//     const peaks2 = this.getPeaks(ch2, peakLength)

//     const peaks: number[] = []
//     for (let i = 0; i < peaks1.length; i++) {
//       const peak1 = peaks1?.[i] ?? 0
//       const peak2 = peaks2?.[i] ?? 0
//       peaks[i] = (peak1 + peak2) / 2.0
//     }

//     return this.normalize(peaks)
//   }

//   getPeaks(array: Float32Array, peakLength = 9000) {
//     const step = Math.max(Math.floor(array.length / peakLength), 1)

//     const peaks: number[] = []
//     for (let i = 0, len = array.length; i < len; i += step) {
//       const peak = this.getPeak(array.slice(i, i + step))
//       peaks.push(peak)
//     }
//     return peaks
//   }

//   getPeak(array: Float32Array) {
//     let peak = -100
//     const length = array.length
//     for (let i = 0; i < length; i++) {
//       const sample = array[i] as number
//       if (sample > peak) {
//         peak = sample
//       }
//     }
//     return peak
//   }

//   normalize(array: number[]) {
//     const max = Math.max(...array)
//     return array.map((num) => num / max)
//   }
// }

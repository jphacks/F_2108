import { Stamp } from "@domain/stamp"

/**
 * スタンプに検索文字列が含まれるかを判定する
 */
export const stampIsMatched = (stamp: Stamp, searchInput: string) => {
  if (searchInput === "") return false
  return stamp.comments.some((comment) => {
    if (comment.dataType === "audio") {
      return comment.title.indexOf(searchInput) >= 0
    } else {
      return comment.content.indexOf(searchInput) >= 0
    }
  })
}

/**
 * スタンプに検索文字列が含まれる個数を検索する
 */
const getMatchCount = (stamp: Stamp, regexp: RegExp) =>
  stamp.comments.reduce((sum, comment) => {
    if (comment.dataType === "audio") {
      return sum + Array.from(comment.title.matchAll(regexp)).length
    } else {
      return sum + Array.from(comment.content.matchAll(regexp)).length
    }
  }, 0)

/**
 * スタンプを検索文字列の一致度合いでソートするための比較関数。現在は検索文字列が出現する回数で比較している
 * @param searchInput 検索文字列
 * @param a stamp
 * @param b stamp
 * @returns -1, 0, 1
 */
export const stampCompareFunc = (searchInput: string, a: Stamp, b: Stamp) => {
  if (searchInput === "") return 1
  const regexp = new RegExp(searchInput, "g")
  const aMatchCount = getMatchCount(a, regexp)
  const bMatchCount = getMatchCount(b, regexp)
  return aMatchCount < bMatchCount ? 1 : aMatchCount === bMatchCount ? 0 : -1
}

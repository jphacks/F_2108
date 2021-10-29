export const numberIdGenerator = function* () {
  for (let i = 0; ; i++) {
    yield i
  }
}

export const stringIdGenerator = function* () {
  for (let i = 0; ; i++) {
    yield `${i}`
  }
}

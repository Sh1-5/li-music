const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})]/

export default function parseLyric(lyricString) {
  const lyricStrings = lyricString.split('\n')
  const lyricArr = []
  for (const lineString of lyricStrings) {
    const timeResult = timeRegExp.exec(lineString)
    if (!timeResult) continue
    // 1.获取时间
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millsecond =
      timeResult[3].length === 2 ? timeResult[3] * 10 : timeResult[3] * 1
    const time = minute + second + millsecond

    // 2.获取歌词
    const text = lineString.replace(timeRegExp, '')

    const lyricObj = { time, text }
    lyricArr.push(lyricObj)
  }

  return lyricArr
}

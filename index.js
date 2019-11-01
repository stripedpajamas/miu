/*
  rule 1: III can become U
  rule 2: if you have UU you can delete them both (e.g. MIUU -> MI)
  rule 3: Mx can become Mxx, where x is anything. so like MIU -> MIUIU
  rule 4: if it ends with I, you can add a U on the end. so like MI -> MIU
*/

function reverseDerive ({ start, end }, limit) {
  const queue = [[end]]
  while (queue.length) {
    const path = queue.shift()
    if (path.length > limit) {
      throw new Error('could not find an answer that has less than ' + limit + ' steps')
    }
    const current = path[path.length - 1]
    if (current === start) {
      return path
    }
    queue.push(...[]
      .concat(revertRule4(current))
      .concat(revertRule3(current))
      .concat(revertRule2(current))
      .concat(revertRule1(current))
      .filter(removeDuplicates())
      .map(reversion => path.concat(reversion))
    )
  }
  return []
}

function removeDuplicates () {
  const seen = new Set()
  return function (el) {
    if (seen.has(el)) return false
    seen.add(el)
    return true
  }
}

function revertRule1 (str) {
  const output = new Set()
  for (let i = 1; i < str.length; i++) {
    let c = str[i]
    if (c === 'U') {
      output.add(str.slice(0, i) + 'III' + str.slice(i + 1))
    }
  }
  return [...output]
}

function revertRule2 (str) {
  const output = new Set()
  output.add(str + 'UU')
  for (let i = 1; i < str.length; i++) {
    output.add(str.slice(0, i) + 'UU' + str.slice(i))
  }
  return [...output]
}

function revertRule3 (str) {
  if ((str.length - 1) % 2 != 0) return []
  const mid = ((str.length - 1) / 2) + 1
  const left = str.slice(1, mid)
  const right = str.slice(mid)
  return left === right ? ['M' + left] : []
}

function revertRule4 (str) {
  const u = str[str.length - 1]
  const pu = str[str.length - 2]
  return (u === 'U' && pu === 'I')
    ? [str.slice(0, str.length - 1)]
    : []
}

/* testing */
console.log(
  reverseDerive({ start: 'MI', end: 'MU' }, 100)
)

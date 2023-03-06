/* eslint-disable no-tabs */
/* eslint-disable no-cond-assign */
import Chunk from './Chunk.js'

const warned = {
  insertLeft: false,
  insertRight: false,
  storeName: false,
}
// replace magic-string with a lightweight one which exclude sourcemap&debug
// fork from magic-string
export default class MagicString {
  constructor(string, options = {}) {
    const chunk = new Chunk(0, string.length, string)

    Object.defineProperties(this, {
      original: { writable: true, value: string },
      outro: { writable: true, value: '' },
      intro: { writable: true, value: '' },
      firstChunk: { writable: true, value: chunk },
      lastChunk: { writable: true, value: chunk },
      lastSearchedChunk: { writable: true, value: chunk },
      byStart: { writable: true, value: {} },
      byEnd: { writable: true, value: {} },
      filename: { writable: true, value: options.filename },
      indentExclusionRanges: { writable: true, value: options.indentExclusionRanges },
      storedNames: { writable: true, value: {} },
      indentStr: { writable: true, value: undefined },
    })

    this.byStart[0] = chunk
    this.byEnd[string.length] = chunk
  }

  append(content) {
    if (typeof content !== 'string')
      throw new TypeError('outro content must be a string')

    this.outro += content
    return this
  }

  appendLeft(index, content) {
    if (typeof content !== 'string')
      throw new TypeError('inserted content must be a string')

    this._split(index)

    const chunk = this.byEnd[index]

    if (chunk)
      chunk.appendLeft(content)

    else
      this.intro += content

    return this
  }

  appendRight(index, content) {
    if (typeof content !== 'string')
      throw new TypeError('inserted content must be a string')

    this._split(index)

    const chunk = this.byStart[index]

    if (chunk)
      chunk.appendRight(content)

    else
      this.outro += content

    return this
  }

  move(start, end, index) {
    if (index >= start && index <= end)
      throw new Error('Cannot move a selection inside itself')

    this._split(start)
    this._split(end)
    this._split(index)

    const first = this.byStart[start]
    const last = this.byEnd[end]

    const oldLeft = first.previous
    const oldRight = last.next

    const newRight = this.byStart[index]
    if (!newRight && last === this.lastChunk)
      return this
    const newLeft = newRight ? newRight.previous : this.lastChunk

    if (oldLeft)
      oldLeft.next = oldRight
    if (oldRight)
      oldRight.previous = oldLeft

    if (newLeft)
      newLeft.next = first
    if (newRight)
      newRight.previous = last

    if (!first.previous)
      this.firstChunk = last.next
    if (!last.next) {
      this.lastChunk = first.previous
      this.lastChunk.next = null
    }

    first.previous = newLeft
    last.next = newRight || null

    if (!newLeft)
      this.firstChunk = first
    if (!newRight)
      this.lastChunk = last

    return this
  }

  overwrite(start, end, content, options) {
    options = options || {}
    return this.update(start, end, content, { ...options, overwrite: !options.contentOnly })
  }

  update(start, end, content, options) {
    if (typeof content !== 'string')
      throw new TypeError('replacement content must be a string')

    while (start < 0) start += this.original.length
    while (end < 0) end += this.original.length

    if (end > this.original.length)
      throw new Error('end is out of bounds')
    if (start === end) {
      throw new Error(
        'Cannot overwrite a zero-length range – use appendLeft or prependRight instead',
      )
    }

    this._split(start)
    this._split(end)

    if (options === true) {
      if (!warned.storeName) {
        console.warn(
          'The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string',
        )
        warned.storeName = true
      }

      options = { storeName: true }
    }
    const storeName = options !== undefined ? options.storeName : false
    const overwrite = options !== undefined ? options.overwrite : false

    if (storeName) {
      const original = this.original.slice(start, end)
      Object.defineProperty(this.storedNames, original, {
        writable: true,
        value: true,
        enumerable: true,
      })
    }

    const first = this.byStart[start]
    const last = this.byEnd[end]

    if (first) {
      let chunk = first
      while (chunk !== last) {
        if (chunk.next !== this.byStart[chunk.end])
          throw new Error('Cannot overwrite across a split point')

        chunk = chunk.next
        chunk.edit('', false)
      }

      first.edit(content, storeName, !overwrite)
    }
    else {
      // must be inserting at the end
      const newChunk = new Chunk(start, end, '').edit(content, storeName)

      // TODO last chunk in the array may not be the last chunk, if it's moved...
      last.next = newChunk
      newChunk.previous = last
    }

    return this
  }

  prepend(content) {
    if (typeof content !== 'string')
      throw new TypeError('outro content must be a string')

    this.intro = content + this.intro
    return this
  }

  prependLeft(index, content) {
    if (typeof content !== 'string')
      throw new TypeError('inserted content must be a string')

    this._split(index)

    const chunk = this.byEnd[index]

    if (chunk)
      chunk.prependLeft(content)

    else
      this.intro = content + this.intro

    return this
  }

  prependRight(index, content) {
    if (typeof content !== 'string')
      throw new TypeError('inserted content must be a string')

    this._split(index)

    const chunk = this.byStart[index]

    if (chunk)
      chunk.prependRight(content)

    else
      this.outro = content + this.outro

    return this
  }

  remove(start, end) {
    while (start < 0) start += this.original.length
    while (end < 0) end += this.original.length

    if (start === end)
      return this

    if (start < 0 || end > this.original.length)
      throw new Error('Character is out of bounds')
    if (start > end)
      throw new Error('end must be greater than start')

    this._split(start)
    this._split(end)

    let chunk = this.byStart[start]

    while (chunk) {
      chunk.intro = ''
      chunk.outro = ''
      chunk.edit('')

      chunk = end > chunk.end ? this.byStart[chunk.end] : null
    }

    return this
  }

  slice(start = 0, end = this.original.length) {
    while (start < 0) start += this.original.length
    while (end < 0) end += this.original.length

    let result = ''

    // find start chunk
    let chunk = this.firstChunk
    while (chunk && (chunk.start > start || chunk.end <= start)) {
      // found end chunk before start
      if (chunk.start < end && chunk.end >= end)
        return result

      chunk = chunk.next
    }

    if (chunk && chunk.edited && chunk.start !== start)
      throw new Error(`Cannot use replaced character ${start} as slice start anchor.`)

    const startChunk = chunk
    while (chunk) {
      if (chunk.intro && (startChunk !== chunk || chunk.start === start))
        result += chunk.intro

      const containsEnd = chunk.start < end && chunk.end >= end
      if (containsEnd && chunk.edited && chunk.end !== end)
        throw new Error(`Cannot use replaced character ${end} as slice end anchor.`)

      const sliceStart = startChunk === chunk ? start - chunk.start : 0
      const sliceEnd = containsEnd ? chunk.content.length + end - chunk.end : chunk.content.length

      result += chunk.content.slice(sliceStart, sliceEnd)

      if (chunk.outro && (!containsEnd || chunk.end === end))
        result += chunk.outro

      if (containsEnd)
        break

      chunk = chunk.next
    }

    return result
  }

  _split(index) {
    if (this.byStart[index] || this.byEnd[index])
      return

    let chunk = this.lastSearchedChunk
    const searchForward = index > chunk.end

    while (chunk) {
      if (chunk.contains(index))
        return this._splitChunk(chunk, index)

      chunk = searchForward ? this.byStart[chunk.end] : this.byEnd[chunk.start]
    }
  }

  _splitChunk(chunk, index) {
    const newChunk = chunk.split(index)

    this.byEnd[index] = chunk
    this.byStart[index] = newChunk
    this.byEnd[newChunk.end] = newChunk

    if (chunk === this.lastChunk)
      this.lastChunk = newChunk

    this.lastSearchedChunk = chunk

    return true
  }

  toString() {
    let str = this.intro

    let chunk = this.firstChunk
    while (chunk) {
      str += chunk.toString()
      chunk = chunk.next
    }

    return str + this.outro
  }

  isEmpty() {
    let chunk = this.firstChunk
    do {
      if (
        (chunk.intro.length && chunk.intro.trim())
				|| (chunk.content.length && chunk.content.trim())
				|| (chunk.outro.length && chunk.outro.trim())
      )
        return false
    } while ((chunk = chunk.next))
    return true
  }

  length() {
    let chunk = this.firstChunk
    let length = 0
    do
      length += chunk.intro.length + chunk.content.length + chunk.outro.length
    while ((chunk = chunk.next))
    return length
  }

  _replaceRegexp(searchValue, replacement) {
    function getReplacement(match, str) {
      if (typeof replacement === 'string') {
        return replacement.replace(/\$(\$|&|\d+)/g, (_, i) => {
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter
          if (i === '$')
            return '$'
          if (i === '&')
            return match[0]
          const num = +i
          if (num < match.length)
            return match[+i]
          return `$${i}`
        })
      }
      else {
        return replacement(...match, match.index, str, match.groups)
      }
    }
    function matchAll(re, str) {
      let match
      const matches = []
      while ((match = re.exec(str)))
        matches.push(match)

      return matches
    }
    if (searchValue.global) {
      const matches = matchAll(searchValue, this.original)
      matches.forEach((match) => {
        if (match.index != null) {
          this.overwrite(
            match.index,
            match.index + match[0].length,
            getReplacement(match, this.original),
          )
        }
      })
    }
    else {
      const match = this.original.match(searchValue)
      if (match && match.index != null) {
        this.overwrite(
          match.index,
          match.index + match[0].length,
          getReplacement(match, this.original),
        )
      }
    }
    return this
  }

  _replaceString(string, replacement) {
    const { original } = this
    const index = original.indexOf(string)

    if (index !== -1)
      this.overwrite(index, index + string.length, replacement)

    return this
  }

  replace(searchValue, replacement) {
    if (typeof searchValue === 'string')
      return this._replaceString(searchValue, replacement)

    return this._replaceRegexp(searchValue, replacement)
  }

  _replaceAllString(string, replacement) {
    const { original } = this
    const stringLength = string.length
    for (
      let index = original.indexOf(string);
      index !== -1;
      index = original.indexOf(string, index + stringLength)
    )
      this.overwrite(index, index + stringLength, replacement)

    return this
  }

  replaceAll(searchValue, replacement) {
    if (typeof searchValue === 'string')
      return this._replaceAllString(searchValue, replacement)

    if (!searchValue.global) {
      throw new TypeError(
        'MagicString.prototype.replaceAll called with a non-global RegExp argument',
      )
    }

    return this._replaceRegexp(searchValue, replacement)
  }
}

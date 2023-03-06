// replace
export function replace(mark: string, placeholder: string, code: string) {
  const re = new RegExp(mark, 'g')
  return code.replace(re, placeholder)
}

// repalce quotes
export function replaceQuotes(mark: string, placeholder: string, code: string) {
  const singleMark = `'${mark}`
  const singlePlaceholder = `${placeholder}+'/`
  const doubleMark = `"${mark}`
  const doublePlaceholder = `${placeholder}+"/`
  const templateMark = `\`${mark}`
  const templatePlaceholder = `\`\$\{${placeholder}\}/`
  return replace(doubleMark, doublePlaceholder, replace(singleMark, singlePlaceholder, replace(templateMark, templatePlaceholder, code)))
}

// replace asset url
export function replaceUrl(mark: string, placeholder: string, code: string) {
  const urlMark = `url(${mark}`
  // const urlPlaceholder = `url("+${placeholder}+"/`
  const codeSpinner = code.split(urlMark)
  const len = codeSpinner.length
  if (len === 1)
    return code

  let rusultCode = ''
  const quote = Array.from(codeSpinner[0].matchAll(/'/g) || []).length % 2 === 1 ? '\'' : '"'
  for (let i = 0; i < len; i++) {
    const codeItem = codeSpinner[i]
    if (i === len - 1)
      rusultCode += codeItem

    else
      rusultCode += `${codeItem}url(${quote}+${placeholder}+${quote}/`
  }
  return rusultCode
}

// replace asset src
export function replaceSrc(placeholder: string, code: string) {
  return code.replace(/=([a-zA-Z]+).src/g, `=${placeholder}+$1.getAttribute('data-src')`)
}

export function replaceImport(placeholder: string, code: string) {
  return code.replace(/(System.import\()/g, `$1${placeholder}+`)
}

// just for test
// it will throw error when using snapshot during github action
// I don't know why
export function removeMerakTag(html: string) {
  return html.replace(/<merak[^>]+c=['"](.*)['"][\s>]<\/merak>/g, '')
}

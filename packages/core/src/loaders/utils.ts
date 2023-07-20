import type { LoadDone, MerakConfig } from '../types'

export abstract class Loader {
  protected loadCache: Map<string, LoadDone> = new Map()
  abstract load(sourceUrl: string, configOrUrl?: string | MerakConfig): Promise<LoadDone | any>
}



export async function loadJSONFile(url: string) {
  const res = await fetch(url)
  return res.json()
}
export async function loadTextFile(url: string) {
  const res = await fetch(url)
  return res.text()
}
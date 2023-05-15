import type { LoadDone, MerakConfig } from '../types'

export abstract class Loader {
  protected loadCache: Map<string, LoadDone> = new Map()
  abstract load(sourceUrl: string, configOrUrl?: string | MerakConfig): Promise<LoadDone | any>
}

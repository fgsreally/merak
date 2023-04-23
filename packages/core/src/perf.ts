export class Perf {
  public timeRecord: Record<string, number> = {}
  protected _timeRecord: Record<string, number> = {}
  protected eventRecord: Record<string, ((arg: number) => void)[]> = {}
  record(eventName: string) {
    if (!this._timeRecord[eventName]) {
      this._timeRecord[eventName] = Date.now()
    }

    else {
      const time = Date.now() - this._timeRecord[eventName]
      this.timeRecord[eventName] = time
      this.emit(eventName, time)
    }
  }

  on(eventName: string, cb: (arg: number) => void) {
    if (this.eventRecord[eventName])
      this.eventRecord[eventName] = []
    this.eventRecord[eventName].push(cb)
  }

  emit(eventName: string, arg: number) {
    if (this.eventRecord[eventName])
      this.eventRecord[eventName].forEach(cb => cb(arg))
  }
}

export class Perf {
  public timeRecord: Record<string, number> = {}
  private _timeRecord: Record<string, number> = {}
  record(type: string) {
    if (!this._timeRecord[type])
      this._timeRecord[type] = Date.now()

    else
      this.timeRecord[type] = Date.now() - this._timeRecord[type]
  }
}

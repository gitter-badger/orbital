import parseMessyTime = require('parse-messy-time');

export class CastableDate extends Date {
  private constructor(str: string) {
    super(parseMessyTime(str, { now: Math.round(Date.now() / 1000) * 1000 }));
  }

  toDate(): Date {
    return new Date(this.getTime());
  }

  static cast(str: string): CastableDate {
    return new this(str);
  }
}

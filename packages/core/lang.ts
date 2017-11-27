// tslint:disable-next-line:no-namespace
declare namespace Orbital {
  interface Constructor<T> {
    new(...args: any[]): T;
  }

  interface Dictionary<T> {
    [key: string]: T;
  }
}

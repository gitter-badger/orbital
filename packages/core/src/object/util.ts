export function isPrintable(object: any): object is Printable {
  return !!object && typeof object.print === 'function';
}

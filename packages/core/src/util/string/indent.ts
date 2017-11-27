export function indent(text: string, indent: number | string): string {
  const indentStr = typeof indent === 'string' ?
    indent.replace(/\r/g, '') :
    Array(indent + 1).join(' ');

  return text.replace(/^/mg, indentStr);
}

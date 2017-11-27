export function parseFunctionParameterNames(fn: () => any): string[] | undefined {
  const groups = fn
    .toString()
    .match(/^[^{=]*\(([\w\d$-,\s]*)\)/);

  return groups ? groups[1].trim().split(/\s*,\s*/) : undefined;
}

export function getFunctionParameterName(fn: () => any, index: number): string {
  let paramNames: string[] | undefined;

  if ((fn as any).__paramNames) {
    paramNames = (fn as any).__paramNames;
  } else {
    paramNames = (fn as any).__paramNames = parseFunctionParameterNames(fn);
  }

  return paramNames && paramNames[index] || `param${index}`;
}

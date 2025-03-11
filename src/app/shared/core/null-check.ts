/* eslint-disable require-jsdoc */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isUndefinedOrNull(value: any): boolean {
  return typeof value === 'undefined' || value === null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObjectNotEmpty(object: any) {
  return !(object == null || object == undefined || Object.keys(object).length < 1);
}

export function isStringNotEmpty(str: string): boolean {
  return str && str.length > 0;
}

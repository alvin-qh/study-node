export function f1(a: number, b: string): string {
  return `${a}: ${b}`;
}

export const f2: (a: number, b: string) => string = (a: number, b: string): string => {
  return `${a}: ${b}`;
}

export function f3(a: number, b?: string): string {
  if (b) {
    return `${a}: ${b}`;
  }

  return `${a}`;
}

export function f4(a: number, b = 'Alvin'): string {
  if (b) {
    return `${a}: ${b}`;
  }
  return `${a}`;
}

export function f5(a: number, ...b: string[]): string {
  if (b.length > 0) {
    return `${a}: ${b.join(', ')}`;
  }
  return `${a}`;
}

export type F6Type = {
  a: number,
  fn: (this: F6Type, b: string) => string,
};

export function f6(this: F6Type, b: string): string {
  if (b.length > 0) {
    return `${this.a}: ${b}`;
  }
  return `${this.a}`;
}

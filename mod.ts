export interface ExpressionElement<ElementType> {
  start: number;
  name?: string;
  end: number;
  type: ElementType;
  data:
    | string
    | boolean
    | number
    | ExpressionElement<ElementType>
    | ExpressionElement<ElementType>[];
  children: ExpressionElement<ElementType>[];
}

export class Parser<ElementType> {
  pointer: number;
  template: string;
  stack: ExpressionElement<ElementType>[];
  constructor(template: string) {
    this.pointer = 0;
    this.template = template;
    this.stack = [];
  }
  get current(): ExpressionElement<ElementType> {
    return this.stack[this.stack.length - 1];
  }
  error(message: string, index = this.pointer) {
    throw new Error(
      `${message} THROWN AT ${index} of ${
        this.template.slice((index - 10) || 0, index + 10)
      }`,
    );
  }
  match(val: string): boolean {
    return this.template.slice(
      this.pointer,
      this.pointer + val.length,
    ) === val;
  }
  /**
   * Move the pointer ahead of the `val` string.
   * @param {string} val Value to move ahead of.
   * @returns {boolean} Whether the movement was successful.
   */
  move(val: string, required = false): boolean {
    if (this.match(val)) {
      this.pointer += val.length;
      return true;
    }
    if (required) this.error(`Expected ${val} at position ${this.pointer}.`);
    return false;
  }
  read(pattern: RegExp): string {
    const matches = pattern.exec(this.template.slice(this.pointer));
    if (!matches || matches.index !== 0) return "";

    this.pointer += matches[0].length;

    return matches[0];
  }
  remaining(): string {
    return this.template.slice(this.pointer, this.template.length - 1);
  }
  skip(pattern: RegExp) {
    while (
      this.pointer < this.template.length &&
      pattern.exec(this.template.slice(this.pointer)) !== null
    ) {
      this.pointer++;
    }
  }
}

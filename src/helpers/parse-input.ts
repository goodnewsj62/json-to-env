import { parse } from "json5";

export function parseInput(value: string) {
  try {
    return parse(value.trim());
  } catch (error) {
    throw new Error(
      "Input must be a JavaScript object literal (enclosed in {})",
    );
  }
}

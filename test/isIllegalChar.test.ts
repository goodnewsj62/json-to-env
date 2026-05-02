import { describe, expect, it } from "vitest";
import { isIllegalChar } from "../src/helpers";

describe("isIllegalChar", () => {
  it("returns false for conventional env-style names", () => {
    expect(isIllegalChar("FOO")).toBe(false);
    expect(isIllegalChar("FOO_BAR")).toBe(false);
    expect(isIllegalChar("fooBar")).toBe(false);
    expect(isIllegalChar("V2_API_KEY")).toBe(false);
    expect(isIllegalChar("_PRIVATE")).toBe(false);
    expect(isIllegalChar("")).toBe(false);
  });

  it("returns false when the name contains only letters, digits, and underscore", () => {
    expect(isIllegalChar("a1")).toBe(false);
    expect(isIllegalChar("___")).toBe(false);
  });

  it("treats equals as illegal (key/value separator)", () => {
    expect(isIllegalChar("A=B")).toBe(true);
    expect(isIllegalChar("=")).toBe(true);
  });

  it("treats comment and interpolation characters as illegal", () => {
    expect(isIllegalChar("A#B")).toBe(true);
    expect(isIllegalChar("A'B")).toBe(true);
    expect(isIllegalChar('A"B')).toBe(true);
    expect(isIllegalChar("A`B")).toBe(true);
    expect(isIllegalChar("A$B")).toBe(true);
  });

  it("treats whitespace and C0 control characters as illegal", () => {
    expect(isIllegalChar("A B")).toBe(true);
    expect(isIllegalChar("A\tB")).toBe(true);
    expect(isIllegalChar("A\nB")).toBe(true);
    expect(isIllegalChar("A\rB")).toBe(true);
    expect(isIllegalChar("A\u0000B")).toBe(true);
    expect(isIllegalChar("\u0001")).toBe(true);
  });

  it("treats shell metacharacters as illegal", () => {
    expect(isIllegalChar("A&B")).toBe(true);
    expect(isIllegalChar("A;B")).toBe(true);
    expect(isIllegalChar("A<B")).toBe(true);
    expect(isIllegalChar("A>B")).toBe(true);
    expect(isIllegalChar("A|B")).toBe(true);
    expect(isIllegalChar("A*B")).toBe(true);
    expect(isIllegalChar("A?B")).toBe(true);
  });

  it("treats brackets, parens, and braces as illegal", () => {
    expect(isIllegalChar("A(B")).toBe(true);
    expect(isIllegalChar("A)B")).toBe(true);
    expect(isIllegalChar("A[B")).toBe(true);
    expect(isIllegalChar("A]B")).toBe(true);
    expect(isIllegalChar("A{B")).toBe(true);
    expect(isIllegalChar("A}B")).toBe(true);
  });

  it("treats slashes, backslashes, bang, percent, and hyphen as illegal", () => {
    expect(isIllegalChar("A/B")).toBe(true);
    expect(isIllegalChar("A\\B")).toBe(true);
    expect(isIllegalChar("A!B")).toBe(true);
    expect(isIllegalChar("A%B")).toBe(true);
    expect(isIllegalChar("A-B")).toBe(true);
  });

  it("returns false for characters outside the denylist (e.g. dot, colon, caret)", () => {
    expect(isIllegalChar("foo.bar")).toBe(false);
    expect(isIllegalChar("HOST:PORT")).toBe(false);
    expect(isIllegalChar("a^b")).toBe(false);
    expect(isIllegalChar("a~b")).toBe(false);
    expect(isIllegalChar("comma,separated")).toBe(false);
  });

  it("treats vertical tab and form feed as illegal whitespace", () => {
    expect(isIllegalChar("A\u000bB")).toBe(true);
    expect(isIllegalChar("A\u000cB")).toBe(true);
  });

  it("treats a lone illegal character as illegal", () => {
    expect(isIllegalChar("-")).toBe(true);
    expect(isIllegalChar("#")).toBe(true);
    expect(isIllegalChar("=")).toBe(true);
  });
});

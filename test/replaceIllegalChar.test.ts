import { describe, expect, it } from "vitest";
import { isIllegalChar, replaceIllegalChar } from "../src/helpers";

describe("replaceIllegalChar", () => {
  it("returns empty string for empty input", () => {
    expect(replaceIllegalChar("")).toBe("");
  });

  it("leaves keys that are already legal unchanged", () => {
    expect(replaceIllegalChar("FOO")).toBe("FOO");
    expect(replaceIllegalChar("FOO_BAR")).toBe("FOO_BAR");
    expect(replaceIllegalChar("fooBar")).toBe("fooBar");
    expect(replaceIllegalChar("foo.bar")).toBe("foo.bar");
  });

  it("strips equals, hash, quotes, backtick, and dollar", () => {
    expect(replaceIllegalChar("A=B")).toBe("AB");
    expect(replaceIllegalChar("A#B")).toBe("AB");
    expect(replaceIllegalChar("A'B")).toBe("AB");
    expect(replaceIllegalChar('A"B')).toBe("AB");
    expect(replaceIllegalChar("A`B")).toBe("AB");
    expect(replaceIllegalChar("A$B")).toBe("AB");
  });

  it("strips whitespace and C0 controls", () => {
    expect(replaceIllegalChar("A B")).toBe("AB");
    expect(replaceIllegalChar("A\tB")).toBe("AB");
    expect(replaceIllegalChar("A\nB")).toBe("AB");
    expect(replaceIllegalChar("A\u0000B")).toBe("AB");
    expect(replaceIllegalChar("\u0001")).toBe("");
  });

  it("strips shell metacharacters, brackets, slashes, bang, percent, hyphen", () => {
    expect(replaceIllegalChar("A&B")).toBe("AB");
    expect(replaceIllegalChar("A;B")).toBe("AB");
    expect(replaceIllegalChar("A|B")).toBe("AB");
    expect(replaceIllegalChar("A(B)")).toBe("AB");
    expect(replaceIllegalChar("A/B\\B")).toBe("ABB");
    expect(replaceIllegalChar("A-B")).toBe("AB");
    expect(replaceIllegalChar("A!B%C")).toBe("ABC");
  });

  it("removes every illegal character so the result passes isIllegalChar === false", () => {
    const raw = "=#'\"`$&;<>|*?/\\()[]{}!%\t\n-";
    const cleaned = replaceIllegalChar(raw);
    expect(cleaned).toBe("");
    expect(isIllegalChar(cleaned)).toBe(false);
  });

  it("matches isIllegalChar: if nothing was illegal, input equals output", () => {
    const safe = "MY_API_KEY_v2";
    expect(replaceIllegalChar(safe)).toBe(safe);
    expect(isIllegalChar(safe)).toBe(false);
  });
});

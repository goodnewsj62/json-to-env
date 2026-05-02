import { describe, expect, it } from "vitest";
import { buildCleanKeys } from "../src/helpers";

describe("buildCleanKeys", () => {
  it("defaults to upper_snake from camelCase and snake_case keys", () => {
    expect(buildCleanKeys("fooBar")).toBe("FOO_BAR");
    expect(buildCleanKeys("foo_bar")).toBe("FOO_BAR");
  });

  it("maps Pascal-style keys to upper_snake by default", () => {
    expect(buildCleanKeys("FooBar")).toBe("FOO_BAR");
  });

  it("strips illegal characters before detecting case", () => {
    expect(buildCleanKeys("foo-bar")).toBe("FOOBAR");
    expect(buildCleanKeys("my$key")).toBe("MYKEY");
  });

  it("returns an empty string when nothing remains after cleaning", () => {
    expect(buildCleanKeys("")).toBe("");
    expect(buildCleanKeys("===")).toBe("");
    expect(buildCleanKeys("   ")).toBe("");
  });

  it("trims surrounding whitespace", () => {
    expect(buildCleanKeys("  fooBar  ")).toBe("FOO_BAR");
  });

  it("respects keyCase when no custom seperator is given", () => {
    expect(buildCleanKeys("fooBar", undefined, "lower_snake")).toBe("foo_bar");
    expect(buildCleanKeys("fooBar", undefined, "camel_case")).toBe("fooBar");
    expect(buildCleanKeys("foo_bar", undefined, "camel_case")).toBe("fooBar");
    expect(buildCleanKeys("foo", undefined, "pascal_case")).toBe("Foo");
    expect(buildCleanKeys("foo_bar", undefined, "flat")).toBe("FOOBAR");
  });

  it("uses seperator join + uppercase and ignores keyCase when seperator is set", () => {
    expect(buildCleanKeys("fooBar", "-", "lower_snake")).toBe("FOO-BAR");
    expect(buildCleanKeys("fooBar", ".", "camel_case")).toBe("FOO.BAR");
  });

  it("handles flat keys after cleaning (no recognized convention)", () => {
    expect(buildCleanKeys("FOO_BAR")).toBe("FOO_BAR");
  });
});

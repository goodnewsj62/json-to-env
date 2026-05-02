import { describe, expect, it } from "vitest";
import { buildEnvKeyFromSeperator } from "../src/helpers";

describe("buildEnvKeyFromSeperator", () => {
  describe("explicit seperator", () => {
    it("joins with the given separator and uppercases (ignores keyCase)", () => {
      expect(buildEnvKeyFromSeperator(["a", "b", "c"], "-", "lower_snake")).toBe(
        "A-B-C",
      );
      expect(buildEnvKeyFromSeperator(["foo", "bar"], ".", "camel_case")).toBe(
        "FOO.BAR",
      );
    });
  });

  describe("upper_snake (default)", () => {
    it("joins with underscore and uppercases", () => {
      expect(buildEnvKeyFromSeperator(["foo", "bar"])).toBe("FOO_BAR");
      expect(
        buildEnvKeyFromSeperator(["foo", "bar"], undefined, "upper_snake"),
      ).toBe("FOO_BAR");
    });
  });

  describe("lower_snake", () => {
    it("joins with underscore and lowercases", () => {
      expect(buildEnvKeyFromSeperator(["FOO", "BAR"], undefined, "lower_snake")).toBe(
        "foo_bar",
      );
    });
  });

  describe("flat", () => {
    it("concatenates with no separator and uppercases", () => {
      expect(buildEnvKeyFromSeperator(["foo", "bar"], undefined, "flat")).toBe(
        "FOOBAR",
      );
    });
  });

  describe("camel_case", () => {
    it("keeps the first segment as-is and title-cases the rest", () => {
      expect(
        buildEnvKeyFromSeperator(["camel", "case"], undefined, "camel_case"),
      ).toBe("camelCase");
    });

    it("returns a single joined string when there are fewer than two parts", () => {
      expect(buildEnvKeyFromSeperator(["only"], undefined, "camel_case")).toBe(
        "only",
      );
      expect(buildEnvKeyFromSeperator([], undefined, "camel_case")).toBe("");
    });
  });

  describe("pascal_case", () => {
    it("capitalizes each segment and concatenates", () => {
      expect(
        buildEnvKeyFromSeperator(["pascal", "case"], undefined, "pascal_case"),
      ).toBe("PascalCase");
    });

    it("does not fall through to upper_snake (underscores)", () => {
      expect(
        buildEnvKeyFromSeperator(["us", "east"], undefined, "pascal_case"),
      ).toBe("UsEast");
    });

    it("handles a single part", () => {
      expect(buildEnvKeyFromSeperator(["foo"], undefined, "pascal_case")).toBe(
        "Foo",
      );
    });

    it("handles an empty parts array", () => {
      expect(buildEnvKeyFromSeperator([], undefined, "pascal_case")).toBe("");
    });
  });
});

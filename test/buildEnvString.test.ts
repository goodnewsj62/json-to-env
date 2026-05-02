import { describe, expect, it } from "vitest";
import { buildEnvString } from "../src/helpers";

describe("buildEnvString", () => {
  it("returns an empty string for an empty map", () => {
    expect(buildEnvString(new Map())).toBe("");
  });

  it("emits KEY=value lines in insertion order with trailing newlines", () => {
    const m = new Map([
      ["A", "1"],
      ["B", "two"],
    ]);
    expect(buildEnvString(m)).toBe("A=1\nB=two\n");
  });

  it("does not add a spurious leading newline before the first line", () => {
    expect(buildEnvString(new Map([["ONLY", "x"]]))).toBe("ONLY=x\n");
    expect(buildEnvString(new Map([["ONLY", "x"]]))).not.toMatch(/^\n/);
  });

  it("prepends a non-empty prefix using keyCase rules", () => {
    expect(buildEnvString(new Map([["HOST", "x"]]), "APP", "upper_snake")).toBe(
      "APP_HOST=x\n",
    );
  });
});

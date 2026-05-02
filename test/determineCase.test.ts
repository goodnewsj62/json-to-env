import { describe, expect, it } from "vitest";
import { determineCase } from "../src/helpers";

describe("determineCase", () => {
  it("returns flat with an empty part when the key is empty", () => {
    expect(determineCase("")).toEqual({
      caseType: "flat",
      parts: [""],
    });
  });

  it("returns flat with the whole key as a single part when no convention matches", () => {
    expect(determineCase("FOO_BAR")).toEqual({
      caseType: "flat",
      parts: ["FOO_BAR"],
    });
    expect(determineCase("foo-bar")).toEqual({
      caseType: "flat",
      parts: ["foo-bar"],
    });
    expect(determineCase("2d")).toEqual({
      caseType: "flat",
      parts: ["2d"],
    });
    expect(determineCase("Foo_bar")).toEqual({
      caseType: "flat",
      parts: ["Foo_bar"],
    });
  });

  it("detects snake_case and splits on underscores", () => {
    expect(determineCase("foo_bar")).toEqual({
      caseType: "snake_case",
      parts: ["foo", "bar"],
    });
    expect(determineCase("http_request_v2")).toEqual({
      caseType: "snake_case",
      parts: ["http", "request", "v2"],
    });
  });

  it("detects camelCase and splits at boundaries", () => {
    expect(determineCase("fooBar")).toEqual({
      caseType: "camel_case",
      parts: ["foo", "Bar"],
    });
    expect(determineCase("camelCase")).toEqual({
      caseType: "camel_case",
      parts: ["camel", "Case"],
    });
    expect(determineCase("parseHTML")).toEqual({
      caseType: "camel_case",
      parts: ["parse", "HTML"],
    });
  });

  it("detects PascalCase and splits at boundaries", () => {
    expect(determineCase("FooBar")).toEqual({
      caseType: "pascal_case",
      parts: ["Foo", "Bar"],
    });
    expect(determineCase("PascalCase")).toEqual({
      caseType: "pascal_case",
      parts: ["Pascal", "Case"],
    });
    expect(determineCase("XMLParser")).toEqual({
      caseType: "pascal_case",
      parts: ["XML", "Parser"],
    });
  });

  it("prefers snake_case over camel_case when both match (e.g. single lowercase word)", () => {
    expect(determineCase("foo")).toEqual({
      caseType: "snake_case",
      parts: ["foo"],
    });
  });

  it("treats a single lowercase letter as snake_case (checked before camel_case)", () => {
    expect(determineCase("a")).toEqual({
      caseType: "snake_case",
      parts: ["a"],
    });
  });

  it("treats a single uppercase letter as pascal_case", () => {
    expect(determineCase("A")).toEqual({
      caseType: "pascal_case",
      parts: ["A"],
    });
  });
});

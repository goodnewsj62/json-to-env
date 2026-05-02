import { describe, expect, it } from "vitest";
import { isCamelCase, isPascalCase, isSnakeCase } from "../src/helpers";

describe("isCamelCase", () => {
  it("returns false for empty string", () => {
    expect(isCamelCase("")).toBe(false);
  });

  it("accepts a single lowercase letter", () => {
    expect(isCamelCase("a")).toBe(true);
    expect(isCamelCase("z")).toBe(true);
  });

  it("accepts lowercase start with mixed alphanumeric tail", () => {
    expect(isCamelCase("foo")).toBe(true);
    expect(isCamelCase("fooBar")).toBe(true);
    expect(isCamelCase("camelCase")).toBe(true);
    expect(isCamelCase("parseHTML")).toBe(true);
    expect(isCamelCase("http2Request")).toBe(true);
    expect(isCamelCase("v2")).toBe(true);
    expect(isCamelCase("a1B2c")).toBe(true);
  });

  it("rejects when the first character is not a lowercase letter", () => {
    expect(isCamelCase("Foo")).toBe(false);
    expect(isCamelCase("1foo")).toBe(false);
    expect(isCamelCase("_foo")).toBe(false);
    expect(isCamelCase("$foo")).toBe(false);
  });

  it("rejects underscores, hyphens, and other separators", () => {
    expect(isCamelCase("foo_bar")).toBe(false);
    expect(isCamelCase("foo-bar")).toBe(false);
    expect(isCamelCase("foo.bar")).toBe(false);
    expect(isCamelCase("foo bar")).toBe(false);
  });

  it("rejects all-uppercase or non-alphanumeric characters in tail", () => {
    expect(isCamelCase("foo bar")).toBe(false);
    expect(isCamelCase("foo!")).toBe(false);
    expect(isCamelCase("foo@bar")).toBe(false);
  });
});

describe("isPascalCase", () => {
  it("returns false for empty string", () => {
    expect(isPascalCase("")).toBe(false);
  });

  it("accepts a single uppercase letter", () => {
    expect(isPascalCase("A")).toBe(true);
    expect(isPascalCase("Z")).toBe(true);
  });

  it("accepts uppercase start with alphanumeric tail", () => {
    expect(isPascalCase("Foo")).toBe(true);
    expect(isPascalCase("PascalCase")).toBe(true);
    expect(isPascalCase("ParseHTML")).toBe(true);
    expect(isPascalCase("API")).toBe(true);
    expect(isPascalCase("V2")).toBe(true);
    expect(isPascalCase("Http2Server")).toBe(true);
  });

  it("rejects when the first character is not uppercase", () => {
    expect(isPascalCase("foo")).toBe(false);
    expect(isPascalCase("fFoo")).toBe(false);
    expect(isPascalCase("1Foo")).toBe(false);
    expect(isPascalCase("_Foo")).toBe(false);
  });

  it("rejects underscores, hyphens, and spaces", () => {
    expect(isPascalCase("Foo_Bar")).toBe(false);
    expect(isPascalCase("Foo-Bar")).toBe(false);
    expect(isPascalCase("Foo Bar")).toBe(false);
  });

  it("rejects non-alphanumeric tail characters", () => {
    expect(isPascalCase("Foo!")).toBe(false);
    expect(isPascalCase("Foo.bar")).toBe(false);
  });
});

describe("isSnakeCase", () => {
  it("returns false for empty string", () => {
    expect(isSnakeCase("")).toBe(false);
  });

  it("accepts a single lowercase segment", () => {
    expect(isSnakeCase("a")).toBe(true);
    expect(isSnakeCase("foo")).toBe(true);
    expect(isSnakeCase("foo123")).toBe(true);
    expect(isSnakeCase("v2")).toBe(true);
  });

  it("accepts multiple segments separated by a single underscore", () => {
    expect(isSnakeCase("foo_bar")).toBe(true);
    expect(isSnakeCase("a_b_c")).toBe(true);
    expect(isSnakeCase("http_request_v2")).toBe(true);
  });

  it("rejects leading underscore, trailing underscore, or doubled underscores", () => {
    expect(isSnakeCase("_foo")).toBe(false);
    expect(isSnakeCase("foo_")).toBe(false);
    expect(isSnakeCase("foo__bar")).toBe(false);
    expect(isSnakeCase("__foo")).toBe(false);
    expect(isSnakeCase("_")).toBe(false);
  });

  it("rejects uppercase letters (reserved for upper_snake elsewhere)", () => {
    expect(isSnakeCase("Foo_bar")).toBe(false);
    expect(isSnakeCase("FOO_BAR")).toBe(false);
    expect(isSnakeCase("foo_Bar")).toBe(false);
  });

  it("rejects non-snake separators and characters", () => {
    expect(isSnakeCase("foo-bar")).toBe(false);
    expect(isSnakeCase("foo.bar")).toBe(false);
    expect(isSnakeCase("foo bar")).toBe(false);
    expect(isSnakeCase("foo!")).toBe(false);
  });

  it("rejects when the first character is not a lowercase letter", () => {
    expect(isSnakeCase("123")).toBe(false);
    expect(isSnakeCase("1foo")).toBe(false);
    expect(isSnakeCase("Foo")).toBe(false);
  });
});

describe("case helpers: overlapping forms", () => {
  it("documents that a single lowercase word matches both camel and snake", () => {
    expect(isCamelCase("foo")).toBe(true);
    expect(isSnakeCase("foo")).toBe(true);
    expect(isPascalCase("foo")).toBe(false);
  });

  it("documents that typical multi-hump names are exclusive", () => {
    expect(isCamelCase("fooBar")).toBe(true);
    expect(isSnakeCase("fooBar")).toBe(false);
    expect(isPascalCase("fooBar")).toBe(false);

    expect(isCamelCase("FooBar")).toBe(false);
    expect(isSnakeCase("foo_bar")).toBe(true);
    expect(isPascalCase("FooBar")).toBe(true);
  });
});

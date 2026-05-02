import { describe, expect, it } from "vitest";
import { splitCamelCase, splitPascalCase, splitSnakeCase } from "../src/helpers";

describe("splitCamelCase", () => {
  it("splits at a lowercase-to-uppercase boundary", () => {
    expect(splitCamelCase("camelCase")).toEqual(["camel", "Case"]);
    expect(splitCamelCase("fooBar")).toEqual(["foo", "Bar"]);
  });

  it("returns a single segment when there is no boundary", () => {
    expect(splitCamelCase("foo")).toEqual(["foo"]);
    expect(splitCamelCase("a")).toEqual(["a"]);
  });

  it("handles consecutive caps and digits like keyToEnvKeyPrefix", () => {
    expect(splitCamelCase("parseHTML")).toEqual(["parse", "HTML"]);
    expect(splitCamelCase("http2Request")).toEqual(["http2", "Request"]);
    expect(splitCamelCase("HTTPProxy")).toEqual(["HTTP", "Proxy"]);
  });

  it("returns an empty array for an empty string", () => {
    expect(splitCamelCase("")).toEqual([]);
  });
});

describe("splitPascalCase", () => {
  it("uses the same boundary rules as camelCase", () => {
    expect(splitPascalCase("PascalCase")).toEqual(["Pascal", "Case"]);
    expect(splitPascalCase("XMLParser")).toEqual(["XML", "Parser"]);
    expect(splitPascalCase("HTTPProxy")).toEqual(["HTTP", "Proxy"]);
  });

  it("returns one segment for a single word", () => {
    expect(splitPascalCase("Foo")).toEqual(["Foo"]);
    expect(splitPascalCase("API")).toEqual(["API"]);
  });

  it("returns an empty array for an empty string", () => {
    expect(splitPascalCase("")).toEqual([]);
  });
});

describe("splitSnakeCase", () => {
  it("splits on underscores", () => {
    expect(splitSnakeCase("foo_bar")).toEqual(["foo", "bar"]);
    expect(splitSnakeCase("a_b_c")).toEqual(["a", "b", "c"]);
  });

  it("drops empty segments from repeated or leading/trailing underscores", () => {
    expect(splitSnakeCase("__foo__")).toEqual(["foo"]);
    expect(splitSnakeCase("___")).toEqual([]);
  });

  it("returns one segment when there is no underscore", () => {
    expect(splitSnakeCase("foo")).toEqual(["foo"]);
  });

  it("returns an empty array for an empty string", () => {
    expect(splitSnakeCase("")).toEqual([]);
  });
});

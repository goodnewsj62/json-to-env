import { describe, expect, it } from "vitest";
import { transformObject } from "../src/helpers";

describe("transformObject", () => {
  describe('"json"', () => {
    it("returns a JSON string of the whole object", () => {
      const out = transformObject({ a: 1, b: "two" }, "json");
      expect(out).toBe('{"a":1,"b":"two"}');
      expect(JSON.parse(out as string)).toEqual({ a: 1, b: "two" });
    });

    it("serializes nested structures", () => {
      const out = transformObject({ nested: { x: true } }, "json");
      expect(JSON.parse(out as string)).toEqual({ nested: { x: true } });
    });
  });

  describe('"flatten"', () => {
    it("emits one line per top-level primitive", () => {
      expect(transformObject({ host: "localhost", port: 3000 }, "flatten")).toEqual([
        "HOST=localhost",
        "PORT=3000",
      ]);
    });

    it("joins nested plain object keys with underscores", () => {
      expect(
        transformObject({ db: { host: "db.example.com", port: 5432 } }, "flatten"),
      ).toEqual(["DB_HOST=db.example.com", "DB_PORT=5432"]);
    });

    it("JSON-encodes array values on the RHS", () => {
      expect(transformObject({ tags: ["a", "b"] }, "flatten")).toEqual([
        'TAGS=["a","b"]',
      ]);
    });

    it("skips object keys that normalize to an empty prefix", () => {
      expect(transformObject({ "": 1, ok: 2 }, "flatten")).toEqual(["OK=2"]);
    });

    it("returns an empty array for an empty object", () => {
      expect(transformObject({}, "flatten")).toEqual([]);
    });

    it("uses buildCleanKeys rules via keyCase for each path segment", () => {
      expect(
        transformObject({ fooBar: { nestedKey: 1 } }, "flatten", "lower_snake"),
      ).toEqual(["foo_bar_nested_key=1"]);
    });
  });

  describe('"ignore"', () => {
    it("returns an empty array", () => {
      expect(transformObject({ a: 1 }, "ignore")).toEqual([]);
    });
  });
});

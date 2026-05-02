import { describe, expect, it } from "vitest";
import { keyToEnvKeyPrefix, transformArray } from "../src/helpers";

describe("keyToEnvKeyPrefix", () => {
  it("uppercases simple keys", () => {
    expect(keyToEnvKeyPrefix("servers")).toBe("SERVERS");
    expect(keyToEnvKeyPrefix("users")).toBe("USERS");
  });

  it("inserts underscores for camelCase and PascalCase boundaries", () => {
    expect(keyToEnvKeyPrefix("myServers")).toBe("MY_SERVERS");
    expect(keyToEnvKeyPrefix("HTTPProxy")).toBe("HTTP_PROXY");
  });
});

describe('transformArray strategy "indexed"', () => {
  it("expands a top-level array of primitives", () => {
    const out = transformArray(
      ["api.example.com", "cdn.example.com", "admin.example.com"],
      "indexed",
      "servers",
    );
    expect(out).toEqual([
      "SERVERS_0=api.example.com",
      "SERVERS_1=cdn.example.com",
      "SERVERS_2=admin.example.com",
    ]);
  });

  it("expands a top-level array of flat objects", () => {
    const out = transformArray(
      [
        { name: "Ada", role: "admin" },
        { name: "Ben", role: "user" },
      ],
      "indexed",
      "users",
    );
    expect(out).toEqual([
      "USERS_0_NAME=Ada",
      "USERS_0_ROLE=admin",
      "USERS_1_NAME=Ben",
      "USERS_1_ROLE=user",
    ]);
  });

  it("returns an empty array for an empty input array", () => {
    expect(transformArray([], "indexed", "servers")).toEqual([]);
  });

  it("formats non-primitive nested values as JSON on the RHS", () => {
    const out = transformArray([{ meta: { id: 1 } }], "indexed", "items");
    expect(out).toEqual(['ITEMS_0_META={"id":1}']);
  });

  it("formats array nested values as JSON on the RHS", () => {
    const out = transformArray([{ tags: ["a", "b"] }], "indexed", "items");
    expect(out).toEqual(['ITEMS_0_TAGS=["a","b"]']);
  });

  it("throws when the property name normalizes to empty", () => {
    expect(() => transformArray([1], "indexed", "")).toThrow(
      /non-empty property name/,
    );
    expect(() => transformArray([1], "indexed", "===")).toThrow(
      /non-empty property name/,
    );
  });

  it("ignores nested object keys that normalize to empty", () => {
    const out = transformArray([{ "": "x", ok: "y" }], "indexed", "row");
    expect(out).toEqual(["ROW_0_OK=y"]);
  });

  it("leaves json and comma strategies ignoring baseKey shape", () => {
    expect(transformArray([1, 2], "json", "ignored")).toBe("1,2");
    expect(transformArray([1, 2], "comma", "ignored")).toBe("1,2");
  });
});
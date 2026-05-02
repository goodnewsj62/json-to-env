import { describe, expect, it } from "vitest";
import { jsonToEnv } from "../src/index";

describe("jsonToEnv", () => {
  it("converts top-level primitives to KEY=value lines", () => {
    expect(jsonToEnv({ PORT: "8080", HOST: "localhost" })).toBe(
      "PORT=8080\nHOST=localhost\n",
    );
  });

  it("accepts a JSON5 object string", () => {
    expect(jsonToEnv("{ foo: 1 }", {})).toBe("FOO=1\n");
  });

  it("flattens nested objects when objects is flatten (default)", () => {
    expect(jsonToEnv({ db: { host: "h", port: 5 } }, { objects: "flatten" })).toBe(
      "DB_HOST=h\nDB_PORT=5\n",
    );
  });

  it("serializes nested objects as JSON when objects is json", () => {
    const out = jsonToEnv({ meta: { a: 1 } }, { objects: "json" });
    const line = out.trim();
    const eq = line.indexOf("=");
    const jsonPart = line.slice(eq + 1);
    expect(line.slice(0, eq)).toBe("META");
    expect(JSON.parse(jsonPart)).toEqual({ a: 1 });
    expect(out.endsWith("\n")).toBe(true);
  });

  it("indexed arrays emit one variable per index without duplicating the base key", () => {
    expect(
      jsonToEnv(
        { servers: ["a.example.com", "b.example.com"] },
        { arrays: "indexed" },
      ),
    ).toBe("SERVERS_0=a.example.com\nSERVERS_1=b.example.com\n");
  });

  it("splits merged lines on the first equals so flattened values may contain =", () => {
    expect(jsonToEnv({ data: { x: "a=b" } }, { objects: "flatten" })).toBe(
      "DATA_X=a=b\n",
    );
  });

  it("prepends prefix to every emitted name", () => {
    expect(jsonToEnv({ PORT: 1 }, { prefix: "APP" })).toBe("APP_PORT=1\n");
  });

  it("maps null and undefined to empty string values", () => {
    expect(
      jsonToEnv({ a: null, b: undefined } as Record<string, unknown>),
    ).toBe("A=\nB=\n");
  });

  it("uses default arrays json for array values", () => {
    expect(jsonToEnv({ tags: [1, 2, 3] })).toBe("TAGS=1,2,3\n");
  });
});

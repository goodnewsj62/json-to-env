import type { ArrayJson, KeyCase, ObjectType } from "../types";
import { buildCleanKeys, keyToEnvKeyPrefix } from "./key-format";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}

function formatIndexedEnvValue(value: unknown): string {
  if (value == null) return "";
  const t = typeof value;
  if (t === "string") return value as string;
  if (t === "number" || t === "boolean" || t === "bigint") return String(value);
  if (t === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * Depth-first flatten of a plain object into env lines (no root prefix). Each path segment
 * uses {@link buildCleanKeys} so keys follow the same illegal-char, case-detection, and
 * `keyCase` rules as top-level keys; segments are joined with `_`.
 */
function flattenObjectToEnvLines(
  obj: Record<string, unknown>,
  prefixSegments: string[] = [],
  keyCase: KeyCase = "upper_snake",
): string[] {
  const lines: string[] = [];
  for (const [rawKey, val] of Object.entries(obj)) {
    const seg = buildCleanKeys(rawKey, undefined, keyCase);
    if (seg.length === 0) continue;
    const path = [...prefixSegments, seg];
    const fullKey = path.join("_");
    if (isPlainObject(val)) {
      lines.push(...flattenObjectToEnvLines(val, path, keyCase));
    } else {
      lines.push(`${fullKey}=${formatIndexedEnvValue(val)}`);
    }
  }
  return lines;
}

type TransformedArray = string | string[];

/**
 * @param baseKey — JSON property name for this array (used only by `"indexed"` to build `KEY_0`, …).
 */
export function transformArray(
  values: unknown[],
  strategy: ArrayJson,
  baseKey: string,
  seperator?: string,
  keyCase?: KeyCase,
): TransformedArray {
  switch (strategy) {
    case "json": {
      return values.toString();
    }
    case "comma": {
      return values.join(",");
    }
    case "indexed": {
      const prefix = keyToEnvKeyPrefix(baseKey);
      if (prefix.length === 0) {
        throw new Error(
          'transformArray: "indexed" requires a non-empty property name after normalization',
        );
      }
      const lines: string[] = [];
      for (let i = 0; i < values.length; i++) {
        const el = values[i];
        if (isPlainObject(el)) {
          for (const [nestedKey, nestedVal] of Object.entries(el)) {
            const nestedPrefix = keyToEnvKeyPrefix(nestedKey);
            if (nestedPrefix.length === 0) continue;
            lines.push(
              `${prefix}_${i}_${nestedPrefix}=${formatIndexedEnvValue(nestedVal)}`,
            );
          }
        } else {
          lines.push(`${prefix}_${i}=${formatIndexedEnvValue(el)}`);
        }
      }
      return lines;
    }
  }
}

export type TransformedObject = string | string[];

/**
 * Serializes a nested object for env output.
 *
 * - **`json`**: one JSON string of `value` (suitable as an assignment RHS; the caller supplies
 *   the outer env key).
 * - **`flatten`**: array of `KEY=value` lines; each path segment is built with
 *   {@link buildCleanKeys} (same rules as top-level keys), then segments joined with `_`. Plain
 *   objects recurse; arrays and other values use the same RHS rules as indexed arrays
 *   ({@link formatIndexedEnvValue}).
 * - **`ignore`**: empty array (no output).
 *
 * @param keyCase — Used only for `"flatten"`; passed to {@link buildCleanKeys} for every segment
 *   (default `upper_snake`).
 */
export function transformObject(
  value: Record<string, unknown>,
  type: ObjectType,
  keyCase: KeyCase = "upper_snake",
): TransformedObject {
  switch (type) {
    case "json":
      return JSON.stringify(value);
    case "flatten":
      return flattenObjectToEnvLines(value, [], keyCase);
    case "ignore":
      return [];
    default: {
      const _exhaust: never = type;
      return _exhaust;
    }
  }
}

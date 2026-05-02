import type { ArrayJson, KeyCase, ObjectType } from "../types";
type TransformedArray = string | string[];
/**
 * @param baseKey — JSON property name for this array (used only by `"indexed"` to build `KEY_0`, …).
 */
export declare function transformArray(values: unknown[], strategy: ArrayJson, baseKey: string, seperator?: string, keyCase?: KeyCase): TransformedArray;
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
export declare function transformObject(value: Record<string, unknown>, type: ObjectType, keyCase?: KeyCase): TransformedObject;
export {};
//# sourceMappingURL=transform-collections.d.ts.map
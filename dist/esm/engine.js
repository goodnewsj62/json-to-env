import { buildCleanKeys, buildEnvKeyFromSeperator, buildEnvString, parseInput, transformArray, transformObject, } from "./helpers";
/** Splits one `KEY=value…` line on the first `=` only (values may contain `=`). */
function splitEnvAssignment(line) {
    const i = line.indexOf("=");
    if (i < 0)
        return { key: line, value: "" };
    return { key: line.slice(0, i), value: line.slice(i + 1) };
}
/**
 * Merges `lines` of `KEY=value` into `keyPairs`. When `keysAreFull`, each line’s key is already
 * the final env name (e.g. indexed arrays). Otherwise keys are relative to `baseKey` (e.g.
 * flattened objects).
 */
function mergeEnvLines(lines, baseKey, keysAreFull, separator, keyCase, keyPairs) {
    for (const line of lines) {
        const { key, value } = splitEnvAssignment(line);
        const fullKey = keysAreFull
            ? key
            : buildEnvKeyFromSeperator([baseKey, key], separator, keyCase);
        keyPairs.set(fullKey, value);
    }
}
/**
 * Converts a JSON object (or a JSON5 string of an object) into a `.env`-style string: one
 * `KEY=value` per line, newline-terminated, ready to write to a file or pipe to tools that read
 * dotenv format.
 *
 * Top-level keys are normalized with {@link buildCleanKeys}. Values may be primitives, arrays, or
 * nested objects; use {@link Options.arrays} and {@link Options.objects} to control expansion.
 * `null` / `undefined` become empty string values.
 */
export function jsonToEnv(raw, options = {}) {
    const parsed = typeof raw === "string" ? parseInput(raw) : raw;
    const { arrays = "json", keyCase = "upper_snake", objects = "flatten", prefix, separator, } = options;
    const keyPairs = new Map();
    for (const [key, value] of Object.entries(parsed)) {
        const baseKey = buildCleanKeys(key, separator, keyCase);
        if (value === null || value === undefined) {
            keyPairs.set(baseKey, "");
            continue;
        }
        if (Array.isArray(value)) {
            const transformed = transformArray(value, arrays, baseKey, separator, keyCase);
            if (typeof transformed === "string") {
                keyPairs.set(baseKey, transformed);
            }
            else {
                mergeEnvLines(transformed, baseKey, arrays === "indexed", separator, keyCase, keyPairs);
            }
            continue;
        }
        if (typeof value === "object") {
            const transformed = transformObject(value, objects, keyCase);
            if (typeof transformed === "string") {
                keyPairs.set(baseKey, transformed);
            }
            else if (transformed.length > 0) {
                mergeEnvLines(transformed, baseKey, false, separator, keyCase, keyPairs);
            }
            continue;
        }
        keyPairs.set(baseKey, String(value));
    }
    return buildEnvString(keyPairs, prefix !== null && prefix !== void 0 ? prefix : "", keyCase, separator);
}
//# sourceMappingURL=engine.js.map
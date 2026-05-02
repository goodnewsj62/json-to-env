/**
 * Detects whether `key` matches one of the supported identifier shapes and, if so, which one.
 *
 * Each shape has a checker and a splitter; on the first match, returns that `caseType` and the
 * splitter’s `parts` (word segments at case or underscore boundaries).
 *
 * Check order is **snake_case → camel_case → pascal_case**. A key that matches more than one
 * convention (for example `foo`, which is both lower snake and camelCase) resolves to the first
 * hit in that order.
 *
 * If none of those checkers match (including empty `key`, or mixed / non-conforming keys such
 * as `FOO_BAR`, `foo-bar`, or `2d`), returns **`flat`** with `parts: [key]` so callers always get a
 * consistent shape.
 */
export function determineCase(key) {
    const strategies = {
        snake_case: { checker: isSnakeCase, splitter: splitSnakeCase },
        camel_case: { checker: isCamelCase, splitter: splitCamelCase },
        pascal_case: { checker: isPascalCase, splitter: splitPascalCase },
    };
    for (const [caseType, conf] of Object.entries(strategies)) {
        if (conf.checker(key)) {
            return {
                caseType: caseType,
                parts: conf.splitter(key),
            };
        }
    }
    return { caseType: "flat", parts: [key] };
}
export function handleKeyCaseransformation() { }
/** True if `key` is lower camelCase (starts with a lowercase letter; letters and digits only). */
export function isCamelCase(key) {
    if (key.length === 0)
        return false;
    return /^[a-z][a-zA-Z0-9]*$/.test(key);
}
/** True if `key` is PascalCase (starts with an uppercase letter; letters and digits only). */
export function isPascalCase(key) {
    if (key.length === 0)
        return false;
    return /^[A-Z][a-zA-Z0-9]*$/.test(key);
}
/** True if `key` is lower snake_case (lowercase segments separated by single underscores). */
export function isSnakeCase(key) {
    if (key.length === 0)
        return false;
    return /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/.test(key);
}
/**
 * Splits concatenated camelCase / PascalCase at word boundaries (same rules as
 * {@link keyToEnvKeyPrefix} before uppercasing).
 */
function splitAtCaseBoundaries(key) {
    if (key.length === 0)
        return [];
    const marked = key
        .replace(/([a-z\d])([A-Z])/g, "$1_$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2");
    return marked.split("_").filter((s) => s.length > 0);
}
/** Splits camelCase at boundaries, e.g. `camelCase` → `["camel", "Case"]`. */
export function splitCamelCase(key) {
    return splitAtCaseBoundaries(key);
}
/** Splits PascalCase at boundaries (same algorithm as {@link splitCamelCase}). */
export function splitPascalCase(key) {
    return splitAtCaseBoundaries(key);
}
/** Splits lower snake_case on `_`, e.g. `foo_bar` → `["foo", "bar"]`. */
export function splitSnakeCase(key) {
    return key.split("_").filter((s) => s.length > 0);
}
//# sourceMappingURL=case-identifiers.js.map
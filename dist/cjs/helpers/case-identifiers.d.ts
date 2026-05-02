/** Result of {@link determineCase}: a matched convention, or `flat` when none matched. */
export type DetermineCaseResult = {
    caseType: "snake_case" | "camel_case" | "pascal_case" | "flat";
    parts: string[];
};
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
export declare function determineCase(key: string): DetermineCaseResult;
export declare function handleKeyCaseransformation(): void;
/** True if `key` is lower camelCase (starts with a lowercase letter; letters and digits only). */
export declare function isCamelCase(key: string): boolean;
/** True if `key` is PascalCase (starts with an uppercase letter; letters and digits only). */
export declare function isPascalCase(key: string): boolean;
/** True if `key` is lower snake_case (lowercase segments separated by single underscores). */
export declare function isSnakeCase(key: string): boolean;
/** Splits camelCase at boundaries, e.g. `camelCase` → `["camel", "Case"]`. */
export declare function splitCamelCase(key: string): string[];
/** Splits PascalCase at boundaries (same algorithm as {@link splitCamelCase}). */
export declare function splitPascalCase(key: string): string[];
/** Splits lower snake_case on `_`, e.g. `foo_bar` → `["foo", "bar"]`. */
export declare function splitSnakeCase(key: string): string[];
//# sourceMappingURL=case-identifiers.d.ts.map
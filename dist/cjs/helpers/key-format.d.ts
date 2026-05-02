import type { KeyCase } from "../types";
/**
 * Normalizes a JSON-style property `key` into a single env-safe identifier string.
 *
 * Strips {@link replaceIllegalChar illegal} characters and trims whitespace, infers word
 * segments with {@link determineCase}, then joins and formats them with
 * {@link buildEnvKeyFromSeperator} using `keyCase` (default `upper_snake`). When `seperator` is
 * set, that path in `buildEnvKeyFromSeperator` applies instead (join + uppercase, `keyCase`
 * ignored).
 */
export declare function buildCleanKeys(key: string, seperator?: string, keyCase?: KeyCase): string;
/**
 * Joins `parts` into one env-style identifier according to `keyCase`, or uses an explicit
 * `seperator` when provided.
 *
 * When `seperator` is set, `parts` are joined with that string and the whole result is
 * uppercased (`keyCase` is ignored). Otherwise `keyCase` controls joining and casing.
 */
export declare function buildEnvKeyFromSeperator(parts: string[], seperator?: string, keyCase?: KeyCase): string;
/** JSON property name → UPPER_SNAKE segment for env keys (strips illegal chars first). */
export declare function keyToEnvKeyPrefix(key: string): string;
//# sourceMappingURL=key-format.d.ts.map
import type { KeyCase } from "../types";
import { buildEnvKeyFromSeperator } from "./key-format";

/**
 * Renders a `Map` of env variable names to string values as a `.env`-style document.
 *
 * Iteration order follows the map’s insertion order. Each line is `KEY=value` followed by `\n`
 * (including after the last line). Values are written as-is; escape or quote values that contain
 * `=`, `#`, newlines, etc. if your consumer requires it.
 *
 * When `prefix` is non-empty, each map `key` is merged with `prefix` using
 * {@link buildEnvKeyFromSeperator} (using `keyCase` and optional `seperator`), so you get names
 * like `PREFIX_SUBKEY`. When `prefix` is empty, map keys are emitted unchanged.
 *
 * @param values — Final variable names (or logical names before prefixing) → raw value strings.
 * @param prefix — Optional namespace prepended to every key (default empty).
 * @param keyCase — Passed to {@link buildEnvKeyFromSeperator} when combining with `prefix`.
 * @param seperator — Optional separator when merging `prefix` + key (same semantics as elsewhere).
 * @returns Empty string when `values` has no entries.
 */
export function buildEnvString(
  values: Map<string, string>,
  prefix = "",
  keyCase: KeyCase = "upper_snake",
  seperator?: string,
): string {
  let resp = "";
  for (const [key, val] of values.entries()) {
    const augmentedKey = prefix
      ? buildEnvKeyFromSeperator([prefix, key], seperator, keyCase)
      : key;
    resp += `${augmentedKey}=${val}\n`;
  }
  return resp;
}

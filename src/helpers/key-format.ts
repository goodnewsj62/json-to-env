import type { KeyCase } from "../types";
import { replaceIllegalChar } from "./illegal-char";
import { determineCase } from "./case-identifiers";

/**
 * Normalizes a JSON-style property `key` into a single env-safe identifier string.
 *
 * Strips {@link replaceIllegalChar illegal} characters and trims whitespace, infers word
 * segments with {@link determineCase}, then joins and formats them with
 * {@link buildEnvKeyFromSeperator} using `keyCase` (default `upper_snake`). When `seperator` is
 * set, that path in `buildEnvKeyFromSeperator` applies instead (join + uppercase, `keyCase`
 * ignored).
 */
export function buildCleanKeys(
  key: string,
  seperator?: string,
  keyCase: KeyCase = "upper_snake",
): string {
  const cleaned = replaceIllegalChar(key).trim();

  const { parts } = determineCase(cleaned);
  return buildEnvKeyFromSeperator(parts, seperator, keyCase);
}

/**
 * Joins `parts` into one env-style identifier according to `keyCase`, or uses an explicit
 * `seperator` when provided.
 *
 * When `seperator` is set, `parts` are joined with that string and the whole result is
 * uppercased (`keyCase` is ignored). Otherwise `keyCase` controls joining and casing.
 */
export function buildEnvKeyFromSeperator(
  parts: string[],
  seperator?: string,
  keyCase: KeyCase = "upper_snake",
): string {
  if (seperator) {
    return parts.join(seperator).toUpperCase();
  }

  switch (keyCase) {
    case "camel_case": {
      if (parts.length < 2) {
        return parts.join("");
      }
      const others = parts
        .slice(1)
        .reduce(
          (cumm, value) =>
            cumm + value.substring(0, 1).toUpperCase() + value.substring(1),
          "",
        );

      return parts[0] + others;
    }
    case "pascal_case": {
      return parts.reduce(
        (cumm, value) =>
          cumm + value.substring(0, 1).toUpperCase() + value.substring(1),
        "",
      );
    }
    case "upper_snake": {
      return parts.join("_").toUpperCase();
    }
    case "lower_snake": {
      return parts.join("_").toLowerCase();
    }
    case "flat": {
      return parts.join("").toUpperCase();
    }
    default: {
      return parts.join("").toUpperCase();
    }
  }
}
/** JSON property name → UPPER_SNAKE segment for env keys (strips illegal chars first). */
export function keyToEnvKeyPrefix(key: string): string {
  const cleaned = replaceIllegalChar(key).trim();
  if (cleaned.length === 0) return "";
  const withSeps = cleaned
    .replace(/([a-z\d])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_");
  return withSeps.toUpperCase();
}

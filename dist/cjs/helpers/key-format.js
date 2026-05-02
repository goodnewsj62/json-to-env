"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCleanKeys = buildCleanKeys;
exports.buildEnvKeyFromSeperator = buildEnvKeyFromSeperator;
exports.keyToEnvKeyPrefix = keyToEnvKeyPrefix;
var illegal_char_1 = require("./illegal-char");
var case_identifiers_1 = require("./case-identifiers");
/**
 * Normalizes a JSON-style property `key` into a single env-safe identifier string.
 *
 * Strips {@link replaceIllegalChar illegal} characters and trims whitespace, infers word
 * segments with {@link determineCase}, then joins and formats them with
 * {@link buildEnvKeyFromSeperator} using `keyCase` (default `upper_snake`). When `seperator` is
 * set, that path in `buildEnvKeyFromSeperator` applies instead (join + uppercase, `keyCase`
 * ignored).
 */
function buildCleanKeys(key, seperator, keyCase) {
    if (keyCase === void 0) { keyCase = "upper_snake"; }
    var cleaned = (0, illegal_char_1.replaceIllegalChar)(key).trim();
    var parts = (0, case_identifiers_1.determineCase)(cleaned).parts;
    return buildEnvKeyFromSeperator(parts, seperator, keyCase);
}
/**
 * Joins `parts` into one env-style identifier according to `keyCase`, or uses an explicit
 * `seperator` when provided.
 *
 * When `seperator` is set, `parts` are joined with that string and the whole result is
 * uppercased (`keyCase` is ignored). Otherwise `keyCase` controls joining and casing.
 */
function buildEnvKeyFromSeperator(parts, seperator, keyCase) {
    if (keyCase === void 0) { keyCase = "upper_snake"; }
    if (seperator) {
        return parts.join(seperator).toUpperCase();
    }
    switch (keyCase) {
        case "camel_case": {
            if (parts.length < 2) {
                return parts.join("");
            }
            var others = parts
                .slice(1)
                .reduce(function (cumm, value) {
                return cumm + value.substring(0, 1).toUpperCase() + value.substring(1);
            }, "");
            return parts[0] + others;
        }
        case "pascal_case": {
            return parts.reduce(function (cumm, value) {
                return cumm + value.substring(0, 1).toUpperCase() + value.substring(1);
            }, "");
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
function keyToEnvKeyPrefix(key) {
    var cleaned = (0, illegal_char_1.replaceIllegalChar)(key).trim();
    if (cleaned.length === 0)
        return "";
    var withSeps = cleaned
        .replace(/([a-z\d])([A-Z])/g, "$1_$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
        .replace(/[-\s]+/g, "_");
    return withSeps.toUpperCase();
}
//# sourceMappingURL=key-format.js.map
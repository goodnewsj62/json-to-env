"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineCase = determineCase;
exports.handleKeyCaseransformation = handleKeyCaseransformation;
exports.isCamelCase = isCamelCase;
exports.isPascalCase = isPascalCase;
exports.isSnakeCase = isSnakeCase;
exports.splitCamelCase = splitCamelCase;
exports.splitPascalCase = splitPascalCase;
exports.splitSnakeCase = splitSnakeCase;
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
function determineCase(key) {
    var e_1, _a;
    var strategies = {
        snake_case: { checker: isSnakeCase, splitter: splitSnakeCase },
        camel_case: { checker: isCamelCase, splitter: splitCamelCase },
        pascal_case: { checker: isPascalCase, splitter: splitPascalCase },
    };
    try {
        for (var _b = __values(Object.entries(strategies)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), caseType = _d[0], conf = _d[1];
            if (conf.checker(key)) {
                return {
                    caseType: caseType,
                    parts: conf.splitter(key),
                };
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return { caseType: "flat", parts: [key] };
}
function handleKeyCaseransformation() { }
/** True if `key` is lower camelCase (starts with a lowercase letter; letters and digits only). */
function isCamelCase(key) {
    if (key.length === 0)
        return false;
    return /^[a-z][a-zA-Z0-9]*$/.test(key);
}
/** True if `key` is PascalCase (starts with an uppercase letter; letters and digits only). */
function isPascalCase(key) {
    if (key.length === 0)
        return false;
    return /^[A-Z][a-zA-Z0-9]*$/.test(key);
}
/** True if `key` is lower snake_case (lowercase segments separated by single underscores). */
function isSnakeCase(key) {
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
    var marked = key
        .replace(/([a-z\d])([A-Z])/g, "$1_$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2");
    return marked.split("_").filter(function (s) { return s.length > 0; });
}
/** Splits camelCase at boundaries, e.g. `camelCase` → `["camel", "Case"]`. */
function splitCamelCase(key) {
    return splitAtCaseBoundaries(key);
}
/** Splits PascalCase at boundaries (same algorithm as {@link splitCamelCase}). */
function splitPascalCase(key) {
    return splitAtCaseBoundaries(key);
}
/** Splits lower snake_case on `_`, e.g. `foo_bar` → `["foo", "bar"]`. */
function splitSnakeCase(key) {
    return key.split("_").filter(function (s) { return s.length > 0; });
}
//# sourceMappingURL=case-identifiers.js.map
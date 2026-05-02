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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformArray = transformArray;
exports.transformObject = transformObject;
var key_format_1 = require("./key-format");
function isPlainObject(value) {
    return (typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.prototype.toString.call(value) === "[object Object]");
}
function formatIndexedEnvValue(value) {
    if (value == null)
        return "";
    var t = typeof value;
    if (t === "string")
        return value;
    if (t === "number" || t === "boolean" || t === "bigint")
        return String(value);
    if (t === "object")
        return JSON.stringify(value);
    return String(value);
}
/**
 * Depth-first flatten of a plain object into env lines (no root prefix). Each path segment
 * uses {@link buildCleanKeys} so keys follow the same illegal-char, case-detection, and
 * `keyCase` rules as top-level keys; segments are joined with `_`.
 */
function flattenObjectToEnvLines(obj, prefixSegments, keyCase) {
    var e_1, _a;
    if (prefixSegments === void 0) { prefixSegments = []; }
    if (keyCase === void 0) { keyCase = "upper_snake"; }
    var lines = [];
    try {
        for (var _b = __values(Object.entries(obj)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), rawKey = _d[0], val = _d[1];
            var seg = (0, key_format_1.buildCleanKeys)(rawKey, undefined, keyCase);
            if (seg.length === 0)
                continue;
            var path = __spreadArray(__spreadArray([], __read(prefixSegments), false), [seg], false);
            var fullKey = path.join("_");
            if (isPlainObject(val)) {
                lines.push.apply(lines, __spreadArray([], __read(flattenObjectToEnvLines(val, path, keyCase)), false));
            }
            else {
                lines.push("".concat(fullKey, "=").concat(formatIndexedEnvValue(val)));
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
    return lines;
}
/**
 * @param baseKey — JSON property name for this array (used only by `"indexed"` to build `KEY_0`, …).
 */
function transformArray(values, strategy, baseKey, seperator, keyCase) {
    var e_2, _a;
    switch (strategy) {
        case "json": {
            return values.toString();
        }
        case "comma": {
            return values.join(",");
        }
        case "indexed": {
            var prefix = (0, key_format_1.keyToEnvKeyPrefix)(baseKey);
            if (prefix.length === 0) {
                throw new Error('transformArray: "indexed" requires a non-empty property name after normalization');
            }
            var lines = [];
            for (var i = 0; i < values.length; i++) {
                var el = values[i];
                if (isPlainObject(el)) {
                    try {
                        for (var _b = (e_2 = void 0, __values(Object.entries(el))), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var _d = __read(_c.value, 2), nestedKey = _d[0], nestedVal = _d[1];
                            var nestedPrefix = (0, key_format_1.keyToEnvKeyPrefix)(nestedKey);
                            if (nestedPrefix.length === 0)
                                continue;
                            lines.push("".concat(prefix, "_").concat(i, "_").concat(nestedPrefix, "=").concat(formatIndexedEnvValue(nestedVal)));
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                else {
                    lines.push("".concat(prefix, "_").concat(i, "=").concat(formatIndexedEnvValue(el)));
                }
            }
            return lines;
        }
    }
}
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
function transformObject(value, type, keyCase) {
    if (keyCase === void 0) { keyCase = "upper_snake"; }
    switch (type) {
        case "json":
            return JSON.stringify(value);
        case "flatten":
            return flattenObjectToEnvLines(value, [], keyCase);
        case "ignore":
            return [];
        default: {
            var _exhaust = type;
            return _exhaust;
        }
    }
}
//# sourceMappingURL=transform-collections.js.map
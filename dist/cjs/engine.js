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
exports.jsonToEnv = jsonToEnv;
var helpers_1 = require("./helpers");
/** Splits one `KEY=value…` line on the first `=` only (values may contain `=`). */
function splitEnvAssignment(line) {
    var i = line.indexOf("=");
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
    var e_1, _a;
    try {
        for (var lines_1 = __values(lines), lines_1_1 = lines_1.next(); !lines_1_1.done; lines_1_1 = lines_1.next()) {
            var line = lines_1_1.value;
            var _b = splitEnvAssignment(line), key = _b.key, value = _b.value;
            var fullKey = keysAreFull
                ? key
                : (0, helpers_1.buildEnvKeyFromSeperator)([baseKey, key], separator, keyCase);
            keyPairs.set(fullKey, value);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (lines_1_1 && !lines_1_1.done && (_a = lines_1.return)) _a.call(lines_1);
        }
        finally { if (e_1) throw e_1.error; }
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
function jsonToEnv(raw, options) {
    var e_2, _a;
    if (options === void 0) { options = {}; }
    var parsed = typeof raw === "string" ? (0, helpers_1.parseInput)(raw) : raw;
    var _b = options.arrays, arrays = _b === void 0 ? "json" : _b, _c = options.keyCase, keyCase = _c === void 0 ? "upper_snake" : _c, _d = options.objects, objects = _d === void 0 ? "flatten" : _d, prefix = options.prefix, separator = options.separator;
    var keyPairs = new Map();
    try {
        for (var _e = __values(Object.entries(parsed)), _f = _e.next(); !_f.done; _f = _e.next()) {
            var _g = __read(_f.value, 2), key = _g[0], value = _g[1];
            var baseKey = (0, helpers_1.buildCleanKeys)(key, separator, keyCase);
            if (value === null || value === undefined) {
                keyPairs.set(baseKey, "");
                continue;
            }
            if (Array.isArray(value)) {
                var transformed = (0, helpers_1.transformArray)(value, arrays, baseKey, separator, keyCase);
                if (typeof transformed === "string") {
                    keyPairs.set(baseKey, transformed);
                }
                else {
                    mergeEnvLines(transformed, baseKey, arrays === "indexed", separator, keyCase, keyPairs);
                }
                continue;
            }
            if (typeof value === "object") {
                var transformed = (0, helpers_1.transformObject)(value, objects, keyCase);
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
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return (0, helpers_1.buildEnvString)(keyPairs, prefix !== null && prefix !== void 0 ? prefix : "", keyCase, separator);
}
//# sourceMappingURL=engine.js.map
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
exports.buildEnvString = buildEnvString;
var key_format_1 = require("./key-format");
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
function buildEnvString(values, prefix, keyCase, seperator) {
    var e_1, _a;
    if (prefix === void 0) { prefix = ""; }
    if (keyCase === void 0) { keyCase = "upper_snake"; }
    var resp = "";
    try {
        for (var _b = __values(values.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), key = _d[0], val = _d[1];
            var augmentedKey = prefix
                ? (0, key_format_1.buildEnvKeyFromSeperator)([prefix, key], seperator, keyCase)
                : key;
            resp += "".concat(augmentedKey, "=").concat(val, "\n");
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return resp;
}
//# sourceMappingURL=build-env-string.js.map
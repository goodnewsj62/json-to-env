"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIllegalChar = isIllegalChar;
exports.replaceIllegalChar = replaceIllegalChar;
/** Characters unsafe in .env / shell env names; keep in sync with {@link replaceIllegalChar}. */
var ILLEGAL_ENV_KEY_CHARS = /[=#'"`$&;<>|*?/\\()[\]{}!%\u0000-\u001f\s-]/;
/** True if `key` contains a character that is unsafe in .env / shell env names. */
function isIllegalChar(key) {
    return ILLEGAL_ENV_KEY_CHARS.test(key);
}
/** Removes every {@link isIllegalChar illegal} character from `key` (replaces with empty string). */
function replaceIllegalChar(key) {
    return key.replace(new RegExp(ILLEGAL_ENV_KEY_CHARS.source, "g"), "");
}
//# sourceMappingURL=illegal-char.js.map
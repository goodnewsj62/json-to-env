"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInput = parseInput;
var json5_1 = require("json5");
function parseInput(value) {
    try {
        return (0, json5_1.parse)(value.trim());
    }
    catch (error) {
        throw new Error("Input must be a JavaScript object literal (enclosed in {})");
    }
}
//# sourceMappingURL=parse-input.js.map
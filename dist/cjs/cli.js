#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("node:fs");
var path = require("node:path");
var index_1 = require("./index");
function usage() {
    return "json-to-env \u2014 convert a JSON (or JSON5) file to dotenv-style lines\n\nUsage:\n  json-to-env <input.json>           print to stdout\n  json-to-env <input.json> <out.env> write to a file\n\nOptions:\n  -h, --help    show this help\n";
}
function main() {
    var argv = process.argv.slice(2).filter(function (a) { return a !== "--"; });
    if (argv.length === 0) {
        process.stderr.write(usage());
        process.exit(1);
    }
    if (argv[0] === "-h" || argv[0] === "--help") {
        process.stdout.write(usage());
        process.exit(0);
    }
    if (argv.length > 2) {
        process.stderr.write("Error: too many arguments (expected input and optional output path)\n\n");
        process.stderr.write(usage());
        process.exit(1);
    }
    var inputPath = argv[0];
    var outputPath = argv[1];
    var absoluteInput = path.resolve(process.cwd(), inputPath);
    if (!fs.existsSync(absoluteInput)) {
        process.stderr.write("Error: file not found: ".concat(inputPath, "\n"));
        process.exit(1);
    }
    var raw = fs.readFileSync(absoluteInput, "utf8");
    var out;
    try {
        out = (0, index_1.jsonToEnv)(raw);
    }
    catch (e) {
        var msg = e instanceof Error ? e.message : String(e);
        process.stderr.write("Error: ".concat(msg, "\n"));
        process.exit(1);
    }
    if (outputPath) {
        var absoluteOut = path.resolve(process.cwd(), outputPath);
        fs.writeFileSync(absoluteOut, out, "utf8");
    }
    else {
        process.stdout.write(out);
    }
}
main();
//# sourceMappingURL=cli.js.map
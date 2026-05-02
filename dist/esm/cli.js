#!/usr/bin/env node
import * as fs from "node:fs";
import * as path from "node:path";
import { jsonToEnv } from "./index";
function usage() {
    return `json-to-env — convert a JSON (or JSON5) file to dotenv-style lines

Usage:
  json-to-env <input.json>           print to stdout
  json-to-env <input.json> <out.env> write to a file

Options:
  -h, --help    show this help
`;
}
function main() {
    const argv = process.argv.slice(2).filter((a) => a !== "--");
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
    const inputPath = argv[0];
    const outputPath = argv[1];
    const absoluteInput = path.resolve(process.cwd(), inputPath);
    if (!fs.existsSync(absoluteInput)) {
        process.stderr.write(`Error: file not found: ${inputPath}\n`);
        process.exit(1);
    }
    const raw = fs.readFileSync(absoluteInput, "utf8");
    let out;
    try {
        out = jsonToEnv(raw);
    }
    catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        process.stderr.write(`Error: ${msg}\n`);
        process.exit(1);
    }
    if (outputPath) {
        const absoluteOut = path.resolve(process.cwd(), outputPath);
        fs.writeFileSync(absoluteOut, out, "utf8");
    }
    else {
        process.stdout.write(out);
    }
}
main();
//# sourceMappingURL=cli.js.map
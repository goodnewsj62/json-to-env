const fs = require("fs");
const path = require("path");

const out = path.join(__dirname, "..", "dist", "esm", "package.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ type: "module" }, null, 2) + "\n");

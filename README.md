# @sourcepride/json-to-env

Turn **JSON**, **plain JavaScript object**, or a **JavaScript object literal string** into **dotenv-style** text: one `KEY=value` per line, ready for `.env` files and tools that read that format.

Convert Json to env values with no hassle

### JSON string

Strict **JSON** (double-quoted keys and strings) is fine when you pass a string:

```ts
import { jsonToEnv } from "@sourcepride/json-to-env";

const val = `{
  "port": 8080,
  "host": "127.0.0.1",
  "debug": false,
  "environment": "staging"
}`;

jsonToEnv(val);
```

Output:

```
PORT=8080
HOST=127.0.0.1
DEBUG=false
ENVIRONMENT=staging
```

### JavaScript object literal string

You can also pass text written like a **JavaScript object literal** (unquoted keys, trailing commas, relaxed quoting—anything that counts as a JSON5 object literal):

```ts
const literal = `{
  port: 8080,
  host: "127.0.0.1",
  debug: false,
  environment: "staging",
}`;

jsonToEnv(literal);
```

Output:

```
PORT=8080
HOST=127.0.0.1
DEBUG=false
ENVIRONMENT=staging
```

You can still pass a real object:

```ts
jsonToEnv({
  port: 8080,
  host: "127.0.0.1",
  debug: false,
  environment: "staging",
});
```

Output:

```
PORT=8080
HOST=127.0.0.1
DEBUG=false
ENVIRONMENT=staging
```

### JSON5 compatibility

String inputs are parsed with [**JSON5**](https://json5.org/), which is a **superset of JSON**. That is why both strict **JSON** strings and **JavaScript object literal** strings work the same way. The root value must be a plain **`{ ... }` object** (not an array at the root, not `null` alone).

### ES5 and ES6 compatibility

- **ES5:** the **CommonJS** entry (`require`) is built with an **ES5** language target for older Node and legacy bundles.
- **ES6 (ES2015) modules:** the **ESM** entry (`import` / `export`) is for modern Node and bundlers (emit uses **ES2015+** syntax).

---

## Install

```bash
npm install @sourcepride/json-to-env
```

Requires a **Node.js** (or bundler) environment; the package ships **CommonJS** and **ESM** builds plus **TypeScript** types.

---

## CLI

When the package is installed, the **`json-to-env`** command reads a **JSON or JSON5 file** (root must be a `{ ... }` object) and prints **dotenv-style** lines. Behavior matches the library defaults (same as calling `jsonToEnv` with a string and no options).

```bash
# Print to the terminal (stdout) — one-off without adding the dependency
npx --package @sourcepride/json-to-env json-to-env ./config.json

# Write to a file (optional second path)
npx --package @sourcepride/json-to-env json-to-env ./config.json ./.env
```

If `@sourcepride/json-to-env` is already in your **dependencies**, you can use the linked binary name directly:

```bash
npx json-to-env ./config.json
npx json-to-env ./config.json ./.env
json-to-env --help
```

**Global install:** `npm install -g @sourcepride/json-to-env`, then run `json-to-env` on your `PATH`. The command is wired in this package’s `bin` field to `dist/cjs/cli.js`.

---

## API

### `jsonToEnv(input, options?)`

| Argument  | Type                                      | Meaning                                                                                                                                                   |
| --------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`   | `Record<string, unknown>` **or** `string` | Either a plain JavaScript object, or a string that parses to an object (e.g. `{ port: 3000 }`). Leading and trailing whitespace on the string is ignored. |
| `options` | `Options` (optional)                      | Controls arrays, nested objects, key names, and prefixes. Defaults are applied when you omit a field.                                                     |

**Returns:** `string` — `.env`-style lines. **Empty map** → empty string `""`.

Re-exported types: `Options`, `ArrayJson`, `KeyCase`, `ObjectType`.

---

## Options (what they mean)

All fields are optional.

### `arrays` — top-level **array** values only

How each **property whose value is an array** is turned into env lines.

| Value                  | What it does                                                                                                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`"json"`** (default) | Uses JavaScript’s `array.toString()`. For numbers and strings this often looks like comma-separated text. **Objects inside the array** become the useless string `"[object Object]"` — avoid this mode for arrays of objects. |
| **`"comma"`**          | `array.join(",")` — one variable, comma-separated values. Same caveat for non-primitives as with `"json"`.                                                                                                                    |
| **`"indexed"`**        | One variable per index: `NAME_0=…`, `NAME_1=…`. If an element is a **plain object**, each of its fields becomes `NAME_0_FIELD=value` (good for lists of records).                                                             |

### `objects` — nested **plain object** values

How each **property whose value is a nested object** (not array, not `null`) is serialized.

| Value                     | What it does                                                                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`"flatten"`** (default) | Recurses into the object and emits **one line per leaf**, with path segments joined by `_`, e.g. `db.host` → `DB_HOST=…`.                                               |
| **`"json"`**              | One line: the key you chose, and the **whole nested object** as a **JSON string** on the right-hand side (good when you want a single env var holding structured data). |
| **`"ignore"`**            | Omits that property entirely (no lines).                                                                                                                                |

### `keyCase` — how JSON key **segments** become env names

Used when building names from parts (after illegal characters are stripped and words are detected). **Ignored** when `separator` is set (see below).

| Value                         | Example shape                                 |
| ----------------------------- | --------------------------------------------- |
| **`"upper_snake"`** (default) | `MY_APP_PORT`                                 |
| **`"lower_snake"`**           | `my_app_port`                                 |
| **`"camel_case"`**            | `myAppPort`                                   |
| **`"pascal_case"`**           | `MyAppPort`                                   |
| **`"flat"`**                  | Concatenated and uppercased, e.g. `MYAPPPORT` |

### `prefix`

If set, it is merged onto **every emitted variable name** (namespace), e.g. `prefix: "APP"` and key `PORT` → `APP_PORT=…`.

### `separator`

If set, path **parts** are joined with this string and the **whole key is uppercased**; **`keyCase` is not used** for that join path. Useful when you want a fixed delimiter instead of snake/camel rules.

---

## Examples

### 1. Object input (typical)

```ts
jsonToEnv({ PORT: "8080", HOST: "localhost" });
// PORT=8080\nHOST=localhost\n
```

### 2. JSON5 string (unquoted keys, trailing commas, etc.)

```ts
jsonToEnv(`{
  port: 3000,
  host: "127.0.0.1",
}`);
// PORT=3000\nHOST=127.0.0.1\n
```

### 3. Flatten nested config (default)

```ts
jsonToEnv({ db: { host: "h", port: 5 } }, { objects: "flatten" });
// DB_HOST=h\nDB_PORT=5\n
```

### 4. One env var holding JSON for a subtree

```ts
jsonToEnv({ meta: { a: 1, b: 2 } }, { objects: "json" });
// META={"a":1,"b":2}\n
```

### 5. List of hosts → indexed variables

```ts
jsonToEnv(
  { servers: ["a.example.com", "b.example.com"] },
  { arrays: "indexed" },
);
// SERVERS_0=a.example.com\nSERVERS_1=b.example.com\n
```

### 6. List of records → indexed + nested keys

```ts
jsonToEnv(
  {
    users: [
      { name: "Ada", role: "admin" },
      { name: "Ben", role: "user" },
    ],
  },
  { arrays: "indexed" },
);
// USERS_0_NAME=Ada\nUSERS_0_ROLE=admin\nUSERS_1_NAME=Ben\nUSERS_1_ROLE=user\n
```

### 7. Prefix every name

```ts
jsonToEnv({ PORT: 1 }, { prefix: "APP" });
// APP_PORT=1\n
```

### 8. `null` / `undefined` → empty value

```ts
jsonToEnv({ a: null, b: undefined } as Record<string, unknown>);
// A=\nB=\n
```

### 9. Default array handling (primitive list)

```ts
jsonToEnv({ tags: [1, 2, 3] });
// TAGS=1,2,3\n
```

---

## Errors and causes

| What you see                                                                                   | Likely cause                                                                                                                                   | What to do                                                                                                             |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **`Error: Input must be a JavaScript object literal (enclosed in {})`**                        | **JSON5 parsing failed** for the string (the message is **generic** for all parse failures).                                                   | Fix syntax (matching braces, commas, quotes). Ensure the text is valid JSON5.                                          |
| **`TypeError: Cannot convert undefined or null to object`** (or similar) when passing a string | Parsed JSON5 is **`null`** (e.g. input `"null"`).                                                                                              | Use a root **`{ ... }`** object, or pass a real object as `input`.                                                     |
| **Empty string `""` with no error**                                                            | String input parsed to an **empty array** `[]`.                                                                                                | Root value should be a **plain object** `{}`, not an array.                                                            |
| **Weird keys like `0`, `1`, …**                                                                | String input parsed to a **non-empty array** at root.                                                                                          | Same as above — use an object at the root.                                                                             |
| **`Error: transformArray: "indexed" requires a non-empty property name after normalization`**  | `arrays: "indexed"` but the **property name** for that array becomes **empty** after illegal characters are removed (e.g. only `=` / symbols). | Rename the JSON property to a normal identifier.                                                                       |
| **Wrong or empty env keys**                                                                    | Keys contained characters **unsafe** in shell/env names; they are **stripped** (not quoted).                                                   | Use simple names like `my_setting` or `mySetting`; avoid spaces, `#`, `=`, quotes, etc. in **keys**.                   |
| **`[object Object]` in values**                                                                | Array of **objects** with `arrays: "json"` or `"comma"` (both rely on string coercion, not real JSON).                                         | Switch to **`arrays: "indexed"`** for arrays of objects, or store the list as a **nested object** + `objects: "json"`. |

---

## Practical notes

- **Values** are written **as-is** (then coerced with `String(...)` for primitives). If a value contains `#`, newlines, or spaces, **consumers** of `.env` files may need **quoting or escaping** — this library does not add quotes for you.
- **Nested arrays** inside `objects: "flatten"` use JSON on the **right-hand side** for that line (see tests / flatten behavior).
- **Order** of lines follows the order keys were added when iterating the input object.

---

## License

MIT — see [LICENSE](./LICENSE).

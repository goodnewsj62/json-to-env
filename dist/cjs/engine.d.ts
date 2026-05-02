import { ArrayJson, KeyCase, ObjectType } from "./types";
/**
 * Controls how {@link jsonToEnv} turns JSON into `KEY=value` lines.
 */
export type Options = {
    /** How top-level arrays are serialized (`indexed` emits multiple variables). */
    arrays?: ArrayJson;
    /** How nested plain objects are handled (`flatten` vs a single JSON string). */
    objects?: ObjectType;
    /** Optional separator passed into key-building helpers (see {@link buildCleanKeys}). */
    separator?: string;
    /** Casing / joining style for derived env names (default `upper_snake`). */
    keyCase?: KeyCase;
    /** If set, prepended to every emitted variable name via {@link buildEnvString}. */
    prefix?: string;
};
/**
 * Converts a JSON object (or a JSON5 string of an object) into a `.env`-style string: one
 * `KEY=value` per line, newline-terminated, ready to write to a file or pipe to tools that read
 * dotenv format.
 *
 * Top-level keys are normalized with {@link buildCleanKeys}. Values may be primitives, arrays, or
 * nested objects; use {@link Options.arrays} and {@link Options.objects} to control expansion.
 * `null` / `undefined` become empty string values.
 */
export declare function jsonToEnv(raw: string | Record<string, unknown>, options?: Options): string;
//# sourceMappingURL=engine.d.ts.map
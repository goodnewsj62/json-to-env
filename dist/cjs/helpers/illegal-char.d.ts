/** True if `key` contains a character that is unsafe in .env / shell env names. */
export declare function isIllegalChar(key: string): boolean;
/** Removes every {@link isIllegalChar illegal} character from `key` (replaces with empty string). */
export declare function replaceIllegalChar(key: string): string;
//# sourceMappingURL=illegal-char.d.ts.map
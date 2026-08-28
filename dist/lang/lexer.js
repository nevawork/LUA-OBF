"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuaSyntaxError = exports.Tok = void 0;
exports.lex = lex;
// NEVAHEX-VM — Lua 5.1 lexer
var Tok;
(function (Tok) {
    Tok[Tok["Name"] = 0] = "Name";
    Tok[Tok["Number"] = 1] = "Number";
    Tok[Tok["String"] = 2] = "String";
    Tok[Tok["Keyword"] = 3] = "Keyword";
    Tok[Tok["Op"] = 4] = "Op";
    Tok[Tok["EOF"] = 5] = "EOF";
})(Tok || (exports.Tok = Tok = {}));
const KEYWORDS = new Set([
    "and", "break", "do", "else", "elseif", "end", "false", "for", "function",
    "if", "in", "local", "nil", "not", "or", "repeat", "return", "then", "true",
    "until", "while",
]);
const OPERATORS = [
    "...", "..", ".", "==", "~=", "<=", ">=", "<", ">", "=", "+", "-", "*", "/",
    "%", "^", "#", "|", "&", "~", "(", ")", "{", "}", "[", "]", ";", ":", ",",
];
class LuaSyntaxError extends Error {
    line;
    col;
    constructor(msg, line, col) {
        super(`${msg} at line ${line}, col ${col}`);
        this.line = line;
        this.col = col;
    }
}
exports.LuaSyntaxError = LuaSyntaxError;
const ESCAPES = {
    a: "\x07", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t", v: "\v",
    "\\": "\\", '"': '"', "'": "'", "\n": "\n",
};
function lex(src) {
    const toks = [];
    let i = 0;
    let line = 1;
    let col = 1;
    const adv = (n = 1) => {
        for (let k = 0; k < n; k++) {
            if (src[i] === "\n") {
                line++;
                col = 1;
            }
            else {
                col++;
            }
            i++;
        }
    };
    const push = (type, value, l = line, c = col) => toks.push({ type, value, line: l, col: c });
    while (i < src.length) {
        const ch = src[i];
        // whitespace
        if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r" || ch === "\v" || ch === "\f") {
            adv();
            continue;
        }
        // comments
        if (ch === "-" && src[i + 1] === "-") {
            const sl = line;
            const sc = col;
            adv(2);
            if (src[i] === "[" && (src[i + 1] === "[" || src[i + 1] === "=")) {
                const long = readLongBracket();
                if (long !== null)
                    continue; // long comment consumed
                // not actually a long bracket — fall through treating as line comment
            }
            while (i < src.length && src[i] !== "\n")
                adv();
            void sl;
            void sc;
            continue;
        }
        const sl = line;
        const sc = col;
        // name/keyword
        if (/[A-Za-z_]/.test(ch)) {
            let j = i;
            while (j < src.length && /[A-Za-z0-9_]/.test(src[j]))
                j++;
            const word = src.slice(i, j);
            adv(word.length);
            push(KEYWORDS.has(word) ? Tok.Keyword : Tok.Name, word, sl, sc);
            continue;
        }
        // numbers
        if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(src[i + 1] ?? ""))) {
            let j = i;
            if (ch === "0" && (src[i + 1] === "x" || src[i + 1] === "X")) {
                j = i + 2;
                while (j < src.length && /[0-9A-Fa-f]/.test(src[j]))
                    j++;
                const raw = src.slice(i, j);
                adv(j - i);
                push(Tok.Number, raw, sl, sc);
                continue;
            }
            while (j < src.length && /[0-9]/.test(src[j]))
                j++;
            if (src[j] === ".") {
                j++;
                while (j < src.length && /[0-9]/.test(src[j]))
                    j++;
            }
            if (src[j] === "e" || src[j] === "E") {
                let k = j + 1;
                if (src[k] === "+" || src[k] === "-")
                    k++;
                if (/[0-9]/.test(src[k] ?? "")) {
                    j = k;
                    while (j < src.length && /[0-9]/.test(src[j]))
                        j++;
                }
            }
            const raw = src.slice(i, j);
            adv(j - i);
            push(Tok.Number, raw, sl, sc);
            continue;
        }
        // strings
        if (ch === '"' || ch === "'") {
            push(Tok.String, readQuoted(ch), sl, sc);
            continue;
        }
        // long bracket string or '['
        if (ch === "[") {
            const saveI = i;
            const saveL = line;
            const saveC = col;
            const long = readLongBracket();
            if (long !== null) {
                push(Tok.String, long, sl, sc);
                continue;
            }
            i = saveI;
            line = saveL;
            col = saveC;
            adv();
            push(Tok.Op, "[", sl, sc);
            continue;
        }
        // operators
        let matched = null;
        for (const op of OPERATORS) {
            if (src.startsWith(op, i)) {
                matched = op;
                break;
            }
        }
        if (matched) {
            adv(matched.length);
            push(Tok.Op, matched, sl, sc);
            continue;
        }
        throw new LuaSyntaxError(`unexpected symbol '${ch}'`, line, col);
    }
    toks.push({ type: Tok.EOF, value: "<eof>", line, col });
    return toks;
    // reads a long bracket at current position; returns decoded content or null.
    function readLongBracket() {
        if (src[i] !== "[")
            return null;
        let level = 0;
        let j = i + 1;
        while (src[j] === "=") {
            level++;
            j++;
        }
        if (src[j] !== "[")
            return null;
        j++; // past opening [
        // skip first newline
        if (src[j] === "\r") {
            j++;
            if (src[j] === "\n")
                j++;
        }
        else if (src[j] === "\n") {
            j++;
        }
        const closeStr = "]" + "=".repeat(level) + "]";
        const endIdx = src.indexOf(closeStr, j);
        if (endIdx === -1)
            throw new LuaSyntaxError("unterminated long bracket", line, col);
        const content = src.slice(j, endIdx);
        // advance lexer position past closing bracket, fixing line/col
        const consumed = endIdx + closeStr.length - i;
        adv(consumed);
        return content;
    }
    function readQuoted(quote) {
        adv(); // opening quote
        let out = "";
        for (;;) {
            if (i >= src.length)
                throw new LuaSyntaxError("unterminated string", line, col);
            const c = src[i];
            if (c === quote) {
                adv();
                return out;
            }
            if (c === "\\") {
                adv();
                const e = src[i];
                if (e === undefined)
                    throw new LuaSyntaxError("unterminated string escape", line, col);
                if (e in ESCAPES) {
                    out += ESCAPES[e];
                    adv();
                }
                else if (/[0-9]/.test(e)) {
                    let d = "";
                    while (d.length < 3 && /[0-9]/.test(src[i] ?? "")) {
                        d += src[i];
                        adv();
                    }
                    out += String.fromCharCode(parseInt(d, 10) & 0xff);
                }
                else {
                    throw new LuaSyntaxError(`invalid escape '\\${e}'`, line, col);
                }
            }
            else if (c === "\n") {
                throw new LuaSyntaxError("unterminated string", line, col);
            }
            else {
                out += c;
                adv();
            }
        }
    }
}

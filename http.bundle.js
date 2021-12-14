function removeEmptyValues(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, value])=>{
        if (value === null) return false;
        if (value === undefined) return false;
        if (value === "") return false;
        return true;
    }));
}
function difference(arrA, arrB) {
    return arrA.filter((a)=>arrB.indexOf(a) < 0
    );
}
function parse(rawDotenv) {
    const env = {
    };
    for (const line of rawDotenv.split("\n")){
        if (!isVariableStart(line)) continue;
        const key = line.slice(0, line.indexOf("=")).trim();
        let value = line.slice(line.indexOf("=") + 1).trim();
        if (hasSingleQuotes(value)) {
            value = value.slice(1, -1);
        } else if (hasDoubleQuotes(value)) {
            value = value.slice(1, -1);
            value = expandNewlines(value);
        } else value = value.trim();
        env[key] = value;
    }
    return env;
}
function config(options = {
}) {
    const o = Object.assign({
        path: `.env`,
        export: false,
        safe: false,
        example: `.env.example`,
        allowEmptyValues: false,
        defaults: `.env.defaults`
    }, options);
    const conf = parseFile(o.path);
    if (o.defaults) {
        const confDefaults = parseFile(o.defaults);
        for(const key in confDefaults){
            if (!(key in conf)) {
                conf[key] = confDefaults[key];
            }
        }
    }
    if (o.safe) {
        const confExample = parseFile(o.example);
        assertSafe(conf, confExample, o.allowEmptyValues);
    }
    if (o.export) {
        for(const key in conf){
            if (Deno.env.get(key) !== undefined) continue;
            Deno.env.set(key, conf[key]);
        }
    }
    return conf;
}
function parseFile(filepath) {
    try {
        return parse(new TextDecoder("utf-8").decode(Deno.readFileSync(filepath)));
    } catch (e) {
        if (e instanceof Deno.errors.NotFound) return {
        };
        throw e;
    }
}
function isVariableStart(str) {
    return /^\s*[a-zA-Z_][a-zA-Z_0-9 ]*\s*=/.test(str);
}
function hasSingleQuotes(str) {
    return /^'([\s\S]*)'$/.test(str);
}
function hasDoubleQuotes(str) {
    return /^"([\s\S]*)"$/.test(str);
}
function expandNewlines(str) {
    return str.replaceAll("\\n", "\n");
}
function assertSafe(conf, confExample, allowEmptyValues) {
    const currentEnv = Deno.env.toObject();
    const confWithEnv = Object.assign({
    }, currentEnv, conf);
    const missing = difference(Object.keys(confExample), Object.keys(allowEmptyValues ? confWithEnv : removeEmptyValues(confWithEnv)));
    if (missing.length > 0) {
        const errorMessages = [
            `The following variables were defined in the example file but are not present in the environment:\n  ${missing.join(", ")}`,
            `Make sure to add them to your env file.`,
            !allowEmptyValues && `If you expect any of these variables to be empty, you can set the allowEmptyValues option to true.`, 
        ];
        throw new MissingEnvVarsError(errorMessages.filter(Boolean).join("\n\n"));
    }
}
class MissingEnvVarsError extends Error {
    constructor(message){
        super(message);
        this.name = "MissingEnvVarsError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
try {
    config({
        export: true
    });
    Deno.env.set("RUNTIME_ENV", "deno");
} catch (e) {
    console.error(".env file may not be loaded => ", e.name, ":", e.message);
}
"use strict";
function toString(type) {
    switch(type){
        case 1:
            return "A";
        case 10:
            return "NULL";
        case 28:
            return "AAAA";
        case 18:
            return "AFSDB";
        case 42:
            return "APL";
        case 257:
            return "CAA";
        case 60:
            return "CDNSKEY";
        case 59:
            return "CDS";
        case 37:
            return "CERT";
        case 5:
            return "CNAME";
        case 49:
            return "DHCID";
        case 32769:
            return "DLV";
        case 39:
            return "DNAME";
        case 48:
            return "DNSKEY";
        case 43:
            return "DS";
        case 55:
            return "HIP";
        case 13:
            return "HINFO";
        case 45:
            return "IPSECKEY";
        case 25:
            return "KEY";
        case 36:
            return "KX";
        case 29:
            return "LOC";
        case 15:
            return "MX";
        case 35:
            return "NAPTR";
        case 2:
            return "NS";
        case 47:
            return "NSEC";
        case 50:
            return "NSEC3";
        case 51:
            return "NSEC3PARAM";
        case 12:
            return "PTR";
        case 46:
            return "RRSIG";
        case 17:
            return "RP";
        case 24:
            return "SIG";
        case 6:
            return "SOA";
        case 99:
            return "SPF";
        case 33:
            return "SRV";
        case 44:
            return "SSHFP";
        case 32768:
            return "TA";
        case 249:
            return "TKEY";
        case 52:
            return "TLSA";
        case 250:
            return "TSIG";
        case 16:
            return "TXT";
        case 252:
            return "AXFR";
        case 251:
            return "IXFR";
        case 41:
            return "OPT";
        case 255:
            return "ANY";
        case 64:
            return "SVCB";
        case 65:
            return "HTTPS";
    }
    return "UNKNOWN_" + type;
}
function toType(name) {
    switch(name.toUpperCase()){
        case "A":
            return 1;
        case "NULL":
            return 10;
        case "AAAA":
            return 28;
        case "AFSDB":
            return 18;
        case "APL":
            return 42;
        case "CAA":
            return 257;
        case "CDNSKEY":
            return 60;
        case "CDS":
            return 59;
        case "CERT":
            return 37;
        case "CNAME":
            return 5;
        case "DHCID":
            return 49;
        case "DLV":
            return 32769;
        case "DNAME":
            return 39;
        case "DNSKEY":
            return 48;
        case "DS":
            return 43;
        case "HIP":
            return 55;
        case "HINFO":
            return 13;
        case "IPSECKEY":
            return 45;
        case "KEY":
            return 25;
        case "KX":
            return 36;
        case "LOC":
            return 29;
        case "MX":
            return 15;
        case "NAPTR":
            return 35;
        case "NS":
            return 2;
        case "NSEC":
            return 47;
        case "NSEC3":
            return 50;
        case "NSEC3PARAM":
            return 51;
        case "PTR":
            return 12;
        case "RRSIG":
            return 46;
        case "RP":
            return 17;
        case "SIG":
            return 24;
        case "SOA":
            return 6;
        case "SPF":
            return 99;
        case "SRV":
            return 33;
        case "SSHFP":
            return 44;
        case "TA":
            return 32768;
        case "TKEY":
            return 249;
        case "TLSA":
            return 52;
        case "TSIG":
            return 250;
        case "TXT":
            return 16;
        case "AXFR":
            return 252;
        case "IXFR":
            return 251;
        case "OPT":
            return 41;
        case "ANY":
            return 255;
        case "*":
            return 255;
        case "SVCB":
            return 64;
        case "HTTPS":
            return 65;
    }
    if (name.toUpperCase().startsWith("UNKNOWN_")) return parseInt(name.slice(8));
    return 0;
}
"use strict";
function toString1(rcode) {
    switch(rcode){
        case 0:
            return "NOERROR";
        case 1:
            return "FORMERR";
        case 2:
            return "SERVFAIL";
        case 3:
            return "NXDOMAIN";
        case 4:
            return "NOTIMP";
        case 5:
            return "REFUSED";
        case 6:
            return "YXDOMAIN";
        case 7:
            return "YXRRSET";
        case 8:
            return "NXRRSET";
        case 9:
            return "NOTAUTH";
        case 10:
            return "NOTZONE";
        case 11:
            return "RCODE_11";
        case 12:
            return "RCODE_12";
        case 13:
            return "RCODE_13";
        case 14:
            return "RCODE_14";
        case 15:
            return "RCODE_15";
    }
    return "RCODE_" + rcode;
}
"use strict";
function toString2(opcode) {
    switch(opcode){
        case 0:
            return "QUERY";
        case 1:
            return "IQUERY";
        case 2:
            return "STATUS";
        case 3:
            return "OPCODE_3";
        case 4:
            return "NOTIFY";
        case 5:
            return "UPDATE";
        case 6:
            return "OPCODE_6";
        case 7:
            return "OPCODE_7";
        case 8:
            return "OPCODE_8";
        case 9:
            return "OPCODE_9";
        case 10:
            return "OPCODE_10";
        case 11:
            return "OPCODE_11";
        case 12:
            return "OPCODE_12";
        case 13:
            return "OPCODE_13";
        case 14:
            return "OPCODE_14";
        case 15:
            return "OPCODE_15";
    }
    return "OPCODE_" + opcode;
}
"use strict";
function toString3(klass) {
    switch(klass){
        case 1:
            return "IN";
        case 2:
            return "CS";
        case 3:
            return "CH";
        case 4:
            return "HS";
        case 255:
            return "ANY";
    }
    return "UNKNOWN_" + klass;
}
function toClass(name) {
    switch(name.toUpperCase()){
        case "IN":
            return 1;
        case "CS":
            return 2;
        case "CH":
            return 3;
        case "HS":
            return 4;
        case "ANY":
            return 255;
    }
    return 0;
}
"use strict";
function toString4(type) {
    switch(type){
        case 1:
            return "LLQ";
        case 2:
            return "UL";
        case 3:
            return "NSID";
        case 5:
            return "DAU";
        case 6:
            return "DHU";
        case 7:
            return "N3U";
        case 8:
            return "CLIENT_SUBNET";
        case 9:
            return "EXPIRE";
        case 10:
            return "COOKIE";
        case 11:
            return "TCP_KEEPALIVE";
        case 12:
            return "PADDING";
        case 13:
            return "CHAIN";
        case 14:
            return "KEY_TAG";
        case 26946:
            return "DEVICEID";
    }
    if (type < 0) {
        return null;
    }
    return `OPTION_${type}`;
}
function toCode(name) {
    if (typeof name === "number") {
        return name;
    }
    if (!name) {
        return -1;
    }
    switch(name.toUpperCase()){
        case "OPTION_0":
            return 0;
        case "LLQ":
            return 1;
        case "UL":
            return 2;
        case "NSID":
            return 3;
        case "OPTION_4":
            return 4;
        case "DAU":
            return 5;
        case "DHU":
            return 6;
        case "N3U":
            return 7;
        case "CLIENT_SUBNET":
            return 8;
        case "EXPIRE":
            return 9;
        case "COOKIE":
            return 10;
        case "TCP_KEEPALIVE":
            return 11;
        case "PADDING":
            return 12;
        case "CHAIN":
            return 13;
        case "KEY_TAG":
            return 14;
        case "DEVICEID":
            return 26946;
        case "OPTION_65535":
            return 65535;
    }
    const m = name.match(/_(\d+)$/);
    if (m) {
        return parseInt(m[1], 10);
    }
    return -1;
}
"use strict";
function toString5(type) {
    switch(type){
        case 0:
            return "mandatory";
        case 1:
            return "alpn";
        case 2:
            return "no-default-alpn";
        case 3:
            return "port";
        case 4:
            return "ipv4hint";
        case 5:
            return "ech";
        case 6:
            return "ipv6hint";
    }
    return "key" + type;
}
function toKey(name) {
    switch(name.toLowerCase()){
        case "mandatory":
            return 0;
        case "alpn":
            return 1;
        case "no-default-alpn":
            return 2;
        case "port":
            return 3;
        case "ipv4hint":
            return 4;
        case "ech":
            return 5;
        case "ipv6hint":
            return 6;
    }
    if (name.toLowerCase().startsWith("key")) return parseInt(name.slice(3));
    throw "Invalid svcparam key";
}
const hexTable = new TextEncoder().encode("0123456789abcdef");
function errInvalidByte(__byte) {
    return new TypeError(`Invalid byte '${String.fromCharCode(__byte)}'`);
}
function errLength() {
    return new RangeError("Odd length hex string");
}
function fromHexChar(__byte) {
    if (48 <= __byte && __byte <= 57) return __byte - 48;
    if (97 <= __byte && __byte <= 102) return __byte - 97 + 10;
    if (65 <= __byte && __byte <= 70) return __byte - 65 + 10;
    throw errInvalidByte(__byte);
}
function encode(src) {
    const dst = new Uint8Array(src.length * 2);
    for(let i = 0; i < dst.length; i++){
        const v = src[i];
        dst[i * 2] = hexTable[v >> 4];
        dst[i * 2 + 1] = hexTable[v & 15];
    }
    return dst;
}
function decode(src) {
    const dst = new Uint8Array(src.length / 2);
    for(let i = 0; i < dst.length; i++){
        const a = fromHexChar(src[i * 2]);
        const b = fromHexChar(src[i * 2 + 1]);
        dst[i] = a << 4 | b;
    }
    if (src.length % 2 == 1) {
        fromHexChar(src[dst.length * 2]);
        throw errLength();
    }
    return dst;
}
const base64abc = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/"
];
function encode1(data) {
    const uint8 = typeof data === "string" ? new TextEncoder().encode(data) : data instanceof Uint8Array ? data : new Uint8Array(data);
    let result = "", i;
    const l = uint8.length;
    for(i = 2; i < l; i += 3){
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 3) << 4 | uint8[i - 1] >> 4];
        result += base64abc[(uint8[i - 1] & 15) << 2 | uint8[i] >> 6];
        result += base64abc[uint8[i] & 63];
    }
    if (i === l + 1) {
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 3) << 4];
        result += "==";
    }
    if (i === l) {
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 3) << 4 | uint8[i - 1] >> 4];
        result += base64abc[(uint8[i - 1] & 15) << 2];
        result += "=";
    }
    return result;
}
function decode1(b64) {
    const binString = atob(b64);
    const size = binString.length;
    const bytes = new Uint8Array(size);
    for(let i = 0; i < size; i++){
        bytes[i] = binString.charCodeAt(i);
    }
    return bytes;
}
const { Deno: Deno1  } = globalThis;
typeof Deno1?.noColor === "boolean" ? Deno1.noColor : true;
new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", 
].join("|"), "g");
var DiffType;
(function(DiffType) {
    DiffType["removed"] = "removed";
    DiffType["common"] = "common";
    DiffType["added"] = "added";
})(DiffType || (DiffType = {
}));
class AssertionError extends Error {
    name = "AssertionError";
    constructor(message){
        super(message);
    }
}
function unreachable() {
    throw new AssertionError("unreachable");
}
function notImplemented(msg) {
    const message = msg ? `Not implemented: ${msg}` : "Not implemented";
    throw new Error(message);
}
function normalizeEncoding(enc) {
    if (enc == null || enc === "utf8" || enc === "utf-8") return "utf8";
    return slowCases(enc);
}
function slowCases(enc) {
    switch(enc.length){
        case 4:
            if (enc === "UTF8") return "utf8";
            if (enc === "ucs2" || enc === "UCS2") return "utf16le";
            enc = `${enc}`.toLowerCase();
            if (enc === "utf8") return "utf8";
            if (enc === "ucs2") return "utf16le";
            break;
        case 3:
            if (enc === "hex" || enc === "HEX" || `${enc}`.toLowerCase() === "hex") {
                return "hex";
            }
            break;
        case 5:
            if (enc === "ascii") return "ascii";
            if (enc === "ucs-2") return "utf16le";
            if (enc === "UTF-8") return "utf8";
            if (enc === "ASCII") return "ascii";
            if (enc === "UCS-2") return "utf16le";
            enc = `${enc}`.toLowerCase();
            if (enc === "utf-8") return "utf8";
            if (enc === "ascii") return "ascii";
            if (enc === "ucs-2") return "utf16le";
            break;
        case 6:
            if (enc === "base64") return "base64";
            if (enc === "latin1" || enc === "binary") return "latin1";
            if (enc === "BASE64") return "base64";
            if (enc === "LATIN1" || enc === "BINARY") return "latin1";
            enc = `${enc}`.toLowerCase();
            if (enc === "base64") return "base64";
            if (enc === "latin1" || enc === "binary") return "latin1";
            break;
        case 7:
            if (enc === "utf16le" || enc === "UTF16LE" || `${enc}`.toLowerCase() === "utf16le") {
                return "utf16le";
            }
            break;
        case 8:
            if (enc === "utf-16le" || enc === "UTF-16LE" || `${enc}`.toLowerCase() === "utf-16le") {
                return "utf16le";
            }
            break;
        default:
            if (enc === "") return "utf8";
    }
}
const kCustomPromisifiedSymbol = Symbol.for("nodejs.util.promisify.custom");
const kCustomPromisifyArgsSymbol = Symbol.for("nodejs.util.promisify.customArgs");
class NodeInvalidArgTypeError extends TypeError {
    code = "ERR_INVALID_ARG_TYPE";
    constructor(argumentName, type, received){
        super(`The "${argumentName}" argument must be of type ${type}. Received ${typeof received}`);
    }
}
function promisify(original) {
    if (typeof original !== "function") {
        throw new NodeInvalidArgTypeError("original", "Function", original);
    }
    if (original[kCustomPromisifiedSymbol]) {
        const fn = original[kCustomPromisifiedSymbol];
        if (typeof fn !== "function") {
            throw new NodeInvalidArgTypeError("util.promisify.custom", "Function", fn);
        }
        return Object.defineProperty(fn, kCustomPromisifiedSymbol, {
            value: fn,
            enumerable: false,
            writable: false,
            configurable: true
        });
    }
    const argumentNames = original[kCustomPromisifyArgsSymbol];
    function fn(...args) {
        return new Promise((resolve, reject)=>{
            original.call(this, ...args, (err, ...values)=>{
                if (err) {
                    return reject(err);
                }
                if (argumentNames !== undefined && values.length > 1) {
                    const obj = {
                    };
                    for(let i = 0; i < argumentNames.length; i++){
                        obj[argumentNames[i]] = values[i];
                    }
                    resolve(obj);
                } else {
                    resolve(values[0]);
                }
            });
        });
    }
    Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
        value: fn,
        enumerable: false,
        writable: false,
        configurable: true
    });
    return Object.defineProperties(fn, Object.getOwnPropertyDescriptors(original));
}
promisify.custom = kCustomPromisifiedSymbol;
Object.prototype.toString;
const osType = (()=>{
    const { Deno  } = globalThis;
    if (typeof Deno?.build?.os === "string") {
        return Deno.build.os;
    }
    const { navigator  } = globalThis;
    if (navigator?.appVersion?.includes?.("Win") ?? false) {
        return "windows";
    }
    return "linux";
})();
class NodeErrorAbstraction extends Error {
    code;
    constructor(name, code, message){
        super(message);
        this.code = code;
        this.name = name;
        this.stack = this.stack && `${name} [${this.code}]${this.stack.slice(20)}`;
    }
    toString() {
        return `${this.name} [${this.code}]: ${this.message}`;
    }
}
class NodeRangeError extends NodeErrorAbstraction {
    constructor(code, message){
        super(RangeError.prototype.name, code, message);
        Object.setPrototypeOf(this, RangeError.prototype);
    }
}
Number.isSafeInteger;
const DEFAULT_INSPECT_OPTIONS = {
    showHidden: false,
    depth: 2,
    colors: false,
    customInspect: true,
    showProxy: false,
    maxArrayLength: 100,
    maxStringLength: Infinity,
    breakLength: 80,
    compact: 3,
    sorted: false,
    getters: false
};
inspect.defaultOptions = DEFAULT_INSPECT_OPTIONS;
inspect.custom = Symbol.for("nodejs.util.inspect.custom");
function inspect(object, ...opts) {
    if (typeof object === "string" && !object.includes("'")) {
        return `'${object}'`;
    }
    opts = {
        ...DEFAULT_INSPECT_OPTIONS,
        ...opts
    };
    return Deno.inspect(object, {
        depth: opts.depth,
        iterableLimit: opts.maxArrayLength,
        compact: !!opts.compact,
        sorted: !!opts.sorted,
        showProxy: !!opts.showProxy
    });
}
class ERR_OUT_OF_RANGE extends RangeError {
    code = "ERR_OUT_OF_RANGE";
    constructor(str, range, received){
        super(`The value of "${str}" is out of range. It must be ${range}. Received ${received}`);
        const { name  } = this;
        this.name = `${name} [${this.code}]`;
        this.stack;
        this.name = name;
    }
}
class ERR_BUFFER_OUT_OF_BOUNDS extends NodeRangeError {
    constructor(name){
        super("ERR_BUFFER_OUT_OF_BOUNDS", name ? `"${name}" is outside of buffer bounds` : "Attempt to access memory outside buffer bounds");
    }
}
const windows = [
    [
        -4093,
        [
            "E2BIG",
            "argument list too long"
        ]
    ],
    [
        -4092,
        [
            "EACCES",
            "permission denied"
        ]
    ],
    [
        -4091,
        [
            "EADDRINUSE",
            "address already in use"
        ]
    ],
    [
        -4090,
        [
            "EADDRNOTAVAIL",
            "address not available"
        ]
    ],
    [
        -4089,
        [
            "EAFNOSUPPORT",
            "address family not supported"
        ]
    ],
    [
        -4088,
        [
            "EAGAIN",
            "resource temporarily unavailable"
        ]
    ],
    [
        -3000,
        [
            "EAI_ADDRFAMILY",
            "address family not supported"
        ]
    ],
    [
        -3001,
        [
            "EAI_AGAIN",
            "temporary failure"
        ]
    ],
    [
        -3002,
        [
            "EAI_BADFLAGS",
            "bad ai_flags value"
        ]
    ],
    [
        -3013,
        [
            "EAI_BADHINTS",
            "invalid value for hints"
        ]
    ],
    [
        -3003,
        [
            "EAI_CANCELED",
            "request canceled"
        ]
    ],
    [
        -3004,
        [
            "EAI_FAIL",
            "permanent failure"
        ]
    ],
    [
        -3005,
        [
            "EAI_FAMILY",
            "ai_family not supported"
        ]
    ],
    [
        -3006,
        [
            "EAI_MEMORY",
            "out of memory"
        ]
    ],
    [
        -3007,
        [
            "EAI_NODATA",
            "no address"
        ]
    ],
    [
        -3008,
        [
            "EAI_NONAME",
            "unknown node or service"
        ]
    ],
    [
        -3009,
        [
            "EAI_OVERFLOW",
            "argument buffer overflow"
        ]
    ],
    [
        -3014,
        [
            "EAI_PROTOCOL",
            "resolved protocol is unknown"
        ]
    ],
    [
        -3010,
        [
            "EAI_SERVICE",
            "service not available for socket type"
        ]
    ],
    [
        -3011,
        [
            "EAI_SOCKTYPE",
            "socket type not supported"
        ]
    ],
    [
        -4084,
        [
            "EALREADY",
            "connection already in progress"
        ]
    ],
    [
        -4083,
        [
            "EBADF",
            "bad file descriptor"
        ]
    ],
    [
        -4082,
        [
            "EBUSY",
            "resource busy or locked"
        ]
    ],
    [
        -4081,
        [
            "ECANCELED",
            "operation canceled"
        ]
    ],
    [
        -4080,
        [
            "ECHARSET",
            "invalid Unicode character"
        ]
    ],
    [
        -4079,
        [
            "ECONNABORTED",
            "software caused connection abort"
        ]
    ],
    [
        -4078,
        [
            "ECONNREFUSED",
            "connection refused"
        ]
    ],
    [
        -4077,
        [
            "ECONNRESET",
            "connection reset by peer"
        ]
    ],
    [
        -4076,
        [
            "EDESTADDRREQ",
            "destination address required"
        ]
    ],
    [
        -4075,
        [
            "EEXIST",
            "file already exists"
        ]
    ],
    [
        -4074,
        [
            "EFAULT",
            "bad address in system call argument"
        ]
    ],
    [
        -4036,
        [
            "EFBIG",
            "file too large"
        ]
    ],
    [
        -4073,
        [
            "EHOSTUNREACH",
            "host is unreachable"
        ]
    ],
    [
        -4072,
        [
            "EINTR",
            "interrupted system call"
        ]
    ],
    [
        -4071,
        [
            "EINVAL",
            "invalid argument"
        ]
    ],
    [
        -4070,
        [
            "EIO",
            "i/o error"
        ]
    ],
    [
        -4069,
        [
            "EISCONN",
            "socket is already connected"
        ]
    ],
    [
        -4068,
        [
            "EISDIR",
            "illegal operation on a directory"
        ]
    ],
    [
        -4067,
        [
            "ELOOP",
            "too many symbolic links encountered"
        ]
    ],
    [
        -4066,
        [
            "EMFILE",
            "too many open files"
        ]
    ],
    [
        -4065,
        [
            "EMSGSIZE",
            "message too long"
        ]
    ],
    [
        -4064,
        [
            "ENAMETOOLONG",
            "name too long"
        ]
    ],
    [
        -4063,
        [
            "ENETDOWN",
            "network is down"
        ]
    ],
    [
        -4062,
        [
            "ENETUNREACH",
            "network is unreachable"
        ]
    ],
    [
        -4061,
        [
            "ENFILE",
            "file table overflow"
        ]
    ],
    [
        -4060,
        [
            "ENOBUFS",
            "no buffer space available"
        ]
    ],
    [
        -4059,
        [
            "ENODEV",
            "no such device"
        ]
    ],
    [
        -4058,
        [
            "ENOENT",
            "no such file or directory"
        ]
    ],
    [
        -4057,
        [
            "ENOMEM",
            "not enough memory"
        ]
    ],
    [
        -4056,
        [
            "ENONET",
            "machine is not on the network"
        ]
    ],
    [
        -4035,
        [
            "ENOPROTOOPT",
            "protocol not available"
        ]
    ],
    [
        -4055,
        [
            "ENOSPC",
            "no space left on device"
        ]
    ],
    [
        -4054,
        [
            "ENOSYS",
            "function not implemented"
        ]
    ],
    [
        -4053,
        [
            "ENOTCONN",
            "socket is not connected"
        ]
    ],
    [
        -4052,
        [
            "ENOTDIR",
            "not a directory"
        ]
    ],
    [
        -4051,
        [
            "ENOTEMPTY",
            "directory not empty"
        ]
    ],
    [
        -4050,
        [
            "ENOTSOCK",
            "socket operation on non-socket"
        ]
    ],
    [
        -4049,
        [
            "ENOTSUP",
            "operation not supported on socket"
        ]
    ],
    [
        -4048,
        [
            "EPERM",
            "operation not permitted"
        ]
    ],
    [
        -4047,
        [
            "EPIPE",
            "broken pipe"
        ]
    ],
    [
        -4046,
        [
            "EPROTO",
            "protocol error"
        ]
    ],
    [
        -4045,
        [
            "EPROTONOSUPPORT",
            "protocol not supported"
        ]
    ],
    [
        -4044,
        [
            "EPROTOTYPE",
            "protocol wrong type for socket"
        ]
    ],
    [
        -4034,
        [
            "ERANGE",
            "result too large"
        ]
    ],
    [
        -4043,
        [
            "EROFS",
            "read-only file system"
        ]
    ],
    [
        -4042,
        [
            "ESHUTDOWN",
            "cannot send after transport endpoint shutdown"
        ]
    ],
    [
        -4041,
        [
            "ESPIPE",
            "invalid seek"
        ]
    ],
    [
        -4040,
        [
            "ESRCH",
            "no such process"
        ]
    ],
    [
        -4039,
        [
            "ETIMEDOUT",
            "connection timed out"
        ]
    ],
    [
        -4038,
        [
            "ETXTBSY",
            "text file is busy"
        ]
    ],
    [
        -4037,
        [
            "EXDEV",
            "cross-device link not permitted"
        ]
    ],
    [
        -4094,
        [
            "UNKNOWN",
            "unknown error"
        ]
    ],
    [
        -4095,
        [
            "EOF",
            "end of file"
        ]
    ],
    [
        -4033,
        [
            "ENXIO",
            "no such device or address"
        ]
    ],
    [
        -4032,
        [
            "EMLINK",
            "too many links"
        ]
    ],
    [
        -4031,
        [
            "EHOSTDOWN",
            "host is down"
        ]
    ],
    [
        -4030,
        [
            "EREMOTEIO",
            "remote I/O error"
        ]
    ],
    [
        -4029,
        [
            "ENOTTY",
            "inappropriate ioctl for device"
        ]
    ],
    [
        -4028,
        [
            "EFTYPE",
            "inappropriate file type or format"
        ]
    ],
    [
        -4027,
        [
            "EILSEQ",
            "illegal byte sequence"
        ]
    ], 
];
const darwin = [
    [
        -7,
        [
            "E2BIG",
            "argument list too long"
        ]
    ],
    [
        -13,
        [
            "EACCES",
            "permission denied"
        ]
    ],
    [
        -48,
        [
            "EADDRINUSE",
            "address already in use"
        ]
    ],
    [
        -49,
        [
            "EADDRNOTAVAIL",
            "address not available"
        ]
    ],
    [
        -47,
        [
            "EAFNOSUPPORT",
            "address family not supported"
        ]
    ],
    [
        -35,
        [
            "EAGAIN",
            "resource temporarily unavailable"
        ]
    ],
    [
        -3000,
        [
            "EAI_ADDRFAMILY",
            "address family not supported"
        ]
    ],
    [
        -3001,
        [
            "EAI_AGAIN",
            "temporary failure"
        ]
    ],
    [
        -3002,
        [
            "EAI_BADFLAGS",
            "bad ai_flags value"
        ]
    ],
    [
        -3013,
        [
            "EAI_BADHINTS",
            "invalid value for hints"
        ]
    ],
    [
        -3003,
        [
            "EAI_CANCELED",
            "request canceled"
        ]
    ],
    [
        -3004,
        [
            "EAI_FAIL",
            "permanent failure"
        ]
    ],
    [
        -3005,
        [
            "EAI_FAMILY",
            "ai_family not supported"
        ]
    ],
    [
        -3006,
        [
            "EAI_MEMORY",
            "out of memory"
        ]
    ],
    [
        -3007,
        [
            "EAI_NODATA",
            "no address"
        ]
    ],
    [
        -3008,
        [
            "EAI_NONAME",
            "unknown node or service"
        ]
    ],
    [
        -3009,
        [
            "EAI_OVERFLOW",
            "argument buffer overflow"
        ]
    ],
    [
        -3014,
        [
            "EAI_PROTOCOL",
            "resolved protocol is unknown"
        ]
    ],
    [
        -3010,
        [
            "EAI_SERVICE",
            "service not available for socket type"
        ]
    ],
    [
        -3011,
        [
            "EAI_SOCKTYPE",
            "socket type not supported"
        ]
    ],
    [
        -37,
        [
            "EALREADY",
            "connection already in progress"
        ]
    ],
    [
        -9,
        [
            "EBADF",
            "bad file descriptor"
        ]
    ],
    [
        -16,
        [
            "EBUSY",
            "resource busy or locked"
        ]
    ],
    [
        -89,
        [
            "ECANCELED",
            "operation canceled"
        ]
    ],
    [
        -4080,
        [
            "ECHARSET",
            "invalid Unicode character"
        ]
    ],
    [
        -53,
        [
            "ECONNABORTED",
            "software caused connection abort"
        ]
    ],
    [
        -61,
        [
            "ECONNREFUSED",
            "connection refused"
        ]
    ],
    [
        -54,
        [
            "ECONNRESET",
            "connection reset by peer"
        ]
    ],
    [
        -39,
        [
            "EDESTADDRREQ",
            "destination address required"
        ]
    ],
    [
        -17,
        [
            "EEXIST",
            "file already exists"
        ]
    ],
    [
        -14,
        [
            "EFAULT",
            "bad address in system call argument"
        ]
    ],
    [
        -27,
        [
            "EFBIG",
            "file too large"
        ]
    ],
    [
        -65,
        [
            "EHOSTUNREACH",
            "host is unreachable"
        ]
    ],
    [
        -4,
        [
            "EINTR",
            "interrupted system call"
        ]
    ],
    [
        -22,
        [
            "EINVAL",
            "invalid argument"
        ]
    ],
    [
        -5,
        [
            "EIO",
            "i/o error"
        ]
    ],
    [
        -56,
        [
            "EISCONN",
            "socket is already connected"
        ]
    ],
    [
        -21,
        [
            "EISDIR",
            "illegal operation on a directory"
        ]
    ],
    [
        -62,
        [
            "ELOOP",
            "too many symbolic links encountered"
        ]
    ],
    [
        -24,
        [
            "EMFILE",
            "too many open files"
        ]
    ],
    [
        -40,
        [
            "EMSGSIZE",
            "message too long"
        ]
    ],
    [
        -63,
        [
            "ENAMETOOLONG",
            "name too long"
        ]
    ],
    [
        -50,
        [
            "ENETDOWN",
            "network is down"
        ]
    ],
    [
        -51,
        [
            "ENETUNREACH",
            "network is unreachable"
        ]
    ],
    [
        -23,
        [
            "ENFILE",
            "file table overflow"
        ]
    ],
    [
        -55,
        [
            "ENOBUFS",
            "no buffer space available"
        ]
    ],
    [
        -19,
        [
            "ENODEV",
            "no such device"
        ]
    ],
    [
        -2,
        [
            "ENOENT",
            "no such file or directory"
        ]
    ],
    [
        -12,
        [
            "ENOMEM",
            "not enough memory"
        ]
    ],
    [
        -4056,
        [
            "ENONET",
            "machine is not on the network"
        ]
    ],
    [
        -42,
        [
            "ENOPROTOOPT",
            "protocol not available"
        ]
    ],
    [
        -28,
        [
            "ENOSPC",
            "no space left on device"
        ]
    ],
    [
        -78,
        [
            "ENOSYS",
            "function not implemented"
        ]
    ],
    [
        -57,
        [
            "ENOTCONN",
            "socket is not connected"
        ]
    ],
    [
        -20,
        [
            "ENOTDIR",
            "not a directory"
        ]
    ],
    [
        -66,
        [
            "ENOTEMPTY",
            "directory not empty"
        ]
    ],
    [
        -38,
        [
            "ENOTSOCK",
            "socket operation on non-socket"
        ]
    ],
    [
        -45,
        [
            "ENOTSUP",
            "operation not supported on socket"
        ]
    ],
    [
        -1,
        [
            "EPERM",
            "operation not permitted"
        ]
    ],
    [
        -32,
        [
            "EPIPE",
            "broken pipe"
        ]
    ],
    [
        -100,
        [
            "EPROTO",
            "protocol error"
        ]
    ],
    [
        -43,
        [
            "EPROTONOSUPPORT",
            "protocol not supported"
        ]
    ],
    [
        -41,
        [
            "EPROTOTYPE",
            "protocol wrong type for socket"
        ]
    ],
    [
        -34,
        [
            "ERANGE",
            "result too large"
        ]
    ],
    [
        -30,
        [
            "EROFS",
            "read-only file system"
        ]
    ],
    [
        -58,
        [
            "ESHUTDOWN",
            "cannot send after transport endpoint shutdown"
        ]
    ],
    [
        -29,
        [
            "ESPIPE",
            "invalid seek"
        ]
    ],
    [
        -3,
        [
            "ESRCH",
            "no such process"
        ]
    ],
    [
        -60,
        [
            "ETIMEDOUT",
            "connection timed out"
        ]
    ],
    [
        -26,
        [
            "ETXTBSY",
            "text file is busy"
        ]
    ],
    [
        -18,
        [
            "EXDEV",
            "cross-device link not permitted"
        ]
    ],
    [
        -4094,
        [
            "UNKNOWN",
            "unknown error"
        ]
    ],
    [
        -4095,
        [
            "EOF",
            "end of file"
        ]
    ],
    [
        -6,
        [
            "ENXIO",
            "no such device or address"
        ]
    ],
    [
        -31,
        [
            "EMLINK",
            "too many links"
        ]
    ],
    [
        -64,
        [
            "EHOSTDOWN",
            "host is down"
        ]
    ],
    [
        -4030,
        [
            "EREMOTEIO",
            "remote I/O error"
        ]
    ],
    [
        -25,
        [
            "ENOTTY",
            "inappropriate ioctl for device"
        ]
    ],
    [
        -79,
        [
            "EFTYPE",
            "inappropriate file type or format"
        ]
    ],
    [
        -92,
        [
            "EILSEQ",
            "illegal byte sequence"
        ]
    ], 
];
const linux = [
    [
        -7,
        [
            "E2BIG",
            "argument list too long"
        ]
    ],
    [
        -13,
        [
            "EACCES",
            "permission denied"
        ]
    ],
    [
        -98,
        [
            "EADDRINUSE",
            "address already in use"
        ]
    ],
    [
        -99,
        [
            "EADDRNOTAVAIL",
            "address not available"
        ]
    ],
    [
        -97,
        [
            "EAFNOSUPPORT",
            "address family not supported"
        ]
    ],
    [
        -11,
        [
            "EAGAIN",
            "resource temporarily unavailable"
        ]
    ],
    [
        -3000,
        [
            "EAI_ADDRFAMILY",
            "address family not supported"
        ]
    ],
    [
        -3001,
        [
            "EAI_AGAIN",
            "temporary failure"
        ]
    ],
    [
        -3002,
        [
            "EAI_BADFLAGS",
            "bad ai_flags value"
        ]
    ],
    [
        -3013,
        [
            "EAI_BADHINTS",
            "invalid value for hints"
        ]
    ],
    [
        -3003,
        [
            "EAI_CANCELED",
            "request canceled"
        ]
    ],
    [
        -3004,
        [
            "EAI_FAIL",
            "permanent failure"
        ]
    ],
    [
        -3005,
        [
            "EAI_FAMILY",
            "ai_family not supported"
        ]
    ],
    [
        -3006,
        [
            "EAI_MEMORY",
            "out of memory"
        ]
    ],
    [
        -3007,
        [
            "EAI_NODATA",
            "no address"
        ]
    ],
    [
        -3008,
        [
            "EAI_NONAME",
            "unknown node or service"
        ]
    ],
    [
        -3009,
        [
            "EAI_OVERFLOW",
            "argument buffer overflow"
        ]
    ],
    [
        -3014,
        [
            "EAI_PROTOCOL",
            "resolved protocol is unknown"
        ]
    ],
    [
        -3010,
        [
            "EAI_SERVICE",
            "service not available for socket type"
        ]
    ],
    [
        -3011,
        [
            "EAI_SOCKTYPE",
            "socket type not supported"
        ]
    ],
    [
        -114,
        [
            "EALREADY",
            "connection already in progress"
        ]
    ],
    [
        -9,
        [
            "EBADF",
            "bad file descriptor"
        ]
    ],
    [
        -16,
        [
            "EBUSY",
            "resource busy or locked"
        ]
    ],
    [
        -125,
        [
            "ECANCELED",
            "operation canceled"
        ]
    ],
    [
        -4080,
        [
            "ECHARSET",
            "invalid Unicode character"
        ]
    ],
    [
        -103,
        [
            "ECONNABORTED",
            "software caused connection abort"
        ]
    ],
    [
        -111,
        [
            "ECONNREFUSED",
            "connection refused"
        ]
    ],
    [
        -104,
        [
            "ECONNRESET",
            "connection reset by peer"
        ]
    ],
    [
        -89,
        [
            "EDESTADDRREQ",
            "destination address required"
        ]
    ],
    [
        -17,
        [
            "EEXIST",
            "file already exists"
        ]
    ],
    [
        -14,
        [
            "EFAULT",
            "bad address in system call argument"
        ]
    ],
    [
        -27,
        [
            "EFBIG",
            "file too large"
        ]
    ],
    [
        -113,
        [
            "EHOSTUNREACH",
            "host is unreachable"
        ]
    ],
    [
        -4,
        [
            "EINTR",
            "interrupted system call"
        ]
    ],
    [
        -22,
        [
            "EINVAL",
            "invalid argument"
        ]
    ],
    [
        -5,
        [
            "EIO",
            "i/o error"
        ]
    ],
    [
        -106,
        [
            "EISCONN",
            "socket is already connected"
        ]
    ],
    [
        -21,
        [
            "EISDIR",
            "illegal operation on a directory"
        ]
    ],
    [
        -40,
        [
            "ELOOP",
            "too many symbolic links encountered"
        ]
    ],
    [
        -24,
        [
            "EMFILE",
            "too many open files"
        ]
    ],
    [
        -90,
        [
            "EMSGSIZE",
            "message too long"
        ]
    ],
    [
        -36,
        [
            "ENAMETOOLONG",
            "name too long"
        ]
    ],
    [
        -100,
        [
            "ENETDOWN",
            "network is down"
        ]
    ],
    [
        -101,
        [
            "ENETUNREACH",
            "network is unreachable"
        ]
    ],
    [
        -23,
        [
            "ENFILE",
            "file table overflow"
        ]
    ],
    [
        -105,
        [
            "ENOBUFS",
            "no buffer space available"
        ]
    ],
    [
        -19,
        [
            "ENODEV",
            "no such device"
        ]
    ],
    [
        -2,
        [
            "ENOENT",
            "no such file or directory"
        ]
    ],
    [
        -12,
        [
            "ENOMEM",
            "not enough memory"
        ]
    ],
    [
        -64,
        [
            "ENONET",
            "machine is not on the network"
        ]
    ],
    [
        -92,
        [
            "ENOPROTOOPT",
            "protocol not available"
        ]
    ],
    [
        -28,
        [
            "ENOSPC",
            "no space left on device"
        ]
    ],
    [
        -38,
        [
            "ENOSYS",
            "function not implemented"
        ]
    ],
    [
        -107,
        [
            "ENOTCONN",
            "socket is not connected"
        ]
    ],
    [
        -20,
        [
            "ENOTDIR",
            "not a directory"
        ]
    ],
    [
        -39,
        [
            "ENOTEMPTY",
            "directory not empty"
        ]
    ],
    [
        -88,
        [
            "ENOTSOCK",
            "socket operation on non-socket"
        ]
    ],
    [
        -95,
        [
            "ENOTSUP",
            "operation not supported on socket"
        ]
    ],
    [
        -1,
        [
            "EPERM",
            "operation not permitted"
        ]
    ],
    [
        -32,
        [
            "EPIPE",
            "broken pipe"
        ]
    ],
    [
        -71,
        [
            "EPROTO",
            "protocol error"
        ]
    ],
    [
        -93,
        [
            "EPROTONOSUPPORT",
            "protocol not supported"
        ]
    ],
    [
        -91,
        [
            "EPROTOTYPE",
            "protocol wrong type for socket"
        ]
    ],
    [
        -34,
        [
            "ERANGE",
            "result too large"
        ]
    ],
    [
        -30,
        [
            "EROFS",
            "read-only file system"
        ]
    ],
    [
        -108,
        [
            "ESHUTDOWN",
            "cannot send after transport endpoint shutdown"
        ]
    ],
    [
        -29,
        [
            "ESPIPE",
            "invalid seek"
        ]
    ],
    [
        -3,
        [
            "ESRCH",
            "no such process"
        ]
    ],
    [
        -110,
        [
            "ETIMEDOUT",
            "connection timed out"
        ]
    ],
    [
        -26,
        [
            "ETXTBSY",
            "text file is busy"
        ]
    ],
    [
        -18,
        [
            "EXDEV",
            "cross-device link not permitted"
        ]
    ],
    [
        -4094,
        [
            "UNKNOWN",
            "unknown error"
        ]
    ],
    [
        -4095,
        [
            "EOF",
            "end of file"
        ]
    ],
    [
        -6,
        [
            "ENXIO",
            "no such device or address"
        ]
    ],
    [
        -31,
        [
            "EMLINK",
            "too many links"
        ]
    ],
    [
        -112,
        [
            "EHOSTDOWN",
            "host is down"
        ]
    ],
    [
        -121,
        [
            "EREMOTEIO",
            "remote I/O error"
        ]
    ],
    [
        -25,
        [
            "ENOTTY",
            "inappropriate ioctl for device"
        ]
    ],
    [
        -4028,
        [
            "EFTYPE",
            "inappropriate file type or format"
        ]
    ],
    [
        -84,
        [
            "EILSEQ",
            "illegal byte sequence"
        ]
    ], 
];
new Map(osType === "windows" ? windows : osType === "darwin" ? darwin : osType === "linux" ? linux : unreachable());
const notImplementedEncodings = [
    "ascii",
    "binary",
    "latin1",
    "ucs2",
    "utf16le", 
];
function checkEncoding(encoding = "utf8", strict = true) {
    if (typeof encoding !== "string" || strict && encoding === "") {
        if (!strict) return "utf8";
        throw new TypeError(`Unknown encoding: ${encoding}`);
    }
    const normalized = normalizeEncoding(encoding);
    if (normalized === undefined) {
        throw new TypeError(`Unknown encoding: ${encoding}`);
    }
    if (notImplementedEncodings.includes(encoding)) {
        notImplemented(`"${encoding}" encoding`);
    }
    return normalized;
}
const encodingOps = {
    utf8: {
        byteLength: (string)=>new TextEncoder().encode(string).byteLength
    },
    ucs2: {
        byteLength: (string)=>string.length * 2
    },
    utf16le: {
        byteLength: (string)=>string.length * 2
    },
    latin1: {
        byteLength: (string)=>string.length
    },
    ascii: {
        byteLength: (string)=>string.length
    },
    base64: {
        byteLength: (string)=>base64ByteLength(string, string.length)
    },
    hex: {
        byteLength: (string)=>string.length >>> 1
    }
};
function base64ByteLength(str, bytes) {
    if (str.charCodeAt(bytes - 1) === 61) bytes--;
    if (bytes > 1 && str.charCodeAt(bytes - 1) === 61) bytes--;
    return bytes * 3 >>> 2;
}
class Buffer extends Uint8Array {
    static alloc(size, fill, encoding = "utf8") {
        if (typeof size !== "number") {
            throw new TypeError(`The "size" argument must be of type number. Received type ${typeof size}`);
        }
        const buf = new Buffer(size);
        if (size === 0) return buf;
        let bufFill;
        if (typeof fill === "string") {
            const clearEncoding = checkEncoding(encoding);
            if (typeof fill === "string" && fill.length === 1 && clearEncoding === "utf8") {
                buf.fill(fill.charCodeAt(0));
            } else bufFill = Buffer.from(fill, clearEncoding);
        } else if (typeof fill === "number") {
            buf.fill(fill);
        } else if (fill instanceof Uint8Array) {
            if (fill.length === 0) {
                throw new TypeError(`The argument "value" is invalid. Received ${fill.constructor.name} []`);
            }
            bufFill = fill;
        }
        if (bufFill) {
            if (bufFill.length > buf.length) {
                bufFill = bufFill.subarray(0, buf.length);
            }
            let offset = 0;
            while(offset < size){
                buf.set(bufFill, offset);
                offset += bufFill.length;
                if (offset + bufFill.length >= size) break;
            }
            if (offset !== size) {
                buf.set(bufFill.subarray(0, size - offset), offset);
            }
        }
        return buf;
    }
    static allocUnsafe(size) {
        return new Buffer(size);
    }
    static byteLength(string, encoding = "utf8") {
        if (typeof string != "string") return string.byteLength;
        encoding = normalizeEncoding(encoding) || "utf8";
        return encodingOps[encoding].byteLength(string);
    }
    static concat(list, totalLength) {
        if (totalLength == undefined) {
            totalLength = 0;
            for (const buf of list){
                totalLength += buf.length;
            }
        }
        const buffer = Buffer.allocUnsafe(totalLength);
        let pos = 0;
        for (const item of list){
            let buf;
            if (!(item instanceof Buffer)) {
                buf = Buffer.from(item);
            } else {
                buf = item;
            }
            buf.copy(buffer, pos);
            pos += buf.length;
        }
        return buffer;
    }
    static from(value, offsetOrEncoding, length) {
        const offset = typeof offsetOrEncoding === "string" ? undefined : offsetOrEncoding;
        let encoding = typeof offsetOrEncoding === "string" ? offsetOrEncoding : undefined;
        if (typeof value == "string") {
            encoding = checkEncoding(encoding, false);
            if (encoding === "hex") {
                return new Buffer(decode(new TextEncoder().encode(value)).buffer);
            }
            if (encoding === "base64") return new Buffer(decode1(value).buffer);
            return new Buffer(new TextEncoder().encode(value).buffer);
        }
        return new Buffer(value, offset, length);
    }
    static isBuffer(obj) {
        return obj instanceof Buffer;
    }
    static isEncoding(encoding) {
        return typeof encoding === "string" && encoding.length !== 0 && normalizeEncoding(encoding) !== undefined;
    }
    boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
            throw new ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) throw new ERR_BUFFER_OUT_OF_BOUNDS();
        throw new ERR_OUT_OF_RANGE(type || "offset", `>= ${type ? 1 : 0} and <= ${length}`, value);
    }
    readUIntBE(offset = 0, byteLength) {
        if (byteLength === 3 || byteLength === 5 || byteLength === 6) {
            notImplemented(`byteLength ${byteLength}`);
        }
        if (byteLength === 4) return this.readUInt32BE(offset);
        if (byteLength === 2) return this.readUInt16BE(offset);
        if (byteLength === 1) return this.readUInt8(offset);
        this.boundsError(byteLength, 4, "byteLength");
    }
    readUIntLE(offset = 0, byteLength) {
        if (byteLength === 3 || byteLength === 5 || byteLength === 6) {
            notImplemented(`byteLength ${byteLength}`);
        }
        if (byteLength === 4) return this.readUInt32LE(offset);
        if (byteLength === 2) return this.readUInt16LE(offset);
        if (byteLength === 1) return this.readUInt8(offset);
        this.boundsError(byteLength, 4, "byteLength");
    }
    copy(targetBuffer, targetStart = 0, sourceStart = 0, sourceEnd = this.length) {
        const sourceBuffer = this.subarray(sourceStart, sourceEnd).subarray(0, Math.max(0, targetBuffer.length - targetStart));
        if (sourceBuffer.length === 0) return 0;
        targetBuffer.set(sourceBuffer, targetStart);
        return sourceBuffer.length;
    }
    equals(otherBuffer) {
        if (!(otherBuffer instanceof Uint8Array)) {
            throw new TypeError(`The "otherBuffer" argument must be an instance of Buffer or Uint8Array. Received type ${typeof otherBuffer}`);
        }
        if (this === otherBuffer) return true;
        if (this.byteLength !== otherBuffer.byteLength) return false;
        for(let i = 0; i < this.length; i++){
            if (this[i] !== otherBuffer[i]) return false;
        }
        return true;
    }
    readBigInt64BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigInt64(offset);
    }
    readBigInt64LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigInt64(offset, true);
    }
    readBigUInt64BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigUint64(offset);
    }
    readBigUInt64LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigUint64(offset, true);
    }
    readDoubleBE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat64(offset);
    }
    readDoubleLE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat64(offset, true);
    }
    readFloatBE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat32(offset);
    }
    readFloatLE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat32(offset, true);
    }
    readInt8(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt8(offset);
    }
    readInt16BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt16(offset);
    }
    readInt16LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt16(offset, true);
    }
    readInt32BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt32(offset);
    }
    readInt32LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt32(offset, true);
    }
    readUInt8(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint8(offset);
    }
    readUInt16BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint16(offset);
    }
    readUInt16LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint16(offset, true);
    }
    readUInt32BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint32(offset);
    }
    readUInt32LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint32(offset, true);
    }
    slice(begin = 0, end = this.length) {
        return this.subarray(begin, end);
    }
    toJSON() {
        return {
            type: "Buffer",
            data: Array.from(this)
        };
    }
    toString(encoding = "utf8", start = 0, end = this.length) {
        encoding = checkEncoding(encoding);
        const b = this.subarray(start, end);
        if (encoding === "hex") return new TextDecoder().decode(encode(b));
        if (encoding === "base64") return encode1(b);
        return new TextDecoder(encoding).decode(b);
    }
    write(string, offset = 0, length = this.length) {
        return new TextEncoder().encodeInto(string, this.subarray(offset, offset + length)).written;
    }
    writeBigInt64BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigInt64(offset, value);
        return offset + 4;
    }
    writeBigInt64LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigInt64(offset, value, true);
        return offset + 4;
    }
    writeBigUInt64BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigUint64(offset, value);
        return offset + 4;
    }
    writeBigUInt64LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigUint64(offset, value, true);
        return offset + 4;
    }
    writeDoubleBE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat64(offset, value);
        return offset + 8;
    }
    writeDoubleLE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat64(offset, value, true);
        return offset + 8;
    }
    writeFloatBE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat32(offset, value);
        return offset + 4;
    }
    writeFloatLE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat32(offset, value, true);
        return offset + 4;
    }
    writeInt8(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt8(offset, value);
        return offset + 1;
    }
    writeInt16BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt16(offset, value);
        return offset + 2;
    }
    writeInt16LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt16(offset, value, true);
        return offset + 2;
    }
    writeInt32BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value);
        return offset + 4;
    }
    writeInt32LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt32(offset, value, true);
        return offset + 4;
    }
    writeUInt8(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint8(offset, value);
        return offset + 1;
    }
    writeUInt16BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint16(offset, value);
        return offset + 2;
    }
    writeUInt16LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint16(offset, value, true);
        return offset + 2;
    }
    writeUInt32BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value);
        return offset + 4;
    }
    writeUInt32LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value, true);
        return offset + 4;
    }
}
globalThis.atob;
globalThis.btoa;
"use strict";
const ip = {
};
ip.toBuffer = function(ip, buff, offset) {
    offset = ~~offset;
    var result;
    if (this.isV4Format(ip)) {
        result = buff || new Buffer(offset + 4);
        ip.split(/\./g).map(function(__byte) {
            result[offset++] = parseInt(__byte, 10) & 255;
        });
    } else if (this.isV6Format(ip)) {
        var sections = ip.split(":", 8);
        var i;
        for(i = 0; i < sections.length; i++){
            var isv4 = this.isV4Format(sections[i]);
            var v4Buffer;
            if (isv4) {
                v4Buffer = this.toBuffer(sections[i]);
                sections[i] = v4Buffer.slice(0, 2).toString("hex");
            }
            if (v4Buffer && ++i < 8) {
                sections.splice(i, 0, v4Buffer.slice(2, 4).toString("hex"));
            }
        }
        if (sections[0] === "") {
            while(sections.length < 8)sections.unshift("0");
        } else if (sections[sections.length - 1] === "") {
            while(sections.length < 8)sections.push("0");
        } else if (sections.length < 8) {
            for(i = 0; i < sections.length && sections[i] !== ""; i++);
            var argv = [
                i,
                1
            ];
            for(i = 9 - sections.length; i > 0; i--){
                argv.push("0");
            }
            sections.splice.apply(sections, argv);
        }
        result = buff || new Buffer(offset + 16);
        for(i = 0; i < sections.length; i++){
            var word = parseInt(sections[i], 16);
            result[offset++] = word >> 8 & 255;
            result[offset++] = word & 255;
        }
    }
    if (!result) {
        throw Error("Invalid ip address: " + ip);
    }
    return result;
};
ip.toString = function(buff, offset, length) {
    offset = ~~offset;
    length = length || buff.length - offset;
    var result = [];
    if (length === 4) {
        for(var i = 0; i < length; i++){
            result.push(buff[offset + i]);
        }
        result = result.join(".");
    } else if (length === 16) {
        for(var i = 0; i < length; i += 2){
            result.push(buff.readUInt16BE(offset + i).toString(16));
        }
        result = result.join(":");
        result = result.replace(/(^|:)0(:0)*:0(:|$)/, "$1::$3");
        result = result.replace(/:{3,4}/, "::");
    }
    return result;
};
var ipv4Regex = /^(\d{1,3}\.){3,3}\d{1,3}$/;
var ipv6Regex = /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;
ip.isV4Format = function(ip) {
    return ipv4Regex.test(ip);
};
ip.isV6Format = function(ip) {
    return ipv6Regex.test(ip);
};
function _normalizeFamily(family) {
    return family ? family.toLowerCase() : "ipv4";
}
ip.fromPrefixLen = function(prefixlen, family) {
    if (prefixlen > 32) {
        family = "ipv6";
    } else {
        family = _normalizeFamily(family);
    }
    var len = 4;
    if (family === "ipv6") {
        len = 16;
    }
    var buff = new Buffer(len);
    for(var i = 0, n = buff.length; i < n; ++i){
        var bits = 8;
        if (prefixlen < 8) {
            bits = prefixlen;
        }
        prefixlen -= bits;
        buff[i] = ~(255 >> bits) & 255;
    }
    return ip.toString(buff);
};
ip.mask = function(addr, mask) {
    addr = ip.toBuffer(addr);
    mask = ip.toBuffer(mask);
    var result = new Buffer(Math.max(addr.length, mask.length));
    var i = 0;
    if (addr.length === mask.length) {
        for(i = 0; i < addr.length; i++){
            result[i] = addr[i] & mask[i];
        }
    } else if (mask.length === 4) {
        for(i = 0; i < mask.length; i++){
            result[i] = addr[addr.length - 4 + i] & mask[i];
        }
    } else {
        for(var i = 0; i < result.length - 6; i++){
            result[i] = 0;
        }
        result[10] = 255;
        result[11] = 255;
        for(i = 0; i < addr.length; i++){
            result[i + 12] = addr[i] & mask[i + 12];
        }
        i = i + 12;
    }
    for(; i < result.length; i++){
        result[i] = 0;
    }
    return ip.toString(result);
};
ip.cidr = function(cidrString) {
    var cidrParts = cidrString.split("/");
    var addr = cidrParts[0];
    if (cidrParts.length !== 2) {
        throw new Error("invalid CIDR subnet: " + addr);
    }
    var mask = ip.fromPrefixLen(parseInt(cidrParts[1], 10));
    return ip.mask(addr, mask);
};
ip.subnet = function(addr, mask) {
    var networkAddress = ip.toLong(ip.mask(addr, mask));
    var maskBuffer = ip.toBuffer(mask);
    var maskLength = 0;
    for(var i = 0; i < maskBuffer.length; i++){
        if (maskBuffer[i] === 255) {
            maskLength += 8;
        } else {
            var octet = maskBuffer[i] & 255;
            while(octet){
                octet = octet << 1 & 255;
                maskLength++;
            }
        }
    }
    var numberOfAddresses = Math.pow(2, 32 - maskLength);
    return {
        networkAddress: ip.fromLong(networkAddress),
        firstAddress: numberOfAddresses <= 2 ? ip.fromLong(networkAddress) : ip.fromLong(networkAddress + 1),
        lastAddress: numberOfAddresses <= 2 ? ip.fromLong(networkAddress + numberOfAddresses - 1) : ip.fromLong(networkAddress + numberOfAddresses - 2),
        broadcastAddress: ip.fromLong(networkAddress + numberOfAddresses - 1),
        subnetMask: mask,
        subnetMaskLength: maskLength,
        numHosts: numberOfAddresses <= 2 ? numberOfAddresses : numberOfAddresses - 2,
        length: numberOfAddresses,
        contains: function(other) {
            return networkAddress === ip.toLong(ip.mask(other, mask));
        }
    };
};
ip.cidrSubnet = function(cidrString) {
    var cidrParts = cidrString.split("/");
    var addr = cidrParts[0];
    if (cidrParts.length !== 2) {
        throw new Error("invalid CIDR subnet: " + addr);
    }
    var mask = ip.fromPrefixLen(parseInt(cidrParts[1], 10));
    return ip.subnet(addr, mask);
};
ip.not = function(addr) {
    var buff = ip.toBuffer(addr);
    for(var i = 0; i < buff.length; i++){
        buff[i] = 255 ^ buff[i];
    }
    return ip.toString(buff);
};
ip.or = function(a, b) {
    a = ip.toBuffer(a);
    b = ip.toBuffer(b);
    if (a.length === b.length) {
        for(var i = 0; i < a.length; ++i){
            a[i] |= b[i];
        }
        return ip.toString(a);
    } else {
        var buff = a;
        var other = b;
        if (b.length > a.length) {
            buff = b;
            other = a;
        }
        var offset = buff.length - other.length;
        for(var i = offset; i < buff.length; ++i){
            buff[i] |= other[i - offset];
        }
        return ip.toString(buff);
    }
};
ip.isEqual = function(a, b) {
    a = ip.toBuffer(a);
    b = ip.toBuffer(b);
    if (a.length === b.length) {
        for(var i = 0; i < a.length; i++){
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
    if (b.length === 4) {
        var t = b;
        b = a;
        a = t;
    }
    for(var i = 0; i < 10; i++){
        if (b[i] !== 0) return false;
    }
    var word = b.readUInt16BE(10);
    if (word !== 0 && word !== 65535) return false;
    for(var i = 0; i < 4; i++){
        if (a[i] !== b[i + 12]) return false;
    }
    return true;
};
ip.isPrivate = function(addr) {
    return /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^f[cd][0-9a-f]{2}:/i.test(addr) || /^fe80:/i.test(addr) || /^::1$/.test(addr) || /^::$/.test(addr);
};
ip.isPublic = function(addr) {
    return !ip.isPrivate(addr);
};
ip.isLoopback = function(addr) {
    return /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/.test(addr) || /^fe80::1$/.test(addr) || /^::1$/.test(addr) || /^::$/.test(addr);
};
ip.loopback = function(family) {
    family = _normalizeFamily(family);
    if (family !== "ipv4" && family !== "ipv6") {
        throw new Error("family must be ipv4 or ipv6");
    }
    return family === "ipv4" ? "127.0.0.1" : "fe80::1";
};
ip.toLong = function(ip) {
    var ipl = 0;
    ip.split(".").forEach(function(octet) {
        ipl <<= 8;
        ipl += parseInt(octet);
    });
    return ipl >>> 0;
};
ip.fromLong = function(ipl) {
    return (ipl >>> 24) + "." + (ipl >> 16 & 255) + "." + (ipl >> 8 & 255) + "." + (ipl & 255);
};
"use strict";
const QUERY_FLAG = 0;
const RESPONSE_FLAG = 1 << 15;
const FLUSH_MASK = 1 << 15;
const NOT_FLUSH_MASK = ~FLUSH_MASK;
const QU_MASK = 1 << 15;
const NOT_QU_MASK = ~QU_MASK;
const name1 = {
};
name1.encode = function(str, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(name1.encodingLength(str));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const n = str.replace(/^\.|\.$/gm, "");
    if (n.length) {
        const list = n.split(".");
        for(let i = 0; i < list.length; i++){
            const len = buf.write(list[i], offset + 1);
            buf[offset] = len;
            offset += len + 1;
        }
    }
    buf[offset++] = 0;
    name1.encode.bytes = offset - oldOffset;
    return buf;
};
name1.encode.bytes = 0;
name1.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const list = [];
    const oldOffset = offset;
    let len = buf[offset++];
    if (len === 0) {
        name1.decode.bytes = 1;
        return ".";
    }
    if (len >= 192) {
        const res = name1.decode(buf, buf.readUInt16BE(offset - 1) - 49152);
        name1.decode.bytes = 2;
        return res;
    }
    while(len){
        if (len >= 192) {
            list.push(name1.decode(buf, buf.readUInt16BE(offset - 1) - 49152));
            offset++;
            break;
        }
        list.push(buf.toString("utf-8", offset, offset + len));
        offset += len;
        len = buf[offset++];
    }
    name1.decode.bytes = offset - oldOffset;
    return list.join(".");
};
name1.decode.bytes = 0;
name1.encodingLength = function(n) {
    if (n === ".") return 1;
    return Buffer.byteLength(n) + 2;
};
const string1 = {
};
string1.encode = function(s, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(string1.encodingLength(s));
    if (!offset) offset = 0;
    const len = buf.write(s, offset + 1);
    buf[offset] = len;
    string1.encode.bytes = len + 1;
    return buf;
};
string1.encode.bytes = 0;
string1.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const len = buf[offset];
    const s = buf.toString("utf-8", offset + 1, offset + 1 + len);
    string1.decode.bytes = len + 1;
    return s;
};
string1.decode.bytes = 0;
string1.encodingLength = function(s) {
    return Buffer.byteLength(s) + 1;
};
const header = {
};
header.encode = function(h, buf, offset) {
    if (!buf) buf = header.encodingLength(h);
    if (!offset) offset = 0;
    const flags = (h.flags || 0) & 32767;
    const type = h.type === "response" ? RESPONSE_FLAG : QUERY_FLAG;
    buf.writeUInt16BE(h.id || 0, offset);
    buf.writeUInt16BE(flags | type, offset + 2);
    buf.writeUInt16BE(h.questions.length, offset + 4);
    buf.writeUInt16BE(h.answers.length, offset + 6);
    buf.writeUInt16BE(h.authorities.length, offset + 8);
    buf.writeUInt16BE(h.additionals.length, offset + 10);
    return buf;
};
header.encode.bytes = 12;
header.decode = function(buf, offset) {
    if (!offset) offset = 0;
    if (buf.length < 12) throw new Error("Header must be 12 bytes");
    const flags = buf.readUInt16BE(offset + 2);
    return {
        id: buf.readUInt16BE(offset),
        type: flags & RESPONSE_FLAG ? "response" : "query",
        flags: flags & 32767,
        flag_qr: (flags >> 15 & 1) === 1,
        opcode: toString2(flags >> 11 & 15),
        flag_aa: (flags >> 10 & 1) === 1,
        flag_tc: (flags >> 9 & 1) === 1,
        flag_rd: (flags >> 8 & 1) === 1,
        flag_ra: (flags >> 7 & 1) === 1,
        flag_z: (flags >> 6 & 1) === 1,
        flag_ad: (flags >> 5 & 1) === 1,
        flag_cd: (flags >> 4 & 1) === 1,
        rcode: toString1(flags & 15),
        questions: new Array(buf.readUInt16BE(offset + 4)),
        answers: new Array(buf.readUInt16BE(offset + 6)),
        authorities: new Array(buf.readUInt16BE(offset + 8)),
        additionals: new Array(buf.readUInt16BE(offset + 10))
    };
};
header.decode.bytes = 12;
header.encodingLength = function() {
    return 12;
};
const runknown = {
};
runknown.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(runknown.encodingLength(data));
    if (!offset) offset = 0;
    buf.writeUInt16BE(data.length, offset);
    data.copy(buf, offset + 2);
    runknown.encode.bytes = data.length + 2;
    return buf;
};
runknown.encode.bytes = 0;
runknown.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const len = buf.readUInt16BE(offset);
    const data = buf.slice(offset + 2, offset + 2 + len);
    runknown.decode.bytes = len + 2;
    return data;
};
runknown.decode.bytes = 0;
runknown.encodingLength = function(data) {
    return data.length + 2;
};
const rns = {
};
rns.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rns.encodingLength(data));
    if (!offset) offset = 0;
    name1.encode(data, buf, offset + 2);
    buf.writeUInt16BE(name1.encode.bytes, offset);
    rns.encode.bytes = name1.encode.bytes + 2;
    return buf;
};
rns.encode.bytes = 0;
rns.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const len = buf.readUInt16BE(offset);
    const dd = name1.decode(buf, offset + 2);
    rns.decode.bytes = len + 2;
    return dd;
};
rns.decode.bytes = 0;
rns.encodingLength = function(data) {
    return name1.encodingLength(data) + 2;
};
const rsoa = {
};
rsoa.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rsoa.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    name1.encode(data.mname, buf, offset);
    offset += name1.encode.bytes;
    name1.encode(data.rname, buf, offset);
    offset += name1.encode.bytes;
    buf.writeUInt32BE(data.serial || 0, offset);
    offset += 4;
    buf.writeUInt32BE(data.refresh || 0, offset);
    offset += 4;
    buf.writeUInt32BE(data.retry || 0, offset);
    offset += 4;
    buf.writeUInt32BE(data.expire || 0, offset);
    offset += 4;
    buf.writeUInt32BE(data.minimum || 0, offset);
    offset += 4;
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    rsoa.encode.bytes = offset - oldOffset;
    return buf;
};
rsoa.encode.bytes = 0;
rsoa.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const data = {
    };
    offset += 2;
    data.mname = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    data.rname = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    data.serial = buf.readUInt32BE(offset);
    offset += 4;
    data.refresh = buf.readUInt32BE(offset);
    offset += 4;
    data.retry = buf.readUInt32BE(offset);
    offset += 4;
    data.expire = buf.readUInt32BE(offset);
    offset += 4;
    data.minimum = buf.readUInt32BE(offset);
    offset += 4;
    rsoa.decode.bytes = offset - oldOffset;
    return data;
};
rsoa.decode.bytes = 0;
rsoa.encodingLength = function(data) {
    return 22 + name1.encodingLength(data.mname) + name1.encodingLength(data.rname);
};
const rtxt = {
};
rtxt.encode = function(data, buf, offset) {
    if (!Array.isArray(data)) data = [
        data
    ];
    for(let i = 0; i < data.length; i++){
        if (typeof data[i] === "string") {
            data[i] = Buffer.from(data[i]);
        }
        if (!Buffer.isBuffer(data[i])) {
            throw new Error("Must be a Buffer");
        }
    }
    if (!buf) buf = Buffer.allocUnsafe(rtxt.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    data.forEach(function(d) {
        buf[offset++] = d.length;
        d.copy(buf, offset, 0, d.length);
        offset += d.length;
    });
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    rtxt.encode.bytes = offset - oldOffset;
    return buf;
};
rtxt.encode.bytes = 0;
rtxt.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    let remaining = buf.readUInt16BE(offset);
    offset += 2;
    let data = [];
    while(remaining > 0){
        const len = buf[offset++];
        --remaining;
        if (remaining < len) {
            throw new Error("Buffer overflow");
        }
        data.push(buf.slice(offset, offset + len));
        offset += len;
        remaining -= len;
    }
    rtxt.decode.bytes = offset - oldOffset;
    return data;
};
rtxt.decode.bytes = 0;
rtxt.encodingLength = function(data) {
    if (!Array.isArray(data)) data = [
        data
    ];
    let length = 2;
    data.forEach(function(buf) {
        if (typeof buf === "string") {
            length += Buffer.byteLength(buf) + 1;
        } else {
            length += buf.length + 1;
        }
    });
    return length;
};
const rnull = {
};
rnull.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rnull.encodingLength(data));
    if (!offset) offset = 0;
    if (typeof data === "string") data = Buffer.from(data);
    if (!data) data = Buffer.allocUnsafe(0);
    const oldOffset = offset;
    offset += 2;
    const len = data.length;
    data.copy(buf, offset, 0, len);
    offset += len;
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    rnull.encode.bytes = offset - oldOffset;
    return buf;
};
rnull.encode.bytes = 0;
rnull.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const len = buf.readUInt16BE(offset);
    offset += 2;
    const data = buf.slice(offset, offset + len);
    offset += len;
    rnull.decode.bytes = offset - oldOffset;
    return data;
};
rnull.decode.bytes = 0;
rnull.encodingLength = function(data) {
    if (!data) return 2;
    return (Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data)) + 2;
};
const rhinfo = {
};
rhinfo.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rhinfo.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    string1.encode(data.cpu, buf, offset);
    offset += string1.encode.bytes;
    string1.encode(data.os, buf, offset);
    offset += string1.encode.bytes;
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    rhinfo.encode.bytes = offset - oldOffset;
    return buf;
};
rhinfo.encode.bytes = 0;
rhinfo.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const data = {
    };
    offset += 2;
    data.cpu = string1.decode(buf, offset);
    offset += string1.decode.bytes;
    data.os = string1.decode(buf, offset);
    offset += string1.decode.bytes;
    rhinfo.decode.bytes = offset - oldOffset;
    return data;
};
rhinfo.decode.bytes = 0;
rhinfo.encodingLength = function(data) {
    return string1.encodingLength(data.cpu) + string1.encodingLength(data.os) + 2;
};
const rptr = {
};
const rcname = rptr;
const rdname = rptr;
rptr.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rptr.encodingLength(data));
    if (!offset) offset = 0;
    name1.encode(data, buf, offset + 2);
    buf.writeUInt16BE(name1.encode.bytes, offset);
    rptr.encode.bytes = name1.encode.bytes + 2;
    return buf;
};
rptr.encode.bytes = 0;
rptr.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const data = name1.decode(buf, offset + 2);
    rptr.decode.bytes = name1.decode.bytes + 2;
    return data;
};
rptr.decode.bytes = 0;
rptr.encodingLength = function(data) {
    return name1.encodingLength(data) + 2;
};
const rsrv = {
};
rsrv.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rsrv.encodingLength(data));
    if (!offset) offset = 0;
    buf.writeUInt16BE(data.priority || 0, offset + 2);
    buf.writeUInt16BE(data.weight || 0, offset + 4);
    buf.writeUInt16BE(data.port || 0, offset + 6);
    name1.encode(data.target, buf, offset + 8);
    const len = name1.encode.bytes + 6;
    buf.writeUInt16BE(len, offset);
    rsrv.encode.bytes = len + 2;
    return buf;
};
rsrv.encode.bytes = 0;
rsrv.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const len = buf.readUInt16BE(offset);
    const data = {
    };
    data.priority = buf.readUInt16BE(offset + 2);
    data.weight = buf.readUInt16BE(offset + 4);
    data.port = buf.readUInt16BE(offset + 6);
    data.target = name1.decode(buf, offset + 8);
    rsrv.decode.bytes = len + 2;
    return data;
};
rsrv.decode.bytes = 0;
rsrv.encodingLength = function(data) {
    return 8 + name1.encodingLength(data.target);
};
const rcaa = {
};
rcaa.ISSUER_CRITICAL = 1 << 7;
rcaa.encode = function(data, buf, offset) {
    const len = rcaa.encodingLength(data);
    if (!buf) buf = Buffer.allocUnsafe(rcaa.encodingLength(data));
    if (!offset) offset = 0;
    if (data.issuerCritical) {
        data.flags = rcaa.ISSUER_CRITICAL;
    }
    buf.writeUInt16BE(len - 2, offset);
    offset += 2;
    buf.writeUInt8(data.flags || 0, offset);
    offset += 1;
    string1.encode(data.tag, buf, offset);
    offset += string1.encode.bytes;
    buf.write(data.value, offset);
    offset += Buffer.byteLength(data.value);
    rcaa.encode.bytes = len;
    return buf;
};
rcaa.encode.bytes = 0;
rcaa.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const len = buf.readUInt16BE(offset);
    offset += 2;
    const oldOffset = offset;
    const data = {
    };
    data.flags = buf.readUInt8(offset);
    offset += 1;
    data.tag = string1.decode(buf, offset);
    offset += string1.decode.bytes;
    data.value = buf.toString("utf-8", offset, oldOffset + len);
    data.issuerCritical = !!(data.flags & rcaa.ISSUER_CRITICAL);
    rcaa.decode.bytes = len + 2;
    return data;
};
rcaa.decode.bytes = 0;
rcaa.encodingLength = function(data) {
    return string1.encodingLength(data.tag) + string1.encodingLength(data.value) + 2;
};
const rmx = {
};
rmx.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rmx.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    buf.writeUInt16BE(data.preference || 0, offset);
    offset += 2;
    name1.encode(data.exchange, buf, offset);
    offset += name1.encode.bytes;
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    rmx.encode.bytes = offset - oldOffset;
    return buf;
};
rmx.encode.bytes = 0;
rmx.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const data = {
    };
    offset += 2;
    data.preference = buf.readUInt16BE(offset);
    offset += 2;
    data.exchange = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    rmx.decode.bytes = offset - oldOffset;
    return data;
};
rmx.encodingLength = function(data) {
    return 4 + name1.encodingLength(data.exchange);
};
const ra = {
};
ra.encode = function(host, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(ra.encodingLength(host));
    if (!offset) offset = 0;
    buf.writeUInt16BE(4, offset);
    offset += 2;
    ip.toBuffer(host, buf, offset);
    ra.encode.bytes = 6;
    return buf;
};
ra.encode.bytes = 0;
ra.decode = function(buf, offset) {
    if (!offset) offset = 0;
    offset += 2;
    const host = ip.toString(buf, offset, 4);
    ra.decode.bytes = 6;
    return host;
};
ra.decode.bytes = 0;
ra.encodingLength = function() {
    return 6;
};
const raaaa = {
};
raaaa.encode = function(host, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(raaaa.encodingLength(host));
    if (!offset) offset = 0;
    buf.writeUInt16BE(16, offset);
    offset += 2;
    ip.toBuffer(host, buf, offset);
    raaaa.encode.bytes = 18;
    return buf;
};
raaaa.encode.bytes = 0;
raaaa.decode = function(buf, offset) {
    if (!offset) offset = 0;
    offset += 2;
    const host = ip.toString(buf, offset, 16);
    raaaa.decode.bytes = 18;
    return host;
};
raaaa.decode.bytes = 0;
raaaa.encodingLength = function() {
    return 18;
};
const roption = {
};
roption.encode = function(option, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(roption.encodingLength(option));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const code = toCode(option.code);
    buf.writeUInt16BE(code, offset);
    offset += 2;
    if (option.data) {
        buf.writeUInt16BE(option.data.length, offset);
        offset += 2;
        option.data.copy(buf, offset);
        offset += option.data.length;
    } else {
        switch(code){
            case 8:
                const spl = option.sourcePrefixLength || 0;
                const fam = option.family || (ip.isV4Format(option.ip) ? 1 : 2);
                const ipBuf = ip.toBuffer(option.ip);
                const ipLen = Math.ceil(spl / 8);
                buf.writeUInt16BE(ipLen + 4, offset);
                offset += 2;
                buf.writeUInt16BE(fam, offset);
                offset += 2;
                buf.writeUInt8(spl, offset++);
                buf.writeUInt8(option.scopePrefixLength || 0, offset++);
                ipBuf.copy(buf, offset, 0, ipLen);
                offset += ipLen;
                break;
            case 11:
                if (option.timeout) {
                    buf.writeUInt16BE(2, offset);
                    offset += 2;
                    buf.writeUInt16BE(option.timeout, offset);
                    offset += 2;
                } else {
                    buf.writeUInt16BE(0, offset);
                    offset += 2;
                }
                break;
            case 12:
                const len = option.length || 0;
                buf.writeUInt16BE(len, offset);
                offset += 2;
                buf.fill(0, offset, offset + len);
                offset += len;
                break;
            case 14:
                const tagsLen = option.tags.length * 2;
                buf.writeUInt16BE(tagsLen, offset);
                offset += 2;
                for (const tag of option.tags){
                    buf.writeUInt16BE(tag, offset);
                    offset += 2;
                }
                break;
            default:
                throw new Error(`Unknown roption code: ${option.code}`);
        }
    }
    roption.encode.bytes = offset - oldOffset;
    return buf;
};
roption.encode.bytes = 0;
roption.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const option = {
    };
    option.code = buf.readUInt16BE(offset);
    option.type = toString4(option.code);
    offset += 2;
    const len = buf.readUInt16BE(offset);
    offset += 2;
    option.data = buf.slice(offset, offset + len);
    switch(option.code){
        case 8:
            option.family = buf.readUInt16BE(offset);
            offset += 2;
            option.sourcePrefixLength = buf.readUInt8(offset++);
            option.scopePrefixLength = buf.readUInt8(offset++);
            const padded = Buffer.alloc(option.family === 1 ? 4 : 16);
            buf.copy(padded, 0, offset, offset + len - 4);
            option.ip = ip.toString(padded);
            break;
        case 11:
            if (len > 0) {
                option.timeout = buf.readUInt16BE(offset);
                offset += 2;
            }
            break;
        case 14:
            option.tags = [];
            for(let i = 0; i < len; i += 2){
                option.tags.push(buf.readUInt16BE(offset));
                offset += 2;
            }
    }
    roption.decode.bytes = len + 4;
    return option;
};
roption.decode.bytes = 0;
roption.encodingLength = function(option) {
    if (option.data) {
        return option.data.length + 4;
    }
    const code = toCode(option.code);
    switch(code){
        case 8:
            const spl = option.sourcePrefixLength || 0;
            return Math.ceil(spl / 8) + 8;
        case 11:
            return typeof option.timeout === "number" ? 6 : 4;
        case 12:
            return option.length + 4;
        case 14:
            return 4 + option.tags.length * 2;
    }
    throw new Error(`Unknown roption code: ${option.code}`);
};
const ropt = {
};
ropt.encode = function(options, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(ropt.encodingLength(options));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const rdlen = encodingLengthList(options, roption);
    buf.writeUInt16BE(rdlen, offset);
    offset = encodeList(options, roption, buf, offset + 2);
    ropt.encode.bytes = offset - oldOffset;
    return buf;
};
ropt.encode.bytes = 0;
ropt.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const options = [];
    let rdlen = buf.readUInt16BE(offset);
    offset += 2;
    let o = 0;
    while(rdlen > 0){
        options[o++] = roption.decode(buf, offset);
        offset += roption.decode.bytes;
        rdlen -= roption.decode.bytes;
    }
    ropt.decode.bytes = offset - oldOffset;
    return options;
};
ropt.decode.bytes = 0;
ropt.encodingLength = function(options) {
    return 2 + encodingLengthList(options || [], roption);
};
const rdnskey = {
};
rdnskey.PROTOCOL_DNSSEC = 3;
rdnskey.ZONE_KEY = 128;
rdnskey.SECURE_ENTRYPOINT = 32768;
rdnskey.encode = function(key, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rdnskey.encodingLength(key));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const keydata = key.key;
    if (!Buffer.isBuffer(keydata)) {
        throw new Error("Key must be a Buffer");
    }
    offset += 2;
    buf.writeUInt16BE(key.flags, offset);
    offset += 2;
    buf.writeUInt8(rdnskey.PROTOCOL_DNSSEC, offset);
    offset += 1;
    buf.writeUInt8(key.algorithm, offset);
    offset += 1;
    keydata.copy(buf, offset, 0, keydata.length);
    offset += keydata.length;
    rdnskey.encode.bytes = offset - oldOffset;
    buf.writeUInt16BE(rdnskey.encode.bytes - 2, oldOffset);
    return buf;
};
rdnskey.encode.bytes = 0;
rdnskey.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var key = {
    };
    var length = buf.readUInt16BE(offset);
    offset += 2;
    key.flags = buf.readUInt16BE(offset);
    offset += 2;
    if (buf.readUInt8(offset) !== rdnskey.PROTOCOL_DNSSEC) {
        throw new Error("Protocol must be 3");
    }
    offset += 1;
    key.algorithm = buf.readUInt8(offset);
    offset += 1;
    key.key = buf.slice(offset, oldOffset + length + 2);
    offset += key.key.length;
    rdnskey.decode.bytes = offset - oldOffset;
    return key;
};
rdnskey.decode.bytes = 0;
rdnskey.encodingLength = function(key) {
    return 6 + Buffer.byteLength(key.key);
};
const rrrsig = {
};
rrrsig.encode = function(sig, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rrrsig.encodingLength(sig));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const signature = sig.signature;
    if (!Buffer.isBuffer(signature)) {
        throw new Error("Signature must be a Buffer");
    }
    offset += 2;
    buf.writeUInt16BE(toType(sig.typeCovered), offset);
    offset += 2;
    buf.writeUInt8(sig.algorithm, offset);
    offset += 1;
    buf.writeUInt8(sig.labels, offset);
    offset += 1;
    buf.writeUInt32BE(sig.originalTTL, offset);
    offset += 4;
    buf.writeUInt32BE(sig.expiration, offset);
    offset += 4;
    buf.writeUInt32BE(sig.inception, offset);
    offset += 4;
    buf.writeUInt16BE(sig.keyTag, offset);
    offset += 2;
    name1.encode(sig.signersName, buf, offset);
    offset += name1.encode.bytes;
    signature.copy(buf, offset, 0, signature.length);
    offset += signature.length;
    rrrsig.encode.bytes = offset - oldOffset;
    buf.writeUInt16BE(rrrsig.encode.bytes - 2, oldOffset);
    return buf;
};
rrrsig.encode.bytes = 0;
rrrsig.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var sig = {
    };
    var length = buf.readUInt16BE(offset);
    offset += 2;
    sig.typeCovered = toString(buf.readUInt16BE(offset));
    offset += 2;
    sig.algorithm = buf.readUInt8(offset);
    offset += 1;
    sig.labels = buf.readUInt8(offset);
    offset += 1;
    sig.originalTTL = buf.readUInt32BE(offset);
    offset += 4;
    sig.expiration = buf.readUInt32BE(offset);
    offset += 4;
    sig.inception = buf.readUInt32BE(offset);
    offset += 4;
    sig.keyTag = buf.readUInt16BE(offset);
    offset += 2;
    sig.signersName = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    sig.signature = buf.slice(offset, oldOffset + length + 2);
    offset += sig.signature.length;
    rrrsig.decode.bytes = offset - oldOffset;
    return sig;
};
rrrsig.decode.bytes = 0;
rrrsig.encodingLength = function(sig) {
    return 20 + name1.encodingLength(sig.signersName) + Buffer.byteLength(sig.signature);
};
const rrp = {
};
rrp.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rrp.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    name1.encode(data.mbox || ".", buf, offset);
    offset += name1.encode.bytes;
    name1.encode(data.txt || ".", buf, offset);
    offset += name1.encode.bytes;
    rrp.encode.bytes = offset - oldOffset;
    buf.writeUInt16BE(rrp.encode.bytes - 2, oldOffset);
    return buf;
};
rrp.encode.bytes = 0;
rrp.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const data = {
    };
    offset += 2;
    data.mbox = name1.decode(buf, offset) || ".";
    offset += name1.decode.bytes;
    data.txt = name1.decode(buf, offset) || ".";
    offset += name1.decode.bytes;
    rrp.decode.bytes = offset - oldOffset;
    return data;
};
rrp.decode.bytes = 0;
rrp.encodingLength = function(data) {
    return 2 + name1.encodingLength(data.mbox || ".") + name1.encodingLength(data.txt || ".");
};
const typebitmap = {
};
typebitmap.encode = function(typelist, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(typebitmap.encodingLength(typelist));
    if (!offset) offset = 0;
    const oldOffset = offset;
    var typesByWindow = [];
    for(var i = 0; i < typelist.length; i++){
        var typeid = toType(typelist[i]);
        if (typesByWindow[typeid >> 8] === undefined) {
            typesByWindow[typeid >> 8] = [];
        }
        typesByWindow[typeid >> 8][typeid >> 3 & 31] |= 1 << 7 - (typeid & 7);
    }
    for(i = 0; i < typesByWindow.length; i++){
        if (typesByWindow[i] !== undefined) {
            var windowBuf = Buffer.from(typesByWindow[i]);
            buf.writeUInt8(i, offset);
            offset += 1;
            buf.writeUInt8(windowBuf.length, offset);
            offset += 1;
            windowBuf.copy(buf, offset);
            offset += windowBuf.length;
        }
    }
    typebitmap.encode.bytes = offset - oldOffset;
    return buf;
};
typebitmap.encode.bytes = 0;
typebitmap.decode = function(buf, offset, length) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var typelist = [];
    while(offset - oldOffset < length){
        var window = buf.readUInt8(offset);
        offset += 1;
        var windowLength = buf.readUInt8(offset);
        offset += 1;
        for(var i = 0; i < windowLength; i++){
            var b = buf.readUInt8(offset + i);
            for(var j = 0; j < 8; j++){
                if (b & 1 << 7 - j) {
                    var typeid = toString(window << 8 | i << 3 | j);
                    typelist.push(typeid);
                }
            }
        }
        offset += windowLength;
    }
    typebitmap.decode.bytes = offset - oldOffset;
    return typelist;
};
typebitmap.decode.bytes = 0;
typebitmap.encodingLength = function(typelist) {
    var extents = [];
    for(var i = 0; i < typelist.length; i++){
        var typeid = toType(typelist[i]);
        extents[typeid >> 8] = Math.max(extents[typeid >> 8] || 0, typeid & 255);
    }
    var len = 0;
    for(i = 0; i < extents.length; i++){
        if (extents[i] !== undefined) {
            len += 2 + Math.ceil((extents[i] + 1) / 8);
        }
    }
    return len;
};
const rnsec = {
};
rnsec.encode = function(record, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rnsec.encodingLength(record));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    name1.encode(record.nextDomain, buf, offset);
    offset += name1.encode.bytes;
    typebitmap.encode(record.rrtypes, buf, offset);
    offset += typebitmap.encode.bytes;
    rnsec.encode.bytes = offset - oldOffset;
    buf.writeUInt16BE(rnsec.encode.bytes - 2, oldOffset);
    return buf;
};
rnsec.encode.bytes = 0;
rnsec.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var record = {
    };
    var length = buf.readUInt16BE(offset);
    offset += 2;
    record.nextDomain = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    record.rrtypes = typebitmap.decode(buf, offset, length - (offset - oldOffset));
    offset += typebitmap.decode.bytes;
    rnsec.decode.bytes = offset - oldOffset;
    return record;
};
rnsec.decode.bytes = 0;
rnsec.encodingLength = function(record) {
    return 2 + name1.encodingLength(record.nextDomain) + typebitmap.encodingLength(record.rrtypes);
};
const rnsec3 = {
};
rnsec3.encode = function(record, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rnsec3.encodingLength(record));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const salt = record.salt;
    if (!Buffer.isBuffer(salt)) {
        throw new Error("salt must be a Buffer");
    }
    const nextDomain = record.nextDomain;
    if (!Buffer.isBuffer(nextDomain)) {
        throw new Error("nextDomain must be a Buffer");
    }
    offset += 2;
    buf.writeUInt8(record.algorithm, offset);
    offset += 1;
    buf.writeUInt8(record.flags, offset);
    offset += 1;
    buf.writeUInt16BE(record.iterations, offset);
    offset += 2;
    buf.writeUInt8(salt.length, offset);
    offset += 1;
    salt.copy(buf, offset, 0, salt.length);
    offset += salt.length;
    buf.writeUInt8(nextDomain.length, offset);
    offset += 1;
    nextDomain.copy(buf, offset, 0, nextDomain.length);
    offset += nextDomain.length;
    typebitmap.encode(record.rrtypes, buf, offset);
    offset += typebitmap.encode.bytes;
    rnsec3.encode.bytes = offset - oldOffset;
    buf.writeUInt16BE(rnsec3.encode.bytes - 2, oldOffset);
    return buf;
};
rnsec3.encode.bytes = 0;
rnsec3.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var record = {
    };
    var length = buf.readUInt16BE(offset);
    offset += 2;
    record.algorithm = buf.readUInt8(offset);
    offset += 1;
    record.flags = buf.readUInt8(offset);
    offset += 1;
    record.iterations = buf.readUInt16BE(offset);
    offset += 2;
    const saltLength = buf.readUInt8(offset);
    offset += 1;
    record.salt = buf.slice(offset, offset + saltLength);
    offset += saltLength;
    const hashLength = buf.readUInt8(offset);
    offset += 1;
    record.nextDomain = buf.slice(offset, offset + hashLength);
    offset += hashLength;
    record.rrtypes = typebitmap.decode(buf, offset, length - (offset - oldOffset));
    offset += typebitmap.decode.bytes;
    rnsec3.decode.bytes = offset - oldOffset;
    return record;
};
rnsec3.decode.bytes = 0;
rnsec3.encodingLength = function(record) {
    return 8 + record.salt.length + record.nextDomain.length + typebitmap.encodingLength(record.rrtypes);
};
const rds = {
};
rds.encode = function(digest, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rds.encodingLength(digest));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const digestdata = digest.digest;
    if (!Buffer.isBuffer(digestdata)) {
        throw new Error("Digest must be a Buffer");
    }
    offset += 2;
    buf.writeUInt16BE(digest.keyTag, offset);
    offset += 2;
    buf.writeUInt8(digest.algorithm, offset);
    offset += 1;
    buf.writeUInt8(digest.digestType, offset);
    offset += 1;
    digestdata.copy(buf, offset, 0, digestdata.length);
    offset += digestdata.length;
    rds.encode.bytes = offset - oldOffset;
    buf.writeUInt16BE(rds.encode.bytes - 2, oldOffset);
    return buf;
};
rds.encode.bytes = 0;
rds.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var digest = {
    };
    var length = buf.readUInt16BE(offset);
    offset += 2;
    digest.keyTag = buf.readUInt16BE(offset);
    offset += 2;
    digest.algorithm = buf.readUInt8(offset);
    offset += 1;
    digest.digestType = buf.readUInt8(offset);
    offset += 1;
    digest.digest = buf.slice(offset, oldOffset + length + 2);
    offset += digest.digest.length;
    rds.decode.bytes = offset - oldOffset;
    return digest;
};
rds.decode.bytes = 0;
rds.encodingLength = function(digest) {
    return 6 + Buffer.byteLength(digest.digest);
};
const rhttpsvcb = {
};
rhttpsvcb.decode = function(buf, offset) {
    if (!offset) offset = 0;
    let oldOffset = offset;
    const rLen = buf.readUInt16BE(offset) + 2;
    console.log("Rdata length : " + rLen);
    offset += 2;
    let data = {
    };
    data.svcPriority = buf.readUInt16BE(offset);
    offset += 2;
    data.targetName = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    data.svcParams = {
    };
    let svcKeyDecode;
    let svcParamKey;
    let svcKeyStr;
    while(offset != oldOffset + rLen){
        svcParamKey = buf.readUInt16BE(offset);
        svcKeyStr = toString5(svcParamKey);
        svcKeyDecode = svcbKeyObj(svcKeyStr);
        offset += 2;
        data.svcParams[svcKeyStr] = svcKeyDecode.decode(buf, offset);
        offset += svcKeyDecode.decode.bytes;
    }
    rhttpsvcb.decode.bytes = offset - oldOffset;
    return data;
};
rhttpsvcb.decode.bytes = 0;
rhttpsvcb.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rhttpsvcb.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    buf.writeUInt16BE(data.svcPriority, offset);
    offset += 2;
    name1.encode(data.targetName, buf, offset);
    offset += name1.encode.bytes;
    let svcbObj;
    for (let key of Object.keys(data.svcParams)){
        buf.writeUInt16BE(toKey(key), offset);
        offset += 2;
        svcbObj = svcbKeyObj(key);
        svcbObj.encode(data.svcParams[key], buf, offset);
        offset += svcbObj.encode.bytes;
    }
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    rhttpsvcb.encode.bytes = offset - oldOffset;
    return buf;
};
rhttpsvcb.encode.bytes = 0;
rhttpsvcb.encodingLength = function(data) {
    var encLen = 4 + name1.encodingLength(data.targetName);
    let svcbObj;
    for (let key of Object.keys(data.svcParams)){
        svcbObj = svcbKeyObj(key);
        encLen += 2 + svcbObj.encodingLength(data.svcParams[key]);
    }
    console.log(encLen);
    return encLen;
};
const svcAlpn = {
};
svcAlpn.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data = [];
    var length = buf.readUInt16BE(offset);
    offset += 2;
    var valueLength = 0;
    while(length != 0){
        valueLength = buf.readUInt8(offset);
        offset += 1;
        length -= 1;
        data.push(buf.toString("utf-8", offset, offset + valueLength));
        offset += valueLength;
        length -= valueLength;
    }
    svcAlpn.decode.bytes = offset - oldOffset;
    return data;
};
svcAlpn.decode.bytes = 0;
svcAlpn.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcAlpn.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    for (let value of data){
        buf.writeUInt8(Buffer.byteLength(value), offset);
        offset += 1;
        offset += buf.write(value, offset);
    }
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    svcAlpn.encode.bytes = offset - oldOffset;
    return buf;
};
svcAlpn.encode.bytes = 0;
svcAlpn.encodingLength = function(data) {
    var encLen = 2;
    for (let value of data){
        encLen += 1 + Buffer.byteLength(value);
    }
    return encLen;
};
const svcIpv6 = {
};
svcIpv6.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data = [];
    var length = buf.readUInt16BE(offset);
    offset += 2;
    while(length != 0){
        data.push(ip.toString(buf, offset, 16));
        offset += 16;
        length -= 16;
    }
    svcIpv6.decode.bytes = offset - oldOffset;
    return data;
};
svcIpv6.decode.bytes = 0;
svcIpv6.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcIpv6.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    buf.writeUInt16BE(data.length * 16, offset);
    offset += 2;
    for (let value of data){
        ip.toBuffer(value, buf, offset);
        offset += 16;
    }
    svcIpv6.encode.bytes = offset - oldOffset;
    return buf;
};
svcIpv6.encode.bytes = 0;
svcIpv6.encodingLength = function(data) {
    return 2 + data.length * 16;
};
const svcIpv4 = {
};
svcIpv4.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data = [];
    var length = buf.readUInt16BE(offset);
    offset += 2;
    while(length != 0){
        data.push(ip.toString(buf, offset, 4));
        offset += 4;
        length -= 4;
    }
    svcIpv4.decode.bytes = offset - oldOffset;
    return data;
};
svcIpv4.decode.bytes = 0;
svcIpv4.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcIpv4.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    buf.writeUInt16BE(data.length * 4, offset);
    offset += 2;
    for (let value of data){
        ip.toBuffer(value, buf, offset);
        offset += 4;
    }
    svcIpv4.encode.bytes = offset - oldOffset;
    return buf;
};
svcIpv4.encode.bytes = 0;
svcIpv4.encodingLength = function(data) {
    return 2 + data.length * 4;
};
const svcMandatory = {
};
svcMandatory.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data = [];
    var length = buf.readUInt16BE(offset);
    offset += 2;
    while(length != 0){
        data.push(toString5(buf.readUInt16BE(offset)));
        offset += 2;
        length -= 2;
    }
    svcMandatory.decode.bytes = offset - oldOffset;
    return data;
};
svcMandatory.decode.bytes = 0;
svcMandatory.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcMandatory.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    buf.writeUInt16BE(data.length * 2, offset);
    offset += 2;
    for (let value of data){
        buf.writeUInt16BE(toKey(value), offset);
        offset += 2;
    }
    svcMandatory.encode.bytes = offset - oldOffset;
    return buf;
};
svcMandatory.encode.bytes = 0;
svcMandatory.encodingLength = function(data) {
    return 2 + data.length * 2;
};
const svcPort = {
};
svcPort.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data = [];
    var length = buf.readUInt16BE(offset);
    offset += 2;
    while(length != 0){
        data.push(buf.readUInt16BE(offset));
        offset += 2;
        length -= 2;
    }
    svcPort.decode.bytes = offset - oldOffset;
    return data;
};
svcPort.decode.bytes = 0;
svcPort.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcPort.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    buf.writeUInt16BE(data.length * 2, offset);
    offset += 2;
    for (let value of data){
        buf.writeUInt16BE(value, offset);
        offset += 2;
    }
    svcPort.encode.bytes = offset - oldOffset;
    return buf;
};
svcPort.encode.bytes = 0;
svcPort.encodingLength = function(data) {
    return 2 + data.length * 2;
};
const svcEch = {
};
svcEch.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data;
    var length = buf.readUInt16BE(offset);
    offset += 2;
    data = buf.toString("base64", offset, offset + length);
    offset += length;
    svcEch.decode.bytes = offset - oldOffset;
    return data;
};
svcEch.decode.bytes = 0;
svcEch.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcEch.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    offset += buf.write(data, offset, "base64");
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    svcEch.encode.bytes = offset - oldOffset;
    return buf;
};
svcEch.encode.bytes = 0;
svcEch.encodingLength = function(data) {
    return 2 + Buffer.from(data, "base64").byteLength;
};
const svcOther = {
};
svcOther.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data;
    var length = buf.readUInt16BE(offset);
    offset += 2;
    data = buf.slice(offset, offset + length);
    offset += length;
    svcOther.decode.bytes = offset - oldOffset;
    return data;
};
svcOther.decode.bytes = 0;
svcOther.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcOther.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    buf.writeUInt16BE(data.byteLength, offset);
    offset += 2;
    offset += data.copy(buf, offset);
    svcOther.encode.bytes = offset - oldOffset;
    return buf;
};
svcOther.encode.bytes = 0;
svcOther.encodingLength = function(data) {
    return 2 + data.byteLength;
};
const svcbKeyObj = function(type) {
    switch(type.toLowerCase()){
        case "mandatory":
            return svcMandatory;
        case "alpn":
            return svcAlpn;
        case "no-default-alpn":
            return svcAlpn;
        case "port":
            return svcPort;
        case "ipv4hint":
            return svcIpv4;
        case "ech":
            return svcEch;
        case "ipv6hint":
            return svcIpv6;
        default:
            return svcOther;
    }
};
const renc = function(type) {
    switch(type.toUpperCase()){
        case "A":
            return ra;
        case "PTR":
            return rptr;
        case "CNAME":
            return rcname;
        case "DNAME":
            return rdname;
        case "TXT":
            return rtxt;
        case "NULL":
            return rnull;
        case "AAAA":
            return raaaa;
        case "SRV":
            return rsrv;
        case "HINFO":
            return rhinfo;
        case "CAA":
            return rcaa;
        case "NS":
            return rns;
        case "SOA":
            return rsoa;
        case "MX":
            return rmx;
        case "OPT":
            return ropt;
        case "DNSKEY":
            return rdnskey;
        case "RRSIG":
            return rrrsig;
        case "RP":
            return rrp;
        case "NSEC":
            return rnsec;
        case "NSEC3":
            return rnsec3;
        case "DS":
            return rds;
        case "HTTPS":
            return rhttpsvcb;
        case "SVCB":
            return rhttpsvcb;
    }
    return runknown;
};
const answer = {
};
answer.encode = function(a, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(answer.encodingLength(a));
    if (!offset) offset = 0;
    const oldOffset = offset;
    name1.encode(a.name, buf, offset);
    offset += name1.encode.bytes;
    buf.writeUInt16BE(toType(a.type), offset);
    if (a.type.toUpperCase() === "OPT") {
        if (a.name !== ".") {
            throw new Error("OPT name must be root.");
        }
        buf.writeUInt16BE(a.udpPayloadSize || 4096, offset + 2);
        buf.writeUInt8(a.extendedRcode || 0, offset + 4);
        buf.writeUInt8(a.ednsVersion || 0, offset + 5);
        buf.writeUInt16BE(a.flags || 0, offset + 6);
        offset += 8;
        ropt.encode(a.options || [], buf, offset);
        offset += ropt.encode.bytes;
    } else {
        let klass = toClass(a.class === undefined ? "IN" : a.class);
        if (a.flush) klass |= FLUSH_MASK;
        buf.writeUInt16BE(klass, offset + 2);
        buf.writeUInt32BE(a.ttl || 0, offset + 4);
        offset += 8;
        const enc = renc(a.type);
        enc.encode(a.data, buf, offset);
        offset += enc.encode.bytes;
    }
    answer.encode.bytes = offset - oldOffset;
    return buf;
};
answer.encode.bytes = 0;
answer.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const a = {
    };
    const oldOffset = offset;
    a.name = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    a.type = toString(buf.readUInt16BE(offset));
    if (a.type === "OPT") {
        a.udpPayloadSize = buf.readUInt16BE(offset + 2);
        a.extendedRcode = buf.readUInt8(offset + 4);
        a.ednsVersion = buf.readUInt8(offset + 5);
        a.flags = buf.readUInt16BE(offset + 6);
        a.flag_do = (a.flags >> 15 & 1) === 1;
        a.options = ropt.decode(buf, offset + 8);
        offset += 8 + ropt.decode.bytes;
    } else {
        const klass = buf.readUInt16BE(offset + 2);
        a.ttl = buf.readUInt32BE(offset + 4);
        a.class = toString3(klass & NOT_FLUSH_MASK);
        a.flush = !!(klass & FLUSH_MASK);
        const enc = renc(a.type);
        a.data = enc.decode(buf, offset + 8);
        offset += 8 + enc.decode.bytes;
    }
    answer.decode.bytes = offset - oldOffset;
    return a;
};
answer.decode.bytes = 0;
answer.encodingLength = function(a) {
    const data = a.data !== null && a.data !== undefined ? a.data : a.options;
    return name1.encodingLength(a.name) + 8 + renc(a.type).encodingLength(data);
};
const question = {
};
question.encode = function(q, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(question.encodingLength(q));
    if (!offset) offset = 0;
    const oldOffset = offset;
    name1.encode(q.name, buf, offset);
    offset += name1.encode.bytes;
    buf.writeUInt16BE(toType(q.type), offset);
    offset += 2;
    buf.writeUInt16BE(toClass(q.class === undefined ? "IN" : q.class), offset);
    offset += 2;
    question.encode.bytes = offset - oldOffset;
    return q;
};
question.encode.bytes = 0;
question.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const q = {
    };
    q.name = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    q.type = toString(buf.readUInt16BE(offset));
    offset += 2;
    q.class = toString3(buf.readUInt16BE(offset));
    offset += 2;
    const qu = !!(q.class & QU_MASK);
    if (qu) q.class &= NOT_QU_MASK;
    question.decode.bytes = offset - oldOffset;
    return q;
};
question.decode.bytes = 0;
question.encodingLength = function(q) {
    return name1.encodingLength(q.name) + 4;
};
const encode2 = function(result, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(result));
    if (!offset) offset = 0;
    const oldOffset = offset;
    if (!result.questions) result.questions = [];
    if (!result.answers) result.answers = [];
    if (!result.authorities) result.authorities = [];
    if (!result.additionals) result.additionals = [];
    header.encode(result, buf, offset);
    offset += header.encode.bytes;
    offset = encodeList(result.questions, question, buf, offset);
    offset = encodeList(result.answers, answer, buf, offset);
    offset = encodeList(result.authorities, answer, buf, offset);
    offset = encodeList(result.additionals, answer, buf, offset);
    encode2.bytes = offset - oldOffset;
    return buf;
};
encode2.bytes = 0;
const decode2 = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const result = header.decode(buf, offset);
    offset += header.decode.bytes;
    offset = decodeList(result.questions, question, buf, offset);
    offset = decodeList(result.answers, answer, buf, offset);
    offset = decodeList(result.authorities, answer, buf, offset);
    offset = decodeList(result.additionals, answer, buf, offset);
    decode2.bytes = offset - oldOffset;
    return result;
};
decode2.bytes = 0;
const encodingLength = function(result) {
    return header.encodingLength(result) + encodingLengthList(result.questions || [], question) + encodingLengthList(result.answers || [], answer) + encodingLengthList(result.authorities || [], answer) + encodingLengthList(result.additionals || [], answer);
};
const streamEncode = function(result) {
    const buf = encode2(result);
    const sbuf = Buffer.allocUnsafe(2);
    sbuf.writeUInt16BE(buf.byteLength);
    const combine = Buffer.concat([
        sbuf,
        buf
    ]);
    streamEncode.bytes = combine.byteLength;
    return combine;
};
streamEncode.bytes = 0;
const streamDecode = function(sbuf) {
    const len = sbuf.readUInt16BE(0);
    if (sbuf.byteLength < len + 2) {
        return null;
    }
    const result = decode2(sbuf.slice(2));
    streamDecode.bytes = decode2.bytes;
    return result;
};
streamDecode.bytes = 0;
function encodingLengthList(list, enc) {
    let len = 0;
    for(let i = 0; i < list.length; i++)len += enc.encodingLength(list[i]);
    return len;
}
function encodeList(list, enc, buf, offset) {
    for(let i = 0; i < list.length; i++){
        enc.encode(list[i], buf, offset);
        offset += enc.encode.bytes;
    }
    return offset;
}
function decodeList(list, enc, buf, offset) {
    for(let i = 0; i < list.length; i++){
        list[i] = enc.decode(buf, offset);
        offset += enc.decode.bytes;
    }
    return offset;
}
class DNSParserWrap {
    constructor(){
    }
    async Decode(arrayBuffer) {
        try {
            return decode2(Buffer.from(new Uint8Array(arrayBuffer)));
        } catch (e) {
            console.error("Error At : DNSParserWrap -> Decode");
            console.error(e.stack);
            throw e;
        }
    }
    Encode(DecodedDnsPacket) {
        try {
            return encode2(DecodedDnsPacket);
        } catch (e) {
            console.error("Error At : DNSParserWrap -> Encode");
            console.error(e.stack);
            throw e;
        }
    }
}
class DNSBlock {
    constructor(){
        this.dnsParser = new DNSParserWrap();
    }
    async RethinkModule(param) {
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = {
        };
        response.data.isBlocked = false;
        response.data.isNotBlockedExistInBlocklist = false;
        response.data.domainNameInBlocklistUint;
        response.data.domainNameUserBlocklistIntersection;
        response.data.decodedDnsPacket;
        response.data.blockedB64Flag = "";
        try {
            let decodedDnsPacket = await this.dnsParser.Decode(param.requestBodyBuffer);
            if (param.userBlocklistInfo.userBlocklistFlagUint.length > 0) {
                let domainNameBlocklistInfo;
                if (decodedDnsPacket.questions.length >= 1 && (decodedDnsPacket.questions[0].type == "A" || decodedDnsPacket.questions[0].type == "AAAA" || decodedDnsPacket.questions[0].type == "CNAME" || decodedDnsPacket.questions[0].type == "HTTPS" || decodedDnsPacket.questions[0].type == "SVCB")) {
                    domainNameBlocklistInfo = param.blocklistFilter.getDomainInfo(decodedDnsPacket.questions[0].name);
                    if (domainNameBlocklistInfo.data.searchResult) {
                        response.data = checkDomainBlocking(param.userBlocklistInfo, domainNameBlocklistInfo, param.blocklistFilter, decodedDnsPacket.questions[0].name);
                    }
                }
            }
            response.data.decodedDnsPacket = decodedDnsPacket;
        } catch (e) {
            response.isException = true;
            response.exceptionStack = e.stack;
            response.exceptionFrom = "DNSBlock RethinkModule";
            response.data = false;
            console.error("Error At : DNSBlock -> RethinkModule");
            console.error(e.stack);
        }
        return response;
    }
}
function checkDomainBlocking(userBlocklistInfo, domainNameBlocklistInfo, blocklistFilter, domainName) {
    let response;
    try {
        response = checkDomainNameUserFlagIntersection(userBlocklistInfo.userBlocklistFlagUint, userBlocklistInfo.flagVersion, domainNameBlocklistInfo, blocklistFilter, domainName);
        if (response.isBlocked) {
            return response;
        }
        if (userBlocklistInfo.userServiceListUint) {
            let dnSplit = domainName.split(".");
            let dnJoin = "";
            let wildCardResponse;
            while(dnSplit.shift() != undefined){
                dnJoin = dnSplit.join(".");
                wildCardResponse = checkDomainNameUserFlagIntersection(userBlocklistInfo.userServiceListUint, userBlocklistInfo.flagVersion, domainNameBlocklistInfo, blocklistFilter, dnJoin);
                if (wildCardResponse.isBlocked) {
                    return wildCardResponse;
                }
            }
        }
    } catch (e) {
        throw e;
    }
    return response;
}
function checkDomainNameUserFlagIntersection(userBlocklistFlagUint, flagVersion, domainNameBlocklistInfo, blocklistFilter, domainName) {
    let response = {
    };
    try {
        response.isBlocked = false;
        response.isNotBlockedExistInBlocklist = false;
        response.blockedB64Flag = "";
        response.blockedTag = [];
        if (domainNameBlocklistInfo.data.searchResult.has(domainName)) {
            let domainNameInBlocklistUint = domainNameBlocklistInfo.data.searchResult.get(domainName);
            let blockedUint = blocklistFilter.flagIntersection(userBlocklistFlagUint, domainNameInBlocklistUint);
            if (blockedUint) {
                response.isBlocked = true;
                response.blockedB64Flag = blocklistFilter.getB64FlagFromUint16(blockedUint, flagVersion);
            } else {
                response.isNotBlockedExistInBlocklist = true;
                blockedUint = new Uint16Array(domainNameInBlocklistUint.length);
                let index = 0;
                for (let singleBlock of domainNameInBlocklistUint){
                    blockedUint[index] = singleBlock;
                    index++;
                }
                response.blockedB64Flag = blocklistFilter.getB64FlagFromUint16(blockedUint, flagVersion);
            }
            response.blockedTag = blocklistFilter.getTag(blockedUint);
        }
    } catch (e) {
        throw e;
    }
    return response;
}
class DNSResponseBlock {
    constructor(){
        this.dnsParser = new DNSParserWrap();
    }
    async RethinkModule(param) {
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = {
        };
        response.data.isBlocked = false;
        response.data.isNotBlockedExistInBlocklist = false;
        response.data.domainNameInBlocklistUint;
        response.data.domainNameUserBlocklistIntersection;
        try {
            if (param.userBlocklistInfo.userBlocklistFlagUint.length > 0) {
                if (param.responseDecodedDnsPacket.answers.length > 0 && param.responseDecodedDnsPacket.answers[0].type == "CNAME") {
                    checkCnameBlock(param, response, param.responseDecodedDnsPacket);
                } else if (param.responseDecodedDnsPacket.answers.length > 0 && (param.responseDecodedDnsPacket.answers[0].type == "HTTPS" || param.responseDecodedDnsPacket.answers[0].type == "SVCB")) {
                    checkHttpsSvcbBlock(param, response, param.responseDecodedDnsPacket);
                }
            }
        } catch (e) {
            response.isException = true;
            response.exceptionStack = e.stack;
            response.exceptionFrom = "DNSResponseBlock RethinkModule";
            response.data = false;
            console.error("Error At : DNSResponseBlock -> RethinkModule");
            console.error(e.stack);
        }
        return response;
    }
}
function checkHttpsSvcbBlock(param, response, decodedDnsPacket) {
    let targetName = decodedDnsPacket.answers[0].data.targetName.trim().toLowerCase();
    if (targetName != ".") {
        domainNameBlocklistInfo = param.blocklistFilter.getDomainInfo(targetName);
        if (domainNameBlocklistInfo.data.searchResult) {
            response.data = checkDomainBlocking1(param.userBlocklistInfo, domainNameBlocklistInfo, param.blocklistFilter, targetName);
        }
    }
}
function checkCnameBlock(param, response, decodedDnsPacket) {
    let domainNameBlocklistInfo;
    let cname = decodedDnsPacket.answers[0].data.trim().toLowerCase();
    domainNameBlocklistInfo = param.blocklistFilter.getDomainInfo(cname);
    if (domainNameBlocklistInfo.data.searchResult) {
        response.data = checkDomainBlocking1(param.userBlocklistInfo, domainNameBlocklistInfo, param.blocklistFilter, cname);
    }
    if (!response.data.isBlocked) {
        cname = decodedDnsPacket.answers[decodedDnsPacket.answers.length - 1].name.trim().toLowerCase();
        domainNameBlocklistInfo = param.blocklistFilter.getDomainInfo(cname);
        if (domainNameBlocklistInfo.data.searchResult) {
            response.data = checkDomainBlocking1(param.userBlocklistInfo, domainNameBlocklistInfo, param.blocklistFilter, cname);
        }
    }
}
function checkDomainBlocking1(userBlocklistInfo, domainNameBlocklistInfo, blocklistFilter, domainName) {
    let response;
    try {
        response = checkDomainNameUserFlagIntersection1(userBlocklistInfo.userBlocklistFlagUint, userBlocklistInfo.flagVersion, domainNameBlocklistInfo, blocklistFilter, domainName);
        if (response.isBlocked) {
            return response;
        }
        if (userBlocklistInfo.userServiceListUint) {
            let dnSplit = domainName.split(".");
            let dnJoin = "";
            let wildCardResponse;
            while(dnSplit.shift() != undefined){
                dnJoin = dnSplit.join(".");
                wildCardResponse = checkDomainNameUserFlagIntersection1(userBlocklistInfo.userServiceListUint, userBlocklistInfo.flagVersion, domainNameBlocklistInfo, blocklistFilter, dnJoin);
                if (wildCardResponse.isBlocked) {
                    return wildCardResponse;
                }
            }
        }
    } catch (e) {
        throw e;
    }
    return response;
}
function checkDomainNameUserFlagIntersection1(userBlocklistFlagUint, flagVersion, domainNameBlocklistInfo, blocklistFilter, domainName) {
    let response = {
    };
    try {
        response.isBlocked = false;
        response.isNotBlockedExistInBlocklist = false;
        response.blockedB64Flag = "";
        response.blockedTag = [];
        if (domainNameBlocklistInfo.data.searchResult.has(domainName)) {
            let domainNameInBlocklistUint = domainNameBlocklistInfo.data.searchResult.get(domainName);
            let blockedUint = blocklistFilter.flagIntersection(userBlocklistFlagUint, domainNameInBlocklistUint);
            if (blockedUint) {
                response.isBlocked = true;
                response.blockedB64Flag = blocklistFilter.getB64FlagFromUint16(blockedUint, flagVersion);
            } else {
                response.isNotBlockedExistInBlocklist = true;
                blockedUint = new Uint16Array(domainNameInBlocklistUint.length);
                let index = 0;
                for (let singleBlock of domainNameInBlocklistUint){
                    blockedUint[index] = singleBlock;
                    index++;
                }
                response.blockedB64Flag = blocklistFilter.getB64FlagFromUint16(blockedUint, flagVersion);
            }
            response.blockedTag = blocklistFilter.getTag(blockedUint);
        }
    } catch (e) {
        throw e;
    }
    return response;
}
class LfuCache {
    constructor(lfuName, size){
        this.lfuName = lfuName;
        this.lfuCacheMap = new Map();
        this.lfuCacheArray = [];
        this.lfuCacheSize = size;
        this.lfuCacheIndex = -1;
        this.lfustart = -1;
        this.lfuend = 0;
    }
    Get(key) {
        let cacheData = false;
        try {
            cacheData = this.lfuCacheArray[this.lfuCacheMap.get(key)];
        } catch (e) {
            console.log("Error At : LfuCache -> Get");
            console.log(e.stack);
        }
        return cacheData;
    }
    Put(cacheData) {
        try {
            this.dataToLfu(cacheData);
        } catch (e) {
            console.log("Error At : LfuCache -> Put");
            console.log(e.stack);
        }
    }
}
LfuCache.prototype.removeAddLfuCache = function(key, data) {
    let arraydata = data;
    arraydata.n = this.lfustart;
    arraydata.p = -1;
    this.lfuCacheMap.delete(this.lfuCacheArray[this.lfuend].k);
    this.lfuCacheArray[this.lfustart].p = this.lfuend;
    this.lfustart = this.lfuend;
    this.lfuend = this.lfuCacheArray[this.lfuend].p;
    this.lfuCacheArray[this.lfuend].n = -1;
    this.lfuCacheMap.set(key, this.lfustart);
    this.lfuCacheArray[this.lfustart] = arraydata;
};
LfuCache.prototype.updateLfuCache = function(key, data) {
    let accindex = this.lfuCacheMap.get(key);
    if (accindex != this.lfustart) {
        if (data.n == -1) {
            this.lfuend = data.p;
            this.lfuCacheArray[this.lfuend].n = -1;
        } else {
            this.lfuCacheArray[data.n].p = data.p;
            this.lfuCacheArray[data.p].n = data.n;
        }
        data.p = -1;
        data.n = this.lfustart;
        this.lfuCacheArray[this.lfustart].p = accindex;
        this.lfustart = accindex;
    }
};
LfuCache.prototype.simpleAddLruCache = function(key, data) {
    let arraydata = {
    };
    arraydata = data;
    if (this.lfuCacheIndex == -1) {
        arraydata.n = -1;
        arraydata.p = -1;
        this.lfustart = 0;
        this.lfuend = 0;
        this.lfuCacheIndex++;
    } else {
        this.lfuCacheIndex++;
        arraydata.n = this.lfustart;
        arraydata.p = -1;
        this.lfuCacheArray[this.lfustart].p = this.lfuCacheIndex;
        this.lfustart = this.lfuCacheIndex;
    }
    this.lfuCacheMap.set(key, this.lfuCacheIndex);
    this.lfuCacheArray[this.lfuCacheIndex] = {
    };
    this.lfuCacheArray[this.lfuCacheIndex] = arraydata;
};
LfuCache.prototype.dataToLfu = function(value) {
    if (this.lfuCacheMap.has(value.k)) {
        let oldValue = this.lfuCacheArray[this.lfuCacheMap.get(value.k)];
        oldValue.data = value.data;
        this.updateLfuCache(value.k, oldValue);
    } else {
        if (this.lfuCacheIndex > this.lfuCacheSize - 2) {
            this.removeAddLfuCache(value.k, value);
        } else {
            this.simpleAddLruCache(value.k, value);
        }
    }
};
class LocalCache {
    constructor(cacheName, size){
        this.localCache = new LfuCache(cacheName, size);
    }
    Get(key) {
        return this.localCache.Get(key);
    }
    Put(cacheData) {
        try {
            this.localCache.Put(cacheData);
        } catch (e) {
            console.error("Error At : LocalCache -> Put");
            console.error(e.stack);
            throw e;
        }
    }
}
const ttlGraceSec = 30;
const lfuSize = 2000;
class DNSResolver {
    constructor(){
        this.dnsParser = new DNSParserWrap();
        this.dnsResCache = false;
        this.wCache = false;
    }
    async RethinkModule(param) {
        let response = emptyResponse();
        try {
            if (!this.dnsResCache) {
                this.dnsResCache = new LocalCache("dns-response-cache", lfuSize);
                if (param.runTimeEnv == "worker") {
                    this.wCache = caches.default;
                }
            }
            response.data = await this.checkLocalCacheBfrResolve(param);
        } catch (e) {
            response = errResponse(e);
            console.error("Error At : DNSResolver -> RethinkModule");
            console.error(e.stack);
        }
        return response;
    }
}
DNSResolver.prototype.checkLocalCacheBfrResolve = async function(param) {
    let resp = emptyResponse();
    const dn = (param.requestDecodedDnsPacket.questions.length > 0 ? param.requestDecodedDnsPacket.questions[0].name : "").trim().toLowerCase() + ":" + param.requestDecodedDnsPacket.questions[0].type;
    const now = Date.now();
    let cacheRes = this.dnsResCache.Get(dn);
    if (!cacheRes || now >= cacheRes.data.expiry) {
        cacheRes = await this.checkSecondLevelCacheBfrResolve(param.runTimeEnv, param.request.url, dn, now);
        if (!cacheRes) {
            cacheRes = {
            };
            resp.responseBodyBuffer = await (await resolveDnsUpstream(param.request, param.dnsResolverUrl, param.requestBodyBuffer, param.runTimeEnv)).arrayBuffer();
            await this.updateCache(param, cacheRes, dn, now, resp.responseBodyBuffer);
            resp.responseDecodedDnsPacket = cacheRes.data.decodedDnsPacket;
            this.dnsResCache.Put(cacheRes);
            return resp;
        }
    }
    resp.responseDecodedDnsPacket = cacheRes.data.decodedDnsPacket;
    resp.responseDecodedDnsPacket.id = param.requestDecodedDnsPacket.id;
    resp.responseBodyBuffer = await this.loadDnsResponseFromCache(resp.responseDecodedDnsPacket, cacheRes.data.expiry, now);
    return resp;
};
DNSResolver.prototype.loadDnsResponseFromCache = async function(dnsPacket, expiry, now) {
    const outttl = Math.max(Math.floor((expiry - now) / 1000), 1);
    for (let answer of dnsPacket.answers){
        answer.ttl = outttl;
    }
    return this.dnsParser.Encode(dnsPacket);
};
DNSResolver.prototype.checkSecondLevelCacheBfrResolve = async function(runTimeEnv, reqUrl, dn, now) {
    if (runTimeEnv !== "worker") {
        return false;
    }
    let wCacheUrl = new URL(new URL(reqUrl).origin + "/" + dn);
    let resp = await this.wCache.match(wCacheUrl);
    if (resp) {
        const metaData = JSON.parse(resp.headers.get("x-rethink-metadata"));
        if (now >= cacheRes.data.expiry) {
            return false;
        }
        let cacheRes = {
        };
        cacheRes.k = dn;
        cacheRes.data = {
        };
        cacheRes.data.decodedDnsPacket = await this.dnsParser.Decode(await resp.arrayBuffer());
        cacheRes.data.expiry = metaData.expiry;
        return cacheRes;
    }
};
DNSResolver.prototype.updateCache = async function(param, cacheRes, dn, now, responseBodyBuffer) {
    let decodedDnsPacket = await this.dnsParser.Decode(responseBodyBuffer);
    let minttl = 0;
    for (let answer of decodedDnsPacket.answers){
        minttl = minttl <= 0 || minttl > answer.ttl ? answer.ttl : minttl;
    }
    minttl = Math.max(minttl + ttlGraceSec, 60);
    cacheRes.k = dn;
    cacheRes.data = {
    };
    cacheRes.data.decodedDnsPacket = decodedDnsPacket;
    cacheRes.data.expiry = minttl * 1000 + now;
    if (param.runTimeEnv == "worker") {
        let wCacheUrl = new URL(new URL(param.request.url).origin + "/" + dn);
        let response = new Response(responseBodyBuffer, {
            headers: {
                "Cache-Control": "s-maxage=" + minttl,
                "Content-Length": responseBodyBuffer.length,
                "Content-Type": "application/octet-stream",
                "x-rethink-metadata": JSON.stringify({
                    expiry: cacheRes.data.expiry
                })
            },
            cf: {
                cacheTtl: minttl
            }
        });
        param.event.waitUntil(this.wCache.put(wCacheUrl, response));
    }
};
async function resolveDnsUpstream(request, resolverUrl, requestBodyBuffer, runTimeEnv) {
    try {
        let u = new URL(request.url);
        let dnsResolverUrl = new URL(resolverUrl);
        u.hostname = dnsResolverUrl.hostname;
        u.pathname = dnsResolverUrl.pathname;
        u.port = dnsResolverUrl.port;
        u.protocol = dnsResolverUrl.protocol;
        const headers = {
            Accept: "application/dns-message"
        };
        let newRequest;
        if (request.method === "GET" || runTimeEnv == "worker" && request.method === "POST") {
            u.search = runTimeEnv == "worker" && request.method === "POST" ? "?dns=" + btoa(String.fromCharCode(...new Uint8Array(requestBodyBuffer))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "") : u.search;
            newRequest = new Request(u.href, {
                method: "GET",
                headers: headers
            });
        } else if (request.method === "POST") {
            newRequest = new Request(u.href, {
                method: "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/dns-message",
                    "Content-Length": requestBodyBuffer.byteLength
                },
                body: requestBodyBuffer
            });
        } else {
            throw new Error("get/post requests only");
        }
        return await fetch(newRequest);
    } catch (e) {
        throw e;
    }
}
function emptyResponse() {
    return {
        isException: false,
        exceptionStack: "",
        exceptionFrom: "",
        data: {
        },
        responseDecodedDnsPacket: null,
        responseBodyBuffer: null
    };
}
function errResponse(e) {
    return {
        isException: true,
        exceptionStack: e.stack,
        exceptionFrom: "DNSResolver RethinkModule",
        data: false,
        responseDecodedDnsPacket: null,
        responseBodyBuffer: null
    };
}
class CurrentRequest {
    constructor(){
        this.blockedB64Flag = "";
        this.decodedDnsPacket = undefined;
        this.httpResponse = undefined;
        this.isException = false;
        this.exceptionStack = undefined;
        this.exceptionFrom = "";
        this.isDnsParseException = false;
        this.isDnsBlock = false;
        this.isDomainInBlockListNotBlocked = false;
        this.isInvalidFlagBlock = false;
        this.stopProcessing = false;
        this.dnsParser = new DNSParserWrap();
    }
    dnsExceptionResponse() {
        const singleLog = {
        };
        singleLog.exceptionFrom = this.exceptionFrom;
        singleLog.exceptionStack = this.exceptionStack;
        const dnsEncodeObj = this.dnsParser.Encode({
            type: "response",
            flags: 4098
        });
        this.httpResponse = new Response(dnsEncodeObj);
        setResponseCommonHeader.call(this);
        this.httpResponse.headers.set("x-err", JSON.stringify(singleLog));
    }
    customResponse(data) {
        const dnsEncodeObj = this.dnsParser.Encode({
            type: "response",
            flags: 1
        });
        this.httpResponse = new Response(dnsEncodeObj);
        setResponseCommonHeader.call(this);
        this.httpResponse.headers.set("x-err", JSON.stringify(data));
    }
    dnsResponse(arrayBuffer) {
        this.httpResponse = new Response(arrayBuffer);
        setResponseCommonHeader.call(this);
        return this.httpResponse;
    }
    dnsBlockResponse() {
        try {
            this.decodedDnsPacket.type = "response";
            this.decodedDnsPacket.rcode = "NOERROR";
            this.decodedDnsPacket.flags = 384;
            this.decodedDnsPacket.flag_qr = true;
            this.decodedDnsPacket.answers = [];
            this.decodedDnsPacket.answers[0] = {
            };
            this.decodedDnsPacket.answers[0].name = this.decodedDnsPacket.questions[0].name;
            this.decodedDnsPacket.answers[0].type = this.decodedDnsPacket.questions[0].type;
            this.decodedDnsPacket.answers[0].ttl = 300;
            this.decodedDnsPacket.answers[0].class = "IN";
            this.decodedDnsPacket.answers[0].data = "";
            this.decodedDnsPacket.answers[0].flush = false;
            if (this.decodedDnsPacket.questions[0].type == "A") {
                this.decodedDnsPacket.answers[0].data = "0.0.0.0";
            } else if (this.decodedDnsPacket.questions[0].type == "AAAA") {
                this.decodedDnsPacket.answers[0].data = "::";
            } else if (this.decodedDnsPacket.questions[0].type == "HTTPS" || this.decodedDnsPacket.questions[0].type == "SVCB") {
                this.decodedDnsPacket.answers[0].data = {
                };
                this.decodedDnsPacket.answers[0].data.svcPriority = 0;
                this.decodedDnsPacket.answers[0].data.targetName = ".";
                this.decodedDnsPacket.answers[0].data.svcParams = {
                };
            }
            this.decodedDnsPacket.authorities = [];
            const res = new Response(this.dnsParser.Encode(this.decodedDnsPacket));
            this.httpResponse = new Response(res.body, res);
            setResponseCommonHeader.call(this);
        } catch (e) {
            this.isException = true;
            this.exceptionStack = e.stack;
            this.exceptionFrom = "CurrentRequest dnsBlockResponse";
        }
    }
}
function setResponseCommonHeader() {
    this.httpResponse.headers.set("Content-Type", "application/dns-message");
    this.httpResponse.headers.append("Vary", "Origin");
    this.httpResponse.headers.delete("expect-ct");
    this.httpResponse.headers.delete("cf-ray");
    if (this.isDnsBlock) {
        this.httpResponse.headers.set("x-nile-flags", this.blockedB64Flag);
    } else if (this.isDomainInBlockListNotBlocked) {
        this.httpResponse.headers.set('x-nile-flag-notblocked', this.blockedB64Flag);
    }
}
const BASE64 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const config1 = {
    inspect: false,
    utf16: true,
    useBinarySearch: true,
    debug: false,
    selectsearch: true,
    fastPos: true,
    compress: true,
    unroll: false,
    useBuffer: true,
    write16: true,
    valueNode: true,
    base32: false,
    storeMeta: false,
    allLists: false,
    fetch: true,
    fm: false
};
if (config1.valueNode) {
    config1.compress = true;
}
if (config1.compress) {
    config1.unroll = false;
    config1.utf16 = config1.unroll ? config1.utf16 : true;
}
if (config1.write16) {
    config1.useBuffer = true;
}
const W = config1.utf16 ? 16 : config1.utf15 ? 15 : 6;
const bufferView = {
    15: Uint16Array,
    16: Uint16Array,
    6: Uint8Array
};
function CHR(ord) {
    return CHRM(ord, W === 6);
}
function CHR16(ord) {
    return CHRM(ord, false);
}
function CHRM(ord, b64) {
    return b64 ? BASE64[ord] : String.fromCharCode(ord);
}
const ORD = {
};
for(let i2 = 0; i2 < BASE64.length; i2++){
    ORD[BASE64[i2]] = i2;
}
function DEC(chr) {
    return DECM(chr, W === 6);
}
function DEC16(chr) {
    return DECM(chr, false);
}
function DECM(chr, b64) {
    return b64 ? ORD[chr] : chr.charCodeAt(0);
}
const L1 = 32 * 32;
const L2 = 32;
const V1 = 64;
const MFIELDBITS = 30;
const TxtEnc = new TextEncoder();
const TxtDec = new TextDecoder();
const DELIM = "#";
const ENC_DELIM = TxtEnc.encode(DELIM);
function BitWriter() {
    this.init();
}
function getBuffer(size, nofbits) {
    return new bufferView[nofbits](size);
}
BitWriter.prototype = {
    init: function() {
        this.bits = [];
        this.bytes = [];
        this.bits16 = [];
        this.top = 0;
    },
    write16 (data, numBits) {
        if (numBits > 16) {
            console.error("write16 can only writes lsb16 bits, out of range: " + numBits);
            return;
        }
        const n = data;
        const brim = 16 - this.top % 16;
        const cur = this.top / 16 | 0;
        const e = this.bits16[cur] | 0;
        let remainingBits = 0;
        let b = n & BitString.MaskTop[16][16 - numBits];
        if (brim >= numBits) {
            b = b << brim - numBits;
        } else {
            remainingBits = numBits - brim;
            b = b >>> remainingBits;
        }
        b = e | b;
        this.bits16[cur] = b;
        if (remainingBits > 0) {
            b = n & BitString.MaskTop[16][16 - remainingBits];
            b = b << 16 - remainingBits;
            this.bits16[cur + 1] = b;
        }
        this.top += numBits;
    },
    write: function(data, numBits) {
        if (config1.write16) {
            while(numBits > 0){
                const i = (numBits - 1) / 16 | 0;
                const b = data >>> i * 16;
                const l = numBits % 16 === 0 ? 16 : numBits % 16;
                this.write16(b, l);
                numBits -= l;
            }
            return;
        }
        for(let i = numBits - 1; i >= 0; i--){
            if (data & 1 << i) {
                this.bits.push(1);
            } else {
                this.bits.push(0);
            }
        }
    },
    getData: function() {
        const conv = this.bitsToBytes();
        this.bytes = this.bytes.concat(conv);
        return config1.useBuffer ? conv : this.bytes.join("");
    },
    bitsToBytes: function() {
        if (config1.write16) {
            if (config1.useBuffer) {
                return bufferView[W].from(this.bits16);
            }
            this.bits16 = [];
        }
        const n = this.bits.length;
        const size = Math.ceil(n / W);
        const chars = config1.useBuffer ? getBuffer(size, W) : [];
        console.log("W/size/n ", W, size, n);
        let j = 0;
        let b = 0;
        let i = 0;
        while(j < n){
            b = b << 1 | this.bits[j];
            i += 1;
            if (i === W) {
                if (config1.useBuffer) {
                    chars.set([
                        b
                    ], j / W | 0);
                } else {
                    chars.push(CHR(b));
                }
                i = b = 0;
            }
            j += 1;
        }
        if (i !== 0) {
            b = b << W - i;
            if (config1.useBuffer) {
                chars.set([
                    b
                ], j / W | 0);
            } else {
                chars.push(CHR(b));
            }
            i = 0;
        }
        this.bits = [];
        return chars;
    }
};
function BitString(str) {
    this.init(str);
}
BitString.MaskTop = {
    16: [
        65535,
        32767,
        16383,
        8191,
        4095,
        2047,
        1023,
        511,
        255,
        127,
        63,
        31,
        15,
        7,
        3,
        1,
        0, 
    ],
    15: [
        32767,
        16383,
        8191,
        4095,
        2047,
        1023,
        511,
        255,
        127,
        63,
        31,
        15,
        7,
        3,
        1,
        0, 
    ],
    6: [
        63,
        31,
        15,
        7,
        3,
        1,
        0
    ]
};
BitString.MaskBottom = {
    16: [
        65535,
        65534,
        65532,
        65528,
        65520,
        65504,
        65472,
        65408,
        65280,
        65024,
        64512,
        63488,
        61440,
        57344,
        49152,
        32768,
        0, 
    ]
};
const BitsSetTable256 = [];
function initialize() {
    BitsSetTable256[0] = 0;
    for(let i = 0; i < 256; i++){
        BitsSetTable256[i] = (i & 1) + BitsSetTable256[Math.floor(i / 2)];
    }
}
function countSetBits(n) {
    return BitsSetTable256[n & 255] + BitsSetTable256[n >>> 8 & 255] + BitsSetTable256[n >>> 16 & 255] + BitsSetTable256[n >>> 24];
}
function bit0(n, p, pad) {
    const r = bit0p(n, p);
    if (r.scanned <= 0) return r.scanned;
    if (r.index > 0) return r.scanned;
    if (pad > r.scanned) return r.scanned + 1;
    else return 0;
}
function bit0p(n, p) {
    if (p == 0) return {
        index: 0,
        scanned: 0
    };
    if (n == 0 && p == 1) return {
        index: 1,
        scanned: 1
    };
    let c = 0, i = 0;
    for(c = 0; n > 0 && p > c; n = n >>> 1){
        c = c + (n < (n ^ 1)) ? 1 : 0;
        i += 1;
    }
    return {
        index: p == c ? i : 0,
        scanned: i
    };
}
BitString.prototype = {
    init: function(str) {
        this.bytes = str;
        this.length = this.bytes.length * W;
        this.useBuffer = typeof str !== "string";
    },
    getData: function() {
        return this.bytes;
    },
    encode: function(n) {
        const e = [];
        for(let i = 0; i < this.length; i += n){
            e.push(this.get(i, Math.min(this.length, n)));
        }
        return e;
    },
    get: function(p, n, debug = false) {
        if (this.useBuffer) {
            if (p % W + n <= W) {
                return (this.bytes[p / W | 0] & BitString.MaskTop[W][p % W]) >> W - p % W - n;
            } else {
                let result = this.bytes[p / W | 0] & BitString.MaskTop[W][p % W];
                let tmpCount = 0;
                const disp1 = this.bytes[p / W | 0];
                const disp2 = BitString.MaskTop[W][p % W];
                const res1 = result;
                const l = W - p % W;
                p += l;
                n -= l;
                while(n >= W){
                    tmpCount++;
                    result = result << W | this.bytes[p / W | 0];
                    p += W;
                    n -= W;
                }
                const res2 = result;
                if (n > 0) {
                    result = result << n | this.bytes[p / W | 0] >> W - n;
                }
                if (debug == true) {
                    console.log("disp1: " + disp1 + " disp2: " + disp2 + " loopcount: " + tmpCount + " res1: " + res1 + " res2: " + res2 + " r: " + result);
                }
                return result;
            }
        }
        if (p % W + n <= W) {
            return (DEC(this.bytes[p / W | 0]) & BitString.MaskTop[W][p % W]) >> W - p % W - n;
        } else {
            let result = DEC(this.bytes[p / W | 0]) & BitString.MaskTop[W][p % W];
            const l = W - p % W;
            p += l;
            n -= l;
            while(n >= W){
                result = result << W | DEC(this.bytes[p / W | 0]);
                p += W;
                n -= W;
            }
            if (n > 0) {
                result = result << n | DEC(this.bytes[p / W | 0]) >> W - n;
            }
            return result;
        }
    },
    count: function(p, n) {
        let count = 0;
        while(n >= 16){
            count += BitsSetTable256[this.get(p, 16)];
            p += 16;
            n -= 16;
        }
        return count + BitsSetTable256[this.get(p, n)];
    },
    pos0: function(i, n) {
        if (n < 0) return 0;
        let step = 16;
        let index = i;
        if (config1.fastPos === false) {
            while(n > 0){
                step = n <= 16 ? n : 16;
                const bits0 = step - countSetBits(this.get(i, step));
                n -= bits0;
                i += step;
                index = i - 1;
            }
            return index;
        }
        while(n > 0){
            const d = this.get(i, step);
            const bits0 = step - countSetBits(d);
            if (n - bits0 < 0) {
                step = Math.max(n, step / 2 | 0);
                continue;
            }
            n -= bits0;
            i += step;
            const diff = n === 0 ? bit0(d, 1, step) : 1;
            index = i - diff;
        }
        return index;
    },
    rank: function(x) {
        let rank = 0;
        for(let i = 0; i <= x; i++){
            if (this.get(i, 1)) {
                rank++;
            }
        }
        return rank;
    }
};
function nodeCountFromEncodedDataIfExists(bits, defaultValue) {
    if (!config1.storeMeta) return defaultValue;
    return bits.get(bits.length - 30, 30);
}
function RankDirectory(directoryData, bitData, numBits, l1Size, l2Size, valueDirData) {
    this.init(directoryData, bitData, numBits, l1Size, l2Size, valueDirData);
}
RankDirectory.Create = function(data, nodeCount, l1Size, l2Size) {
    const bits = new BitString(data);
    let p = 0;
    let i = 0;
    let count1 = 0, count2 = 0;
    nodeCount = nodeCountFromEncodedDataIfExists(bits, nodeCount);
    const numBits = nodeCount * 2 + 1;
    const l1bits = Math.ceil(Math.log2(numBits));
    const l2bits = Math.ceil(Math.log2(l1Size));
    const bitCount = config1.compress && !config1.unroll ? 7 : 6;
    const valuesIndex = numBits + bitCount * nodeCount;
    const directory = new BitWriter();
    const valueDir = new BitWriter();
    if (config1.selectsearch === false) {
        while(p + l2Size <= numBits){
            count2 += bits.count(p, l2Size);
            i += l2Size;
            p += l2Size;
            if (i === l1Size) {
                count1 += count2;
                directory.write(count1, l1bits);
                count2 = 0;
                i = 0;
            } else {
                directory.write(count2, l2bits);
            }
        }
    } else {
        let i = 0;
        while(i + l2Size <= numBits){
            const sel = bits.pos0(i, l2Size);
            directory.write(sel, l1bits);
            i = sel + 1;
        }
    }
    const bitslenindex = Math.ceil(Math.log2(nodeCount));
    const bitslenpos = Math.ceil(Math.log2(bits.length - valuesIndex));
    const bitslenvalue = 16;
    valueDir.write(0, bitslenpos);
    let j = 1;
    for(let i1 = valuesIndex, b = valuesIndex; i1 + bitslenindex + bitslenvalue < bits.length;){
        const currentIndex = bits.get(i1, bitslenindex);
        const currentValueHeader = bits.get(i1 + bitslenindex, bitslenvalue);
        const currentValueLength = (countSetBits(currentValueHeader) + 1) * bitslenvalue;
        const pos = currentIndex / V1 | 0;
        while(pos != 0 && pos >= j){
            b = pos === j ? i1 : b;
            const v = b - valuesIndex;
            valueDir.write(v, bitslenpos);
            j += 1;
        }
        i1 += currentValueLength + bitslenindex;
    }
    return new RankDirectory(directory.getData(), data, numBits, l1Size, l2Size, valueDir.getData());
};
RankDirectory.prototype = {
    init: function(directoryData, trieData, numBits, l1Size, l2Size, valueDir) {
        this.directory = new BitString(directoryData);
        if (valueDir) this.valueDir = new BitString(valueDir);
        this.data = new BitString(trieData);
        this.l1Size = l1Size;
        this.l2Size = l2Size;
        this.l1Bits = Math.ceil(Math.log2(numBits));
        this.l2Bits = Math.ceil(Math.log2(l1Size));
        this.sectionBits = (l1Size / l2Size - 1) * this.l2Bits + this.l1Bits;
        this.numBits = numBits;
    },
    getData: function() {
        return this.directory.getData();
    },
    rank: function(which, x) {
        if (config1.selectsearch) {
            let rank = -1;
            let sectionPos = 0;
            if (x >= this.l2Size) {
                sectionPos = (x / this.l2Size | 0) * this.l1Bits;
                rank = this.directory.get(sectionPos - this.l1Bits, this.l1Bits);
                x = x % this.l2Size;
            }
            const ans = x > 0 ? this.data.pos0(rank + 1, x) : rank;
            if (config1.debug) {
                console.log("ans: " + ans + " " + rank + ":r, x: " + x + " " + sectionPos + ":s " + this.l1Bits + ": l1");
            }
            return ans;
        }
        if (which === 0) {
            return x - this.rank(1, x) + 1;
        }
        let rank = 0;
        let o = x;
        let sectionPos = 0;
        if (o >= this.l1Size) {
            sectionPos = (o / this.l1Size | 0) * this.sectionBits;
            rank = this.directory.get(sectionPos - this.l1Bits, this.l1Bits);
            o = o % this.l1Size;
        }
        if (o >= this.l2Size) {
            sectionPos += (o / this.l2Size | 0) * this.l2Bits;
            rank += this.directory.get(sectionPos - this.l2Bits, this.l2Bits);
        }
        rank += this.data.count(x - x % this.l2Size, x % this.l2Size + 1);
        return rank;
    },
    select: function(which, y) {
        let high = this.numBits;
        let low = -1;
        let val = -1;
        let iter = 0;
        if (config1.selectsearch) {
            return this.rank(0, y);
        }
        while(high - low > 1){
            const probe = (high + low) / 2 | 0;
            const r = this.rank(which, probe);
            iter += 1;
            if (r === y) {
                val = probe;
                high = probe;
            } else if (r < y) {
                low = probe;
            } else {
                high = probe;
            }
        }
        return val;
    }
};
function TrieNode(letter) {
    this.letter = letter;
    this.final = false;
    this.children = [];
    this.compressed = false;
    this.flag = config1.valueNode ? false : undefined;
}
function TrieNode2(letter) {
    this.letter = letter;
    this.compressed = false;
    this.final = false;
    this.children = undefined;
    this.flag = undefined;
}
function Trie() {
    this.init();
}
Trie.prototype = {
    init: function() {
        this.previousWord = "";
        this.root = new TrieNode([
            0
        ]);
        this.cache = [
            this.root
        ];
        this.nodeCount = 1;
        this.invoke = 0;
        this.stats = {
        };
        this.inspect = {
        };
        this.flags = {
        };
        this.rflags = {
        };
        this.fsize = 0;
        this.indexBitsArray = [
            "0"
        ];
    },
    getNodeCount: function() {
        return this.nodeCount;
    },
    getFlagNodeIfExists (children) {
        if (config1.valueNode && children && children.length > 0) {
            const flagNode = children[0];
            if (flagNode.flag === true) return flagNode;
        }
        return undefined;
    },
    setupFlags: function(flags) {
        let i = 0;
        for (const f of flags){
            this.flags[f] = i++;
        }
        this.rflags = flags;
        this.fsize = Math.ceil(Math.log2(flags.length) / 16) + 1;
    },
    flagsToTag: function(flags) {
        const header = flags[0];
        const tagIndices = [];
        const values = [];
        for(let i = 0, mask = 32768; i < 16; i++){
            if (header << i === 0) break;
            if ((header & mask) === mask) {
                tagIndices.push(i);
            }
            mask = mask >>> 1;
        }
        if (tagIndices.length !== flags.length - 1) {
            console.log(tagIndices, flags, " flags and header mismatch (bug in upsert?)");
            return values;
        }
        for(let i1 = 0; i1 < flags.length; i1++){
            const flag = flags[i1 + 1];
            const index = tagIndices[i1];
            for(let j = 0, mask = 32768; j < 16; j++){
                if (flag << j === 0) break;
                if ((flag & mask) === mask) {
                    const pos = index * 16 + j;
                    if (config1.debug) {
                        console.log("pos ", pos, "index/tagIndices", index, tagIndices, "j/i", j, i1);
                    }
                    values.push(this.rflags[pos]);
                }
                mask = mask >>> 1;
            }
        }
        return values;
    },
    upsertFlag: function(node, flag) {
        let res;
        let fnode;
        let val;
        let newlyAdded = false;
        if (config1.valueNode === true) {
            const first = node.children[0];
            const isNodeFlag = first && first.flag;
            if (!flag || flag.length === 0) {
                if (!isNodeFlag) return;
                node.children = node.children.slice(1);
                node.flag = false;
                this.nodeCount -= first.letter.length * 2;
                return;
            }
            flag = TxtDec.decode(flag);
            val = this.flags[flag];
            if (typeof val === "undefined") {
                console.log("val undef ", node);
                return;
            }
            const flagNode = isNodeFlag ? first : new TrieNode(CHR16(0));
            if (!isNodeFlag) {
                const all = node.children;
                node.children = [
                    flagNode
                ];
                node.children.concat(all);
                newlyAdded = true;
            }
            flagNode.flag = true;
            res = flagNode.letter;
            fnode = flagNode;
        } else {
            if (!flag || flag.length === 0) {
                this.nodeCount -= node.flag.length * 2;
                node.flag = undefined;
                return;
            }
            flag = TxtDec.decode(flag);
            val = this.flags[flag];
            if (typeof val === "undefined") {
                return;
            }
            if (typeof node.flag === "undefined") {
                node.flag = CHR16(0);
                newlyAdded = true;
            }
            res = node.flag;
            fnode = node;
        }
        const header = 0;
        const index = (val / 16 | 0) + 1;
        const pos = val % 16;
        const resnodesize = !newlyAdded ? res.length * 2 : 0;
        let h = DEC16(res[header]);
        let n = (h >>> 15 - (index - 1) & 1) !== 1 ? 0 : DEC16(res[index]);
        h |= 1 << 15 - (index - 1);
        n |= 1 << 15 - pos;
        res = CHR16(h) + res.slice(1, index) + CHR16(n) + res.slice(index + 1);
        const newresnodesize = res.length * 2;
        this.nodeCount = this.nodeCount - resnodesize + newresnodesize;
        if (config1.valueNode === true) {
            fnode.letter = res;
        } else {
            fnode.flag = res;
        }
    },
    insert: function(word) {
        const index = word.lastIndexOf(ENC_DELIM[0]);
        const flag = word.slice(index + 1);
        word = word.slice(0, index);
        if (config1.compress === true) {
            let j = 1;
            let k = 0;
            let p = 0;
            let topped = false;
            while(p < word.length && j < this.cache.length){
                const cw = this.cache[j];
                let l = 0;
                while(p < word.length && l < cw.letter.length){
                    if (word[p] !== cw.letter[l]) {
                        topped = true;
                        break;
                    }
                    p += 1;
                    l += 1;
                }
                k = l > 0 ? l : k;
                j = l > 0 ? j + 1 : j;
                if (topped) break;
            }
            const w = word.slice(p);
            const pos = j - 1;
            const node = this.cache[pos];
            const letter = node.letter.slice(0, k);
            if (pos >= 0) {
                this.cache.splice(pos + 1);
            }
            if (letter.length > 0 && letter.length !== node.letter.length) {
                const split = node.letter.slice(letter.length);
                const tn = new TrieNode(split);
                tn.final = node.final;
                tn.flag = node.flag;
                tn.children = node.children;
                node.letter = letter;
                node.children = [];
                node.children.push(tn);
                node.final = false;
                this.upsertFlag(node, undefined);
            }
            if (w.length === 0) {
                node.final = true;
                this.upsertFlag(node, flag);
            } else {
                if (typeof node === "undefined") {
                    console.log("second add new-node/in-word/match-letter/parent-node", w, word, letter, searchPos);
                }
                const second = new TrieNode(w);
                second.final = true;
                this.upsertFlag(second, flag);
                this.nodeCount += w.length;
                node.children.push(second);
                this.cache.push(second);
            }
            this.previousWord = word;
            return;
        }
        let commonPrefix = 0;
        let i = 0;
        let node;
        while(i < Math.min(word.length, this.previousWord.length)){
            if (word[i] !== this.previousWord[i]) break;
            commonPrefix += 1;
            i += 1;
        }
        this.cache.splice(commonPrefix + 1);
        node = this.cache[this.cache.length - 1];
        for(i = commonPrefix; i < word.length; i++){
            const next = new TrieNode(word[i]);
            this.nodeCount += 1;
            node.children.push(next);
            this.cache.push(next);
            node = next;
        }
        node.final = true;
        this.upsertFlag(node, flag);
        this.previousWord = word;
    },
    apply: function(fn) {
        const level = [
            this.root
        ];
        while(level.length > 0){
            const node = level.shift();
            for(let i = 0; i < node.children.length; i++){
                level.push(node.children[i]);
            }
            fn(this, node);
        }
    },
    levelorder: function() {
        const level = [
            this.root
        ];
        let p = 0;
        let q = 0;
        const ord = [];
        const inspect = {
        };
        let nbb = 0;
        for(let n = 0; n < level.length; n++){
            const node = level[n];
            if (config1.valueNode && node.flag === true) continue;
            const childrenLength = node.children ? node.children.length : 0;
            q += childrenLength;
            if (n === p) {
                ord.push(q);
                p = q;
            }
            let start = 0;
            let flen = 0;
            const flagNode = this.getFlagNodeIfExists(node.children);
            if (flagNode) {
                start = 1;
                if (typeof flagNode.letter === "undefined" || typeof flagNode === "undefined") {
                    console.log("flagnode letter undef ", flagNode, " node ", node);
                }
                const encValue = new BitString(flagNode.letter).encode(8);
                flen = encValue.length;
                for(let i = 0; i < encValue.length; i++){
                    const l = encValue[i];
                    const aux = new TrieNode2([
                        l
                    ]);
                    aux.flag = true;
                    level.push(aux);
                }
                nbb += 1;
            }
            for(let i = start; i < childrenLength; i++){
                const current = node.children[i];
                inspect[current.letter.length] = (inspect[current.letter.length + flen] | 0) + 1;
                for(let j = 0; j < current.letter.length - 1; j++){
                    const l = current.letter[j];
                    const aux = new TrieNode2([
                        l
                    ]);
                    aux.compressed = true;
                    level.push(aux);
                }
                level.push(current);
            }
        }
        console.log(inspect);
        return {
            level: level,
            div: ord
        };
    },
    indexBits: function(index) {
        if (index > 0 && !this.indexBitsArray[index]) {
            this.indexBitsArray[index] = new String().padStart(index, "1") + "0";
        }
        return this.indexBitsArray[index];
    },
    encode: function() {
        const finalMask = 256;
        const compressedMask = 512;
        const flagMask = 768;
        this.invoke += 1;
        const bits = new BitWriter();
        const chars = [];
        const vals = [];
        const indices = [];
        bits.write(2, 2);
        this.stats = {
            children: 0,
            single: new Array(256).fill(0)
        };
        let start = new Date().getTime();
        const levelorder = this.levelorder();
        const level = levelorder.level;
        levelorder.div;
        let nbb = 0;
        console.log("levlen", level.length, "nodecount", this.nodeCount, " masks ", compressedMask, flagMask, finalMask);
        const l10 = level.length / 10 | 0;
        for(let i = 0; i < level.length; i++){
            const node = level[i];
            const childrenLength = node.children ? node.children.length : 0;
            const size = config1.compress && !config1.unroll ? childrenSize(node) : childrenLength;
            nbb += size;
            if (i % l10 == 0) console.log("at encode[i]: " + i);
            this.stats.single[childrenLength] += 1;
            for(let j = 0; j < size; j++){
                bits.write(1, 1);
            }
            bits.write(0, 1);
            if (config1.compress && !config1.unroll) {
                const letter = node.letter[node.letter.length - 1];
                let value = letter;
                if (node.final) {
                    value |= finalMask;
                    this.stats.children += 1;
                    if (!config1.valueNode) {
                        vals.push(node.flag);
                        indices.push(i);
                    }
                }
                if (node.compressed) {
                    value |= compressedMask;
                }
                if (config1.valueNode && node.flag === true) {
                    value |= flagMask;
                }
                chars.push(value);
            } else {
                const letter = node.letter[0];
                let value = letter;
                if (node.final) {
                    value |= finalMask;
                    this.stats.children += 1;
                    if (!config1.valueNode) {
                        vals.push(node.flag);
                        indices.push(i);
                    }
                }
                chars.push(value);
            }
        }
        const elapsed2 = new Date().getTime() - start;
        start = new Date().getTime();
        const extraBit = config1.compress && !config1.unroll ? 1 : 0;
        const bitslen = extraBit + 9;
        console.log("charslen: " + chars.length + ", bitslen: " + bitslen, " letterstart", bits.top);
        let k = 0;
        for (const c of chars){
            if (k % (chars.length / 10 | 0) == 0) console.log("charslen: " + k);
            bits.write(c, bitslen);
            k += 1;
        }
        const elapsed = new Date().getTime() - start;
        console.log(this.invoke + " csize: " + nbb + " elapsed write.keys: " + elapsed2 + " elapsed write.values: " + elapsed + " stats: f: " + this.stats.children + ", c:" + this.stats.single);
        if (config1.valueNode === false) {
            const bitslenindex = Math.ceil(Math.log2(t.getNodeCount()));
            const bitslenvalue = 16;
            for(let i = 0; i < vals.length; i++){
                const index = indices[i];
                const value = vals[i];
                bits.write(index, bitslenindex);
                for (const v of value){
                    bits.write(DEC16(v), bitslenvalue);
                }
            }
        }
        if (config1.storeMeta) {
            console.log("metadata-start ", bits.top);
            bits.write(this.nodeCount, MFIELDBITS);
        }
        return bits.getData();
    }
};
function childrenSize(tn) {
    let size = 0;
    if (!tn.children) return size;
    if (config1.valueNode === true) {
        for (const c of tn.children){
            let len = c.letter.length;
            if (c.flag) {
                len = len * 2;
            }
            size += len;
        }
        return size;
    }
    for (const c of tn.children){
        size += c.letter.length;
    }
    return size;
}
function FrozenTrieNode(trie, index) {
    this.trie = trie;
    this.index = index;
    let finCached, whCached, comCached, fcCached, chCached, valCached, flagCached;
    this.final = ()=>{
        if (typeof finCached === "undefined") {
            finCached = this.trie.data.get(this.trie.letterStart + index * this.trie.bitslen + this.trie.extraBit, 1) === 1;
        }
        return finCached;
    };
    this.where = ()=>{
        if (typeof whCached === "undefined") {
            whCached = this.trie.data.get(this.trie.letterStart + index * this.trie.bitslen + 1 + this.trie.extraBit, this.trie.bitslen - 1 - this.trie.extraBit);
        }
        return whCached;
    };
    this.compressed = ()=>{
        if (typeof comCached === "undefined") {
            comCached = (config1.compress && !config1.unroll ? this.trie.data.get(this.trie.letterStart + index * this.trie.bitslen, 1) : 0) === 1;
        }
        return comCached;
    };
    this.flag = ()=>{
        if (typeof flagCached === "undefined") {
            flagCached = config1.valueNode ? this.compressed() && this.final() : false;
        }
        return flagCached;
    };
    this.letter = ()=>this.where()
    ;
    this.firstChild = ()=>{
        if (!fcCached) fcCached = this.trie.directory.select(0, index + 1) - index;
        return fcCached;
    };
    if (config1.debug) {
        console.log(index + " :i, fc: " + this.firstChild() + " tl: " + this.letter() + " c: " + this.compressed() + " f: " + this.final() + " wh: " + this.where() + " flag: " + this.flag());
    }
    this.childOfNextNode = ()=>{
        if (!chCached) {
            chCached = this.trie.directory.select(0, index + 2) - index - 1;
        }
        return chCached;
    };
    this.childCount = ()=>this.childOfNextNode() - this.firstChild()
    ;
    this.value = config1.valueNode ? ()=>{
        if (typeof valCached === "undefined") {
            const value = [];
            let i = 0;
            let j = 0;
            if (config1.debug) {
                console.log("thisnode: index/vc/ccount ", this.index, this.letter(), this.childCount());
            }
            while(i < this.childCount()){
                const valueChain = this.getChild(i);
                if (config1.debug) {
                    console.log("vc no-flag end vlet/vflag/vindex/val ", i, valueChain.letter(), valueChain.flag(), valueChain.index, value);
                }
                if (!valueChain.flag()) {
                    break;
                }
                if (i % 2 === 0) {
                    value.push(valueChain.letter() << 8);
                } else {
                    value[j] = value[j] | valueChain.letter();
                    j += 1;
                }
                i += 1;
            }
            valCached = value;
        }
        return valCached;
    } : ()=>{
        if (typeof valCached === "undefined") {
            const vdir = this.trie.directory.valueDir;
            const data = this.trie.data;
            const start = this.trie.valuesStart;
            const end = data.length;
            const vdirlen = this.trie.valuesDirBitsLength;
            const vindexlen = this.trie.valuesIndexLength;
            const vlen = 16;
            const p = (this.index / V1 | 0) * vdirlen;
            const bottomIndex = start + vdir.get(p, vdirlen);
            for(let i = bottomIndex; i < end;){
                const currentIndex = data.get(i, vindexlen);
                const vheader = data.get(i + vindexlen, vlen);
                const vcount = countSetBits(vheader);
                if (currentIndex === this.index) {
                    const vflag = [];
                    vflag.push(vheader);
                    for(let k = 1; k <= vcount; k++){
                        const f = data.get(i + vindexlen + k * vlen, vlen);
                        vflag.push(f);
                    }
                    valCached = vflag;
                    break;
                } else if (currentIndex > this.index) {
                    valCached = -1;
                    break;
                } else if (currentIndex < this.index) {
                    const vhop = (vcount + 1) * vlen;
                    i += vhop + vindexlen;
                }
            }
        }
        return valCached;
    };
}
FrozenTrieNode.prototype = {
    getChildCount: function() {
        return this.childCount();
    },
    getChild: function(index) {
        return this.trie.getNodeByIndex(this.firstChild() + index);
    }
};
function FrozenTrie(data, rdir, nodeCount) {
    this.init(data, rdir, nodeCount);
}
FrozenTrie.prototype = {
    init: function(trieData, rdir, nodeCount) {
        this.data = new BitString(trieData);
        this.directory = rdir;
        nodeCount = nodeCountFromEncodedDataIfExists(this.data, nodeCount);
        this.extraBit = config1.compress && !config1.unroll ? 1 : 0;
        this.bitslen = 9 + this.extraBit;
        this.letterStart = nodeCount * 2 + 1;
        this.valuesStart = this.letterStart + nodeCount * this.bitslen;
        this.valuesIndexLength = Math.ceil(Math.log2(nodeCount));
        this.valuesDirBitsLength = Math.ceil(Math.log2(this.data.length - this.valuesStart));
    },
    getNodeByIndex: function(index) {
        return new FrozenTrieNode(this, index);
    },
    getRoot: function() {
        return this.getNodeByIndex(0);
    },
    lookup: function(word) {
        const index = word.lastIndexOf(ENC_DELIM[0]);
        if (index > 0) word = word.slice(0, index);
        const debug = config1.debug;
        let node = this.getRoot();
        let child;
        const periodEncVal = TxtEnc.encode(".");
        let returnValue = false;
        for(let i = 0; i < word.length; i++){
            let isFlag = -1;
            let that;
            if (periodEncVal[0] == word[i]) {
                if (node.final()) {
                    if (returnValue == false) returnValue = new Map();
                    returnValue.set(TxtDec.decode(word.slice(0, i).reverse()), node.value());
                }
            }
            do {
                that = node.getChild(isFlag + 1);
                if (!that.flag()) break;
                isFlag += 1;
            }while (isFlag + 1 < node.getChildCount())
            const minChild = isFlag;
            if (debug) {
                console.log("            count: " + node.getChildCount() + " i: " + i + " w: " + word[i] + " nl: " + node.letter() + " flag: " + isFlag);
            }
            if (node.getChildCount() - 1 <= minChild) {
                if (debug) {
                    console.log("  no more children left, remaining word: " + word.slice(i));
                }
                return returnValue;
            }
            if (config1.useBinarySearch === false) {
                let j = isFlag;
                for(; j < node.getChildCount(); j++){
                    child = node.getChild(j);
                    if (debug) {
                        console.log("it: " + j + " tl: " + child.letter() + " wl: " + word[i]);
                    }
                    if (child.letter() == word[i]) {
                        if (debug) console.log("it: " + j + " break ");
                        break;
                    }
                }
                if (j === node.getChildCount()) {
                    if (debug) console.log("j: " + j + " c: " + node.getChildCount());
                    return returnValue;
                }
            } else if (config1.compress === true && !config1.unroll) {
                let high = node.getChildCount();
                let low = isFlag;
                while(high - low > 1){
                    const probe = (high + low) / 2 | 0;
                    child = node.getChild(probe);
                    const prevchild = probe > isFlag ? node.getChild(probe - 1) : undefined;
                    if (debug) {
                        console.log("        current: " + child.letter() + " l: " + low + " h: " + high + " w: " + word[i]);
                    }
                    if (child.compressed() || prevchild && prevchild.compressed() && !prevchild.flag()) {
                        const startchild = [];
                        const endchild = [];
                        let start = 0;
                        let end = 0;
                        startchild.push(child);
                        start += 1;
                        do {
                            const temp = node.getChild(probe - start);
                            if (!temp.compressed()) break;
                            if (temp.flag()) break;
                            startchild.push(temp);
                            start += 1;
                        }while (true)
                        if (startchild[start - 1].letter() > word[i]) {
                            if (debug) {
                                console.log("        shrinkh start: " + startchild[start - 1].letter() + " s: " + start + " w: " + word[i]);
                            }
                            high = probe - start + 1;
                            if (high - low <= 1) {
                                if (debug) {
                                    console.log("...h-low: " + (high - low) + " c: " + node.getChildCount(), high, low, child.letter(), word[i], probe);
                                }
                                return returnValue;
                            }
                            continue;
                        }
                        if (child.compressed()) {
                            do {
                                end += 1;
                                const temp = node.getChild(probe + end);
                                endchild.push(temp);
                                if (!temp.compressed()) break;
                            }while (true)
                        }
                        if (startchild[start - 1].letter() < word[i]) {
                            if (debug) {
                                console.log("        shrinkl start: " + startchild[start - 1].letter() + " s: " + start + " w: " + word[i]);
                            }
                            low = probe + end;
                            if (high - low <= 1) {
                                if (debug) {
                                    console.log("...h-low: " + (high - low) + " c: " + node.getChildCount(), high, low, child.letter(), word[i], probe);
                                }
                                return returnValue;
                            }
                            continue;
                        }
                        const nodes = startchild.reverse().concat(endchild);
                        const comp = nodes.map((n)=>n.letter()
                        );
                        const w = word.slice(i, i + comp.length);
                        if (debug) {
                            console.log("it: " + probe + " tl: " + comp + " wl: " + w + " c: " + child.letter());
                        }
                        if (w.length < comp.length) return returnValue;
                        for(let i1 = 0; i1 < comp.length; i1++){
                            if (w[i1] !== comp[i1]) return returnValue;
                        }
                        if (debug) console.log("it: " + probe + " break ");
                        child = nodes[nodes.length - 1];
                        i += comp.length - 1;
                        break;
                    } else {
                        if (child.letter() === word[i]) {
                            break;
                        } else if (word[i] > child.letter()) {
                            low = probe;
                        } else {
                            high = probe;
                        }
                    }
                    if (high - low <= 1) {
                        if (debug) {
                            console.log("h-low: " + (high - low) + " c: " + node.getChildCount(), high, low, child.letter(), word[i], probe);
                        }
                        return returnValue;
                    }
                }
            } else {
                let high = node.getChildCount();
                let low = -1;
                while(high - low > 1){
                    const probe = (high + low) / 2 | 0;
                    child = node.getChild(probe);
                    if (debug) {
                        console.log("it: " + probe + " tl: " + child.letter() + " wl: " + word[i]);
                    }
                    if (child.letter() === word[i]) {
                        if (debug) console.log("it: " + probe + " break ");
                        break;
                    } else if (word[i] > child.letter()) {
                        low = probe;
                    } else {
                        high = probe;
                    }
                }
                if (high - low <= 1) {
                    if (debug) {
                        console.log("h-low: " + (high - low) + " c: " + node.getChildCount());
                    }
                    return returnValue;
                }
            }
            if (debug) console.log("        next: " + child.letter());
            node = child;
        }
        if (node.final()) {
            if (returnValue == false) returnValue = new Map();
            returnValue.set(TxtDec.decode(word.reverse()), node.value());
        }
        return returnValue;
    }
};
function customTagToFlag(fl, blocklistFileTag) {
    let res = CHR16(0);
    for (const flag of fl){
        const val = blocklistFileTag[flag].value;
        const header = 0;
        const index = val / 16 | 0;
        const pos = val % 16;
        let h = 0;
        h = DEC16(res[header]);
        const dataIndex = countSetBits(h & BitString.MaskBottom[16][16 - index]) + 1;
        let n = (h >>> 15 - index & 1) !== 1 ? 0 : DEC16(res[dataIndex]);
        const upsertData = n !== 0;
        h |= 1 << 15 - index;
        n |= 1 << 15 - pos;
        res = CHR16(h) + res.slice(1, dataIndex) + CHR16(n) + res.slice(upsertData ? dataIndex + 1 : dataIndex);
    }
    return res;
}
let tag, fl;
function createBlocklistFilter(tdBuffer, rdBuffer, blocklistFileTag, blocklistBasicConfig) {
    try {
        tag = {
        };
        fl = [];
        for(const fileuname in blocklistFileTag){
            if (!blocklistFileTag.hasOwnProperty(fileuname)) continue;
            fl[blocklistFileTag[fileuname].value] = fileuname;
            const v = DELIM + blocklistFileTag[fileuname].uname;
            tag[fileuname] = v.split("").reverse().join("");
        }
        initialize();
        const t = new Trie();
        t.setupFlags(fl);
        const td = new bufferView[W](tdBuffer);
        let rd = new bufferView[W](rdBuffer);
        rd = new RankDirectory(rd, td, blocklistBasicConfig.nodecount * 2 + 1, L1, L2, null);
        const ft = new FrozenTrie(td, rd, blocklistBasicConfig.nodecount);
        config1.useBuffer = true;
        config1.valueNode = true;
        return {
            t: t,
            ft: ft
        };
    } catch (e) {
        throw e;
    }
}
const ALPHA32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function readChar(chr) {
    chr = chr.toUpperCase();
    const idx = ALPHA32.indexOf(chr);
    if (idx === -1) {
        throw new Error("invalid b32 character: " + chr);
    }
    return idx;
}
function rbase32(input) {
    input = input.replace(/=+$/, "");
    const length = input.length;
    let bits = 0;
    let value = 0;
    let index = 0;
    let output = new Uint8Array(length * 5 / 8 | 0);
    for(var i = 0; i < length; i++){
        value = value << 5 | readChar(input[i]);
        bits += 5;
        if (bits >= 8) {
            output[index++] = value >>> bits - 8 & 255;
            bits -= 8;
        }
    }
    return output;
}
class BlocklistFilter {
    constructor(t, ft, blocklistBasicConfig, blocklistFileTag){
        this.t = t;
        this.ft = ft;
        this.blocklistBasicConfig = blocklistBasicConfig;
        this.blocklistFileTag = blocklistFileTag;
        this.domainNameCache = new LocalCache("Domain-Name-Cache", 5000);
        this.wildCardLists = new Set();
        setWildcardlist.call(this);
        const str = customTagToFlag(this.wildCardLists, this.blocklistFileTag);
        this.wildCardUint = new Uint16Array(str.length);
        for(let i = 0; i < this.wildCardUint.length; i++){
            this.wildCardUint[i] = str.charCodeAt(i);
        }
    }
    getDomainInfo(domainName) {
        domainName = domainName.trim().toLowerCase();
        let domainNameInfo = this.domainNameCache.Get(domainName);
        if (!domainNameInfo) {
            domainNameInfo = {
            };
            domainNameInfo.k = domainName;
            domainNameInfo.data = {
            };
            domainNameInfo.data.searchResult = this.hadDomainName(domainName);
        }
        this.domainNameCache.Put(domainNameInfo);
        return domainNameInfo;
    }
    hadDomainName(domainName) {
        const enc = new TextEncoder();
        return this.ft.lookup(enc.encode(domainName).reverse());
    }
    getTag(uintFlag) {
        return this.t.flagsToTag(uintFlag);
    }
    unstamp(flag) {
        return toUint(flag);
    }
    flagIntersection(flag1, flag2) {
        try {
            let flag1Header = flag1[0];
            let flag2Header = flag2[0];
            let intersectHeader = flag1Header & flag2Header;
            if (intersectHeader == 0) {
                return false;
            }
            let flag1Length = flag1.length - 1;
            let flag2Length = flag2.length - 1;
            const intersectBody = [];
            let tmpInterectHeader = intersectHeader;
            let maskHeaderForBodyEmpty = 1;
            let tmpBodyIntersect;
            for(; tmpInterectHeader != 0;){
                if ((flag1Header & 1) == 1) {
                    if ((tmpInterectHeader & 1) == 1) {
                        tmpBodyIntersect = flag1[flag1Length] & flag2[flag2Length];
                        if (tmpBodyIntersect == 0) {
                            intersectHeader = intersectHeader ^ maskHeaderForBodyEmpty;
                        } else {
                            intersectBody.push(tmpBodyIntersect);
                        }
                    }
                    flag1Length = flag1Length - 1;
                }
                if ((flag2Header & 1) == 1) {
                    flag2Length = flag2Length - 1;
                }
                flag1Header = flag1Header >>> 1;
                tmpInterectHeader = tmpInterectHeader >>> 1;
                flag2Header = flag2Header >>> 1;
                maskHeaderForBodyEmpty = maskHeaderForBodyEmpty * 2;
            }
            if (intersectHeader == 0) {
                return false;
            }
            const intersectFlag = new Uint16Array(intersectBody.length + 1);
            let count = 0;
            intersectFlag[count++] = intersectHeader;
            let bodyData;
            while((bodyData = intersectBody.pop()) != undefined){
                intersectFlag[count++] = bodyData;
            }
            return intersectFlag;
        } catch (e) {
            throw e;
        }
    }
    customTagToFlag(tagList) {
        return customTagToFlag(tagList, this.blocklistFileTag);
    }
    getB64FlagFromTag(tagList, flagVersion) {
        try {
            if (flagVersion == "0") {
                return encodeURIComponent(Buffer.from(customTagToFlag(tagList, this.blocklistFileTag)).toString("base64"));
            } else if (flagVersion == "1") {
                return "1:" + encodeURI(btoa(encodeToBinary(customTagToFlag(tagList, this.blocklistFileTag))).replace(/\//g, "_").replace(/\+/g, "-"));
            }
        } catch (e) {
            throw e;
        }
    }
    getB64FlagFromUint16(arr, flagVersion) {
        try {
            if (flagVersion == "0") {
                return encodeURIComponent(Buffer.from(arr).toString("base64"));
            } else if (flagVersion == "1") {
                return "1:" + encodeURI(btoa(encodeUint16arrToBinary(arr)).replace(/\//g, "_").replace(/\+/g, "-"));
            }
        } catch (e) {
            throw e;
        }
    }
}
function encodeUint16arrToBinary(uint16Arr) {
    return String.fromCharCode(...new Uint8Array(uint16Arr.buffer));
}
function encodeToBinary(s) {
    const codeUnits = new Uint16Array(s.length);
    for(let i = 0; i < codeUnits.length; i++){
        codeUnits[i] = s.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
}
const b64delim = ":";
const b32delim = "+";
function isB32(s) {
    return s.indexOf(b32delim) > 0;
}
function version(s) {
    if (s && s.length > 1) return s[0];
    else return "0";
}
function toUint(flag) {
    try {
        const response = {
        };
        response.userBlocklistFlagUint = "";
        response.flagVersion = "0";
        flag = flag ? flag.trim() : "";
        if (flag.length <= 0) {
            return response;
        }
        const isFlagB32 = isB32(flag);
        let s = flag.split(isFlagB32 ? b32delim : b64delim);
        let convertor = (x)=>""
        ;
        let f = "";
        const v = version(s);
        if (v == "0") {
            convertor = Base64ToUint;
            f = s[0];
        } else if (v == "1") {
            convertor = isFlagB32 ? Base32ToUint_v1 : Base64ToUint_v1;
            f = s[1];
        } else {
            throw new Error("unknown blocklist stamp version in " + s);
        }
        response.flagVersion = v;
        response.userBlocklistFlagUint = convertor(f) || "";
        return response;
    } catch (e) {
        throw e;
    }
}
function Base64ToUint(b64Flag) {
    const buff = Buffer.from(decodeURIComponent(b64Flag), "base64");
    const str = buff.toString("utf-8");
    const uint = [];
    for(let i = 0; i < str.length; i++){
        uint[i] = str.charCodeAt(i);
    }
    return uint;
}
function Base64ToUint_v1(b64Flag) {
    let str = decodeURI(b64Flag);
    str = decodeFromBinary(atob(str.replace(/_/g, "/").replace(/-/g, "+")));
    const uint = [];
    for(let i = 0; i < str.length; i++){
        uint[i] = str.charCodeAt(i);
    }
    return uint;
}
function Base32ToUint_v1(flag) {
    let str = decodeURI(flag);
    str = decodeFromBinaryArray(rbase32(str));
    const uint = [];
    for(let i = 0; i < str.length; i++){
        uint[i] = str.charCodeAt(i);
    }
    return uint;
}
function decodeFromBinary(b, u8) {
    if (u8) return String.fromCharCode(...new Uint16Array(b.buffer));
    const bytes = new Uint8Array(b.length);
    for(let i = 0; i < bytes.length; i++){
        bytes[i] = b.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
}
function decodeFromBinaryArray(b) {
    return decodeFromBinary(b, true);
}
function setWildcardlist() {
    this.wildCardLists.add("KBI");
    this.wildCardLists.add("YWG");
    this.wildCardLists.add("SMQ");
    this.wildCardLists.add("AQX");
    this.wildCardLists.add("BTG");
    this.wildCardLists.add("GUN");
    this.wildCardLists.add("KSH");
    this.wildCardLists.add("WAS");
    this.wildCardLists.add("AZY");
    this.wildCardLists.add("GWB");
    this.wildCardLists.add("YMG");
    this.wildCardLists.add("CZM");
    this.wildCardLists.add("ZVO");
    this.wildCardLists.add("YOM");
    this.wildCardLists.add("THR");
    this.wildCardLists.add("RPW");
    this.wildCardLists.add("AMG");
    this.wildCardLists.add("WTJ");
    this.wildCardLists.add("ZXU");
    this.wildCardLists.add("FJG");
    this.wildCardLists.add("NYS");
    this.wildCardLists.add("OKG");
    this.wildCardLists.add("KNP");
    this.wildCardLists.add("FLI");
    this.wildCardLists.add("RYX");
    this.wildCardLists.add("CIH");
    this.wildCardLists.add("PTE");
    this.wildCardLists.add("KEA");
    this.wildCardLists.add("CMR");
    this.wildCardLists.add("DDO");
    this.wildCardLists.add("VLM");
    this.wildCardLists.add("JEH");
    this.wildCardLists.add("XLX");
    this.wildCardLists.add("OQW");
    this.wildCardLists.add("FXC");
    this.wildCardLists.add("HZJ");
    this.wildCardLists.add("SWK");
    this.wildCardLists.add("VAM");
    this.wildCardLists.add("AOS");
    this.wildCardLists.add("FAL");
    this.wildCardLists.add("CZK");
    this.wildCardLists.add("FZB");
    this.wildCardLists.add("PYW");
    this.wildCardLists.add("JXA");
    this.wildCardLists.add("KOR");
    this.wildCardLists.add("DEP");
    this.wildCardLists.add("RFX");
    this.wildCardLists.add("RAF");
    this.wildCardLists.add("RKG");
    this.wildCardLists.add("GLV");
    this.wildCardLists.add("FHW");
    this.wildCardLists.add("AGZ");
    this.wildCardLists.add("IVN");
    this.wildCardLists.add("FIB");
    this.wildCardLists.add("FGF");
    this.wildCardLists.add("FLL");
    this.wildCardLists.add("IVO");
    this.wildCardLists.add("ALQ");
}
class BlocklistWrapper {
    constructor(){
        this.blocklistFilter = null;
        this.startTime;
        this.isBlocklistUnderConstruction = false;
        this.isException = false;
        this.exceptionFrom = "";
        this.exceptionStack = "";
    }
    async RethinkModule(param) {
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = {
        };
        try {
            let now = Date.now();
            if (this.blocklistFilter == null && this.isBlocklistUnderConstruction == false) {
                this.isBlocklistUnderConstruction = true;
                this.startTime = Date.now();
                return await this.initBlocklistConstruction(param.blocklistUrl, param.latestTimestamp, param.tdNodecount, param.tdParts);
            } else if (this.blocklistFilter == null && this.isBlocklistUnderConstruction == true && now - this.startTime > param.workerTimeout) {
                this.startTime = Date.now();
                this.isException = false;
                return await this.initBlocklistConstruction(param.blocklistUrl, param.latestTimestamp, param.tdNodecount, param.tdParts);
            } else {
                let retryCount = 0;
                while(this.isBlocklistUnderConstruction == true && this.isException == false){
                    if (retryCount >= 14) {
                        break;
                    }
                    await sleep(50);
                    retryCount++;
                }
                if (this.blocklistFilter != null) {
                    response.data.blocklistFilter = this.blocklistFilter;
                } else if (this.isException == true) {
                    response.isException = true;
                    response.exceptionStack = this.exceptionStack;
                    response.exceptionFrom = this.exceptionFrom;
                } else {
                    response.isException = true;
                    response.exceptionStack = "Problem in loading blocklistFilter - Waiting Timeout";
                    response.exceptionFrom = "blocklistWrapper.js RethinkModule";
                }
            }
        } catch (e) {
            response.isException = true;
            response.exceptionStack = e.stack;
            response.exceptionFrom = "blocklistWrapper.js RethinkModule";
            console.error("Error At -> BlocklistWrapper RethinkModule");
            console.error(e.stack);
        }
        return response;
    }
    async initBlocklistConstruction(blocklistUrl, latestTimestamp, tdNodecount, tdParts) {
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = {
        };
        try {
            let resp = await downloadBuildBlocklist(blocklistUrl, latestTimestamp, tdNodecount, tdParts);
            this.blocklistFilter = new BlocklistFilter(resp.t, resp.ft, resp.blocklistBasicConfig, resp.blocklistFileTag);
            this.isBlocklistUnderConstruction = false;
            response.data.blocklistFilter = this.blocklistFilter;
        } catch (e) {
            response.isException = true;
            response.exceptionStack = e.stack;
            response.exceptionFrom = "blocklistWrapper.js initBlocklistConstruction";
            this.isException = true;
            this.exceptionFrom = response.exceptionFrom;
            this.exceptionStack = response.exceptionStack;
            console.error("Error At -> BlocklistWrapper initBlocklistConstruction");
            console.error(e.stack);
        }
        return response;
    }
}
async function downloadBuildBlocklist(blocklistUrl, latestTimestamp, tdNodecount, tdParts) {
    try {
        let resp = {
        };
        const baseurl = blocklistUrl + latestTimestamp;
        let blocklistBasicConfig = {
            nodecount: tdNodecount || -1,
            tdparts: tdParts || -1
        };
        tdNodecount == null && console.error("tdNodecount missing! Blocking won't work");
        const buf0 = fileFetch(baseurl + "/filetag.json", "json");
        const buf1 = makeTd(baseurl, blocklistBasicConfig.tdparts);
        const buf2 = fileFetch(baseurl + "/rd.txt", "buffer");
        let downloads = await Promise.all([
            buf0,
            buf1,
            buf2
        ]);
        let trie = createBlocklistFilter(downloads[1], downloads[2], downloads[0], blocklistBasicConfig);
        resp.t = trie.t;
        resp.ft = trie.ft;
        resp.blocklistBasicConfig = blocklistBasicConfig;
        resp.blocklistFileTag = downloads[0];
        return resp;
    } catch (e) {
        throw e;
    }
}
async function fileFetch(url, type) {
    const res = await fetch(url, {
        cf: {
            cacheTtl: 1209600
        }
    });
    if (type == "buffer") {
        return await res.arrayBuffer();
    } else if (type == "json") {
        return await res.json();
    }
    throw "Unknown conversion type at fileFetch";
}
const sleep = (ms)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve, ms);
    });
};
async function makeTd(baseurl, n) {
    if (n <= -1) {
        return fileFetch(baseurl + "/td.txt", "buffer");
    }
    const tdpromises = [];
    for(let i = 0; i <= n; i++){
        const f = baseurl + "/td" + i.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) + ".txt";
        tdpromises.push(fileFetch(f, "buffer"));
    }
    const tds = await Promise.all(tdpromises);
    return new Promise((resolve, reject)=>{
        resolve(concat(tds));
    });
}
function concat(arraybuffers) {
    let sz = arraybuffers.reduce((sum, a)=>sum + a.byteLength
    , 0);
    let buf = new ArrayBuffer(sz);
    let cat = new Uint8Array(buf);
    let offset = 0;
    for (let a of arraybuffers){
        const v = new Uint8Array(a);
        cat.set(v, offset);
        offset += a.byteLength;
    }
    return buf;
}
class CommandControl {
    constructor(){
        this.latestTimestamp = "";
    }
    async RethinkModule(param) {
        this.latestTimestamp = param.latestTimestamp;
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = {
        };
        response.data.stopProcessing = false;
        if (param.request.method === "GET") {
            response = this.commandOperation(param.request.url, param.blocklistFilter, param.request.headers);
        } else if (param.request.method === "POST") {
            let headers = param.request.headers;
            response.data.stopProcessing = true;
            const isPOSTDnsMsg = headers.get("Accept") == "application/dns-message" || headers.get("Content-Type") == "application/dns-message";
            if (isPOSTDnsMsg) {
                response.data.stopProcessing = false;
            } else {
                response.data.httpResponse = new Response(null, {
                    status: 400,
                    statusText: "Bad Request"
                });
            }
        }
        return response;
    }
    commandOperation(url, blocklistFilter, headers) {
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = {
        };
        const isGETDnsMsg = headers.get("Accept") == "application/dns-message";
        try {
            response.data.stopProcessing = true;
            response.data.httpResponse;
            const reqUrl = new URL(url);
            const queryString = reqUrl.searchParams;
            const pathSplit = reqUrl.pathname.split("/");
            let command = pathSplit[1];
            if (!command) {
                const d = reqUrl.host.split(".");
                command = d.length > 3 && d[2] === "rethinkdns" ? d[0] : "";
            }
            const weburl = command == "" ? "https://rethinkdns.com/configure" : "https://rethinkdns.com/configure?s=added#" + command;
            if (command == "listtob64") {
                response.data.httpResponse = listToB64.call(this, queryString, blocklistFilter);
            } else if (command == "b64tolist") {
                response.data.httpResponse = b64ToList.call(this, queryString, blocklistFilter);
            } else if (command == "dntolist") {
                response.data.httpResponse = domainNameToList.call(this, queryString, blocklistFilter);
            } else if (command == "dntouint") {
                response.data.httpResponse = domainNameToUint.call(this, queryString, blocklistFilter);
            } else if (command == "config" || command == "configure") {
                let b64UserFlag = "";
                if (pathSplit.length >= 3) {
                    b64UserFlag = pathSplit[2];
                }
                response.data.httpResponse = configRedirect.call(this, b64UserFlag, reqUrl.origin);
            } else if (!isGETDnsMsg) {
                response.data.httpResponse = Response.redirect(weburl, 302);
            } else if (queryString.has("dns")) {
                response.data.stopProcessing = false;
            } else {
                response.data.httpResponse = new Response(null, {
                    status: 400,
                    statusText: "Bad Request"
                });
            }
        } catch (e) {
            response.isException = true;
            response.exceptionStack = e.stack;
            response.exceptionFrom = "CommandControl commandOperation";
            response.data.httpResponse = new Response(JSON.stringify(response.exceptionStack));
            response.data.httpResponse.headers.set("Content-Type", "application/json");
        }
        return response;
    }
}
function configRedirect(b64UserFlag, requestUrlOrigin) {
    let base = "https://rethinkdns.com/configure";
    let query = "?v=ext&u=" + requestUrlOrigin + "&tstamp=" + this.latestTimestamp + "#" + b64UserFlag;
    return Response.redirect(base + query, 302);
}
function domainNameToList(queryString, blocklistFilter) {
    let domainName = queryString.get("dn") || "";
    let returndata = {
    };
    returndata.domainName = domainName;
    returndata.version = this.latestTimestamp;
    returndata.list = {
    };
    var searchResult = blocklistFilter.hadDomainName(domainName);
    if (searchResult) {
        let list;
        let listDetail = {
        };
        for (let entry of searchResult){
            list = blocklistFilter.getTag(entry[1]);
            listDetail = {
            };
            for (let listValue of list){
                listDetail[listValue] = blocklistFilter.blocklistFileTag[listValue];
            }
            returndata.list[entry[0]] = listDetail;
        }
    } else {
        returndata.list = false;
    }
    let response = new Response(JSON.stringify(returndata));
    response.headers.set("Content-Type", "application/json");
    return response;
}
function domainNameToUint(queryString, blocklistFilter) {
    let domainName = queryString.get("dn") || "";
    let returndata = {
    };
    returndata.domainName = domainName;
    returndata.list = {
    };
    var searchResult = blocklistFilter.hadDomainName(domainName);
    if (searchResult) {
        for (let entry of searchResult){
            returndata.list[entry[0]] = entry[1];
        }
    } else {
        returndata.list = false;
    }
    let response = new Response(JSON.stringify(returndata));
    response.headers.set("Content-Type", "application/json");
    return response;
}
function listToB64(queryString, blocklistFilter) {
    let list = queryString.get("list") || [];
    let flagVersion = parseInt(queryString.get("flagversion")) || 0;
    let returndata = {
    };
    returndata.command = "List To B64String";
    returndata.inputList = list;
    returndata.flagVersion = flagVersion;
    returndata.b64String = blocklistFilter.getB64FlagFromTag(list.split(","), flagVersion);
    let response = new Response(JSON.stringify(returndata));
    response.headers.set("Content-Type", "application/json");
    return response;
}
function b64ToList(queryString, blocklistFilter) {
    let b64 = queryString.get("b64") || "";
    let returndata = {
    };
    returndata.command = "Base64 To List";
    returndata.inputB64 = b64;
    let response = blocklistFilter.unstamp(b64);
    if (response.userBlocklistFlagUint.length > 0) {
        returndata.list = blocklistFilter.getTag(response.userBlocklistFlagUint);
        returndata.listDetail = {
        };
        for (let listValue of returndata.list){
            returndata.listDetail[listValue] = blocklistFilter.blocklistFileTag[listValue];
        }
    } else {
        returndata.list = "Invalid B64 String";
    }
    response = new Response(JSON.stringify(returndata));
    response.headers.set("Content-Type", "application/json");
    return response;
}
class UserOperation {
    constructor(){
        this.userConfigCache = false;
    }
    async RethinkModule(param) {
        return loadUser.call(this, param);
    }
}
function loadUser(param) {
    let response = {
    };
    response.isException = false;
    response.exceptionStack = "";
    response.exceptionFrom = "";
    response.data = {
    };
    try {
        if (!this.userConfigCache) {
            this.userConfigCache = new LocalCache("User-Config-Cache", 1000);
        }
        let userBlocklistInfo = {
        };
        userBlocklistInfo.from = "Cache";
        let blocklistFlag = getBlocklistFlag(param.request.url);
        let currentUser = this.userConfigCache.Get(blocklistFlag);
        if (!currentUser) {
            currentUser = {
            };
            currentUser.k = blocklistFlag;
            currentUser.data = {
            };
            currentUser.data.userBlocklistFlagUint = "";
            currentUser.data.flagVersion = 0;
            currentUser.data.userServiceListUint = false;
            let response = param.blocklistFilter.unstamp(blocklistFlag);
            currentUser.data.userBlocklistFlagUint = response.userBlocklistFlagUint;
            currentUser.data.flagVersion = response.flagVersion;
            if (currentUser.data.userBlocklistFlagUint.length > 0) {
                currentUser.data.userServiceListUint = param.blocklistFilter.flagIntersection(currentUser.data.userBlocklistFlagUint, param.blocklistFilter.wildCardUint);
            }
            userBlocklistInfo.from = "Generated";
        }
        userBlocklistInfo.userBlocklistFlagUint = currentUser.data.userBlocklistFlagUint;
        userBlocklistInfo.flagVersion = currentUser.data.flagVersion;
        userBlocklistInfo.userServiceListUint = currentUser.data.userServiceListUint;
        userBlocklistInfo.dnsResolverUrl = param.dnsResolverUrl;
        response.data = userBlocklistInfo;
        this.userConfigCache.Put(currentUser);
    } catch (e) {
        response.isException = true;
        response.exceptionStack = e.stack;
        response.exceptionFrom = "UserOperation loadUser";
        response.data = false;
        console.error("Error At : UserOperation -> loadUser");
        console.error(e.stack);
    }
    return response;
}
function getBlocklistFlag(url) {
    let blocklistFlag = "";
    let reqUrl = new URL(url);
    let tmpsplit = reqUrl.pathname.split("/");
    if (tmpsplit.length > 1) {
        if (tmpsplit[1].toLowerCase() == "dns-query") {
            blocklistFlag = tmpsplit[2] || "";
        } else {
            blocklistFlag = tmpsplit[1] || "";
        }
    }
    return blocklistFlag;
}
const blocklistWrapper = new BlocklistWrapper();
const commandControl = new CommandControl();
const userOperation = new UserOperation();
const dnsBlock = new DNSBlock();
const dnsResolver = new DNSResolver();
const dnsResponseBlock = new DNSResponseBlock();
class RethinkPlugin {
    constructor(event, env){
        this.parameter = new Map(env.getEnvMap());
        this.registerParameter("request", event.request);
        this.registerParameter("event", event);
        this.plugin = [];
        this.registerPlugin("blocklistFilter", blocklistWrapper, [
            "blocklistUrl",
            "latestTimestamp",
            "workerTimeout",
            "tdParts",
            "tdNodecount",
            "fetchTimeout", 
        ], blocklistFilterCallBack, false);
        this.registerPlugin("commandControl", commandControl, [
            "request",
            "blocklistFilter",
            "latestTimestamp"
        ], commandControlCallBack, false);
        this.registerPlugin("userOperation", userOperation, [
            "blocklistFilter",
            "dnsResolverUrl",
            "request"
        ], userOperationCallBack, false);
        this.registerPlugin("dnsBlock", dnsBlock, [
            "requestBodyBuffer",
            "blocklistFilter",
            "userBlocklistInfo"
        ], dnsBlockCallBack, false);
        this.registerPlugin("dnsResolver", dnsResolver, [
            "requestBodyBuffer",
            "request",
            "dnsResolverUrl",
            "runTimeEnv",
            "requestDecodedDnsPacket",
            "event", 
        ], dnsResolverCallBack, false);
        this.registerPlugin("DNSResponseBlock", dnsResponseBlock, [
            "userBlocklistInfo",
            "blocklistFilter",
            "responseDecodedDnsPacket"
        ], dnsResponseBlockCallBack, false);
    }
    registerParameter(key, parameter) {
        this.parameter.set(key, parameter);
    }
    registerPlugin(pluginName, module, parameter, callBack, continueOnStopProcess) {
        this.plugin.push({
            name: pluginName,
            module: module,
            param: parameter,
            callBack: callBack,
            continueOnStopProcess: continueOnStopProcess
        });
    }
    async executePlugin(currentRequest) {
        for (const singlePlugin of this.plugin){
            if (currentRequest.stopProcessing && !singlePlugin.continueOnStopProcess) {
                continue;
            }
            const response = await singlePlugin.module.RethinkModule(generateParam.call(this, singlePlugin.param));
            if (singlePlugin.callBack) {
                await singlePlugin.callBack.call(this, response, currentRequest);
            }
        }
    }
}
function blocklistFilterCallBack(response, currentRequest) {
    if (response.isException) {
        loadException(response, currentRequest);
    } else {
        this.registerParameter("blocklistFilter", response.data.blocklistFilter);
    }
}
async function commandControlCallBack(response, currentRequest) {
    if (response.data.stopProcessing) {
        currentRequest.httpResponse = response.data.httpResponse;
        currentRequest.stopProcessing = true;
    } else {
        const request = this.parameter.get("request");
        let bodyBuffer;
        if (request.method.toUpperCase() === "GET") {
            const QueryString = new URL(request.url).searchParams;
            bodyBuffer = base64ToArrayBuffer(decodeURI(QueryString.get("dns")).replace(/-/g, "+").replace(/_/g, "/"));
        } else {
            bodyBuffer = await request.arrayBuffer();
        }
        this.registerParameter("requestBodyBuffer", bodyBuffer);
    }
}
function userOperationCallBack(response, currentRequest) {
    if (response.isException) {
        loadException(response, currentRequest);
    } else {
        this.registerParameter("userBlocklistInfo", response.data);
        this.registerParameter("dnsResolverUrl", response.data.dnsResolverUrl);
    }
}
function dnsBlockCallBack(response, currentRequest) {
    if (response.isException) {
        loadException(response, currentRequest);
    } else {
        this.registerParameter("dnsBlockResponse", response.data);
        this.registerParameter("requestDecodedDnsPacket", response.data.decodedDnsPacket);
        currentRequest.isDnsBlock = response.data.isBlocked;
        currentRequest.isDomainInBlockListNotBlocked = response.data.isNotBlockedExistInBlocklist;
        currentRequest.decodedDnsPacket = response.data.decodedDnsPacket;
        currentRequest.blockedB64Flag = response.data.blockedB64Flag;
        if (currentRequest.isDnsBlock) {
            currentRequest.stopProcessing = true;
            currentRequest.dnsBlockResponse();
        }
    }
}
function dnsResolverCallBack(response, currentRequest) {
    if (response.isException) {
        loadException(response, currentRequest);
    } else {
        this.registerParameter("responseBodyBuffer", response.data.responseBodyBuffer);
        this.registerParameter("responseDecodedDnsPacket", response.data.responseDecodedDnsPacket);
        currentRequest.decodedDnsPacket = response.data.responseDecodedDnsPacket;
    }
}
function dnsResponseBlockCallBack(response, currentRequest) {
    if (response.isException) {
        loadException(response, currentRequest);
    } else {
        this.registerParameter("dnsCnameBlockResponse", response.data);
        currentRequest.isDnsBlock = response.data.isBlocked;
        currentRequest.isDomainInBlockListNotBlocked = response.data.isNotBlockedExistInBlocklist;
        currentRequest.blockedB64Flag = response.data.blockedB64Flag;
        if (currentRequest.isDnsBlock) {
            currentRequest.stopProcessing = true;
            currentRequest.dnsBlockResponse();
        } else {
            currentRequest.dnsResponse(this.parameter.get("responseBodyBuffer"));
        }
    }
}
function loadException(response, currentRequest) {
    console.error(JSON.stringify(response));
    currentRequest.stopProcessing = true;
    currentRequest.isException = true;
    currentRequest.exceptionStack = response.exceptionStack;
    currentRequest.exceptionFrom = response.exceptionFrom;
    currentRequest.dnsExceptionResponse();
}
function generateParam(list) {
    const param = {
    };
    for (const key of list){
        if (this.parameter.has(key)) {
            param[key] = this.parameter.get(key);
        }
    }
    return param;
}
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for(let i = 0; i < len; i++){
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
class Env {
    constructor(){
        this.env = new Map();
        this.isLoaded = false;
    }
    loadEnv() {
        try {
            this.env.set("runTimeEnv", RUNTIME_ENV);
            this.env.set("blocklistUrl", CF_BLOCKLIST_URL);
            this.env.set("latestTimestamp", CF_LATEST_BLOCKLIST_TIMESTAMP);
            this.env.set("dnsResolverUrl", CF_DNS_RESOLVER_URL);
            this.env.set("onInvalidFlagStopProcessing", CF_ON_INVALID_FLAG_STOPPROCESSING);
            this.env.set("workerTimeout", WORKER_TIMEOUT);
            this.env.set("workerTimeout", WORKER_TIMEOUT + CF_BLOCKLIST_DOWNLOAD_TIMEOUT);
            this.env.set("fetchTimeout", CF_BLOCKLIST_DOWNLOAD_TIMEOUT);
            this.env.set("tdNodecount", TD_NODE_COUNT);
            this.env.set("tdParts", TD_PARTS);
            this.isLoaded = true;
        } catch (e) {
            if (e instanceof ReferenceError) {
                typeof Deno !== "undefined" ? this.loadEnvDeno() : this.loadEnvNode();
            } else throw e;
        }
    }
    loadEnvDeno() {
        this.env.set("runTimeEnv", Deno.env.get("RUNTIME_ENV"));
        this.env.set("blocklistUrl", Deno.env.get("CF_BLOCKLIST_URL"));
        this.env.set("latestTimestamp", Deno.env.get("CF_LATEST_BLOCKLIST_TIMESTAMP"));
        this.env.set("dnsResolverUrl", Deno.env.get("CF_DNS_RESOLVER_URL"));
        this.env.set("onInvalidFlagStopProcessing", Deno.env.get("CF_ON_INVALID_FLAG_STOPPROCESSING"));
        this.env.set("tdNodecount", Deno.env.get("TD_NODE_COUNT"));
        this.env.set("tdParts", Deno.env.get("TD_PARTS"));
        this.env.set("fetchTimeout", Deno.env.get("CF_BLOCKLIST_DOWNLOAD_TIMEOUT"));
        this.isLoaded = true;
    }
    loadEnvNode() {
        this.env.set("runTimeEnv", process.env.RUNTIME_ENV);
        this.env.set("blocklistUrl", process.env.CF_BLOCKLIST_URL);
        this.env.set("latestTimestamp", process.env.CF_LATEST_BLOCKLIST_TIMESTAMP);
        this.env.set("dnsResolverUrl", process.env.CF_DNS_RESOLVER_URL);
        this.env.set("onInvalidFlagStopProcessing", process.env.CF_ON_INVALID_FLAG_STOPPROCESSING);
        this.env.set("tdNodecount", process.env.TD_NODE_COUNT);
        this.env.set("tdParts", process.env.TD_PARTS);
        this.env.set("fetchTimeout", process.env.CF_BLOCKLIST_DOWNLOAD_TIMEOUT);
        this.isLoaded = true;
    }
    getEnvMap() {
        return this.env;
    }
    get(key) {
        return this.env.get(key);
    }
    put(key, value) {
        this.env.set(key, value);
    }
}
const env = new Env();
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
};
if (typeof addEventListener !== "undefined") {
    addEventListener("fetch", (event)=>{
        if (!env.isLoaded) {
            env.loadEnv();
        }
        let workerTimeout = env.get("workerTimeout");
        if (env.get("runTimeEnv") == "worker" && workerTimeout > 0) {
            let dnsParser = new DNSParserWrap();
            let returnResponse = Promise.race([
                new Promise((resolve, _)=>{
                    let resp = handleRequest(event);
                    resolve(resp);
                }),
                new Promise((resolve, _)=>{
                    let resp = new Response(dnsParser.Encode({
                        type: "response",
                        flags: 4098
                    }), {
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/dns-message"
                        }
                    });
                    setTimeout(()=>{
                        resolve(resp);
                    }, workerTimeout);
                }), 
            ]);
            return event.respondWith(returnResponse);
        } else {
            event.respondWith(handleRequest(event));
        }
    });
}
function handleRequest(event) {
    return proxyRequest(event);
}
async function proxyRequest(event) {
    const currentRequest = new CurrentRequest();
    let res;
    try {
        if (event.request.method === "OPTIONS") {
            res = new Response(null, {
                status: 204,
                headers: corsHeaders
            });
            return res;
        }
        if (!env.isLoaded) {
            env.loadEnv();
        }
        const plugin = new RethinkPlugin(event, env);
        await plugin.executePlugin(currentRequest);
        const UA = event.request.headers.get("User-Agent");
        if (UA && UA.startsWith("Mozilla/5.0")) {
            currentRequest.httpResponse.headers.set("Access-Control-Allow-Origin", "*");
            currentRequest.httpResponse.headers.set("Access-Control-Allow-Headers", "*");
        }
        return currentRequest.httpResponse;
    } catch (e) {
        console.error(e.stack);
        res = new Response(JSON.stringify(e.stack));
        res.headers.set("Content-Type", "application/json");
        res.headers.set("Access-Control-Allow-Origin", "*");
        res.headers.set("Access-Control-Allow-Headers", "*");
        res.headers.append("Vary", "Origin");
        res.headers.delete("expect-ct");
        res.headers.delete("cf-ray");
        return res;
    }
}
const { TERMINATE_TLS , TLS_CRT_PATH , TLS_KEY_PATH  } = Deno.env.toObject();
const l = TERMINATE_TLS == "true" ? Deno.listenTls({
    port: 8080,
    certFile: TLS_CRT_PATH,
    keyFile: TLS_KEY_PATH
}) : Deno.listen({
    port: 8080
});
console.log(`Running HTTP webserver at: http://${l.addr.hostname}:${l.addr.port}/`);
for await (const conn of l){
    handleHttp(conn);
}
async function handleHttp(conn) {
    const httpConn = Deno.serveHttp(conn);
    let requestEvent = null;
    while(true){
        try {
            requestEvent = await httpConn.nextRequest();
        } catch (e) {
            console.warn("error reading http request", e);
        }
        if (requestEvent) {
            try {
                await requestEvent.respondWith(handleRequest(requestEvent));
            } catch (e) {
                console.warn("error handling http request", e);
            }
        }
    }
}

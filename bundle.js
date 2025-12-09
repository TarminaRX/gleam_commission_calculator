var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// build/dev/javascript/prelude.mjs
var CustomType = class {
  withFields(fields) {
    let properties = Object.keys(this).map(
      (label) => label in fields ? fields[label] : this[label]
    );
    return new this.constructor(...properties);
  }
};
var Result = class _Result extends CustomType {
  static isResult(data) {
    return data instanceof _Result;
  }
};
var Ok = class extends Result {
  constructor(value) {
    super();
    this[0] = value;
  }
  isOk() {
    return true;
  }
};
var Error2 = class extends Result {
  constructor(detail) {
    super();
    this[0] = detail;
  }
  isOk() {
    return false;
  }
};
function remainderInt(a, b) {
  if (b === 0) {
    return 0;
  } else {
    return a % b;
  }
}
function divideInt(a, b) {
  return Math.trunc(divideFloat(a, b));
}
function divideFloat(a, b) {
  if (b === 0) {
    return 0;
  } else {
    return a / b;
  }
}

// build/dev/javascript/gleam_stdlib/dict.mjs
var SHIFT = 5;
var BUCKET_SIZE = Math.pow(2, SHIFT);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;

// build/dev/javascript/gleam_stdlib/gleam/string.mjs
function slice(string2, idx, len) {
  let $ = len <= 0;
  if ($) {
    return "";
  } else {
    let $1 = idx < 0;
    if ($1) {
      let translated_idx = string_length(string2) + idx;
      let $2 = translated_idx < 0;
      if ($2) {
        return "";
      } else {
        return string_grapheme_slice(string2, translated_idx, len);
      }
    } else {
      return string_grapheme_slice(string2, idx, len);
    }
  }
}
function repeat_loop(loop$times, loop$doubling_acc, loop$acc) {
  while (true) {
    let times = loop$times;
    let doubling_acc = loop$doubling_acc;
    let acc = loop$acc;
    let _block;
    let $ = times % 2;
    if ($ === 0) {
      _block = acc;
    } else {
      _block = acc + doubling_acc;
    }
    let acc$1 = _block;
    let times$1 = globalThis.Math.trunc(times / 2);
    let $1 = times$1 <= 0;
    if ($1) {
      return acc$1;
    } else {
      loop$times = times$1;
      loop$doubling_acc = doubling_acc + doubling_acc;
      loop$acc = acc$1;
    }
  }
}
function repeat(string2, times) {
  let $ = times <= 0;
  if ($) {
    return "";
  } else {
    return repeat_loop(times, string2, "");
  }
}
function padding(size, pad_string) {
  let pad_string_length = string_length(pad_string);
  let num_pads = divideInt(size, pad_string_length);
  let extra = remainderInt(size, pad_string_length);
  return repeat(pad_string, num_pads) + slice(pad_string, 0, extra);
}
function pad_start(string2, desired_length, pad_string) {
  let current_length = string_length(string2);
  let to_pad_length = desired_length - current_length;
  let $ = to_pad_length <= 0;
  if ($) {
    return string2;
  } else {
    return padding(to_pad_length, pad_string) + string2;
  }
}
function trim(string2) {
  let _pipe = string2;
  let _pipe$1 = trim_start(_pipe);
  return trim_end(_pipe$1);
}

// build/dev/javascript/gleam_stdlib/gleam_stdlib.mjs
var Nil = void 0;
function identity(x) {
  return x;
}
function parse_int(value) {
  if (/^[-+]?(\d+)$/.test(value)) {
    return new Ok(parseInt(value));
  } else {
    return new Error2(Nil);
  }
}
function parse_float(value) {
  if (/^[-+]?(\d+)\.(\d+)([eE][-+]?\d+)?$/.test(value)) {
    return new Ok(parseFloat(value));
  } else {
    return new Error2(Nil);
  }
}
function to_string(term) {
  return term.toString();
}
function string_length(string2) {
  if (string2 === "") {
    return 0;
  }
  const iterator = graphemes_iterator(string2);
  if (iterator) {
    let i = 0;
    for (const _ of iterator) {
      i++;
    }
    return i;
  } else {
    return string2.match(/./gsu).length;
  }
}
var segmenter = void 0;
function graphemes_iterator(string2) {
  if (globalThis.Intl && Intl.Segmenter) {
    segmenter ||= new Intl.Segmenter();
    return segmenter.segment(string2)[Symbol.iterator]();
  }
}
function pop_grapheme(string2) {
  let first;
  const iterator = graphemes_iterator(string2);
  if (iterator) {
    first = iterator.next().value?.segment;
  } else {
    first = string2.match(/./su)?.[0];
  }
  if (first) {
    return new Ok([first, string2.slice(first.length)]);
  } else {
    return new Error2(Nil);
  }
}
function lowercase(string2) {
  return string2.toLowerCase();
}
function uppercase(string2) {
  return string2.toUpperCase();
}
function string_grapheme_slice(string2, idx, len) {
  if (len <= 0 || idx >= string2.length) {
    return "";
  }
  const iterator = graphemes_iterator(string2);
  if (iterator) {
    while (idx-- > 0) {
      iterator.next();
    }
    let result = "";
    while (len-- > 0) {
      const v = iterator.next().value;
      if (v === void 0) {
        break;
      }
      result += v.segment;
    }
    return result;
  } else {
    return string2.match(/./gsu).slice(idx, idx + len).join("");
  }
}
var unicode_whitespaces = [
  " ",
  // Space
  "	",
  // Horizontal tab
  "\n",
  // Line feed
  "\v",
  // Vertical tab
  "\f",
  // Form feed
  "\r",
  // Carriage return
  "\x85",
  // Next line
  "\u2028",
  // Line separator
  "\u2029"
  // Paragraph separator
].join("");
var trim_start_regex = /* @__PURE__ */ new RegExp(
  `^[${unicode_whitespaces}]*`
);
var trim_end_regex = /* @__PURE__ */ new RegExp(`[${unicode_whitespaces}]*$`);
function trim_start(string2) {
  return string2.replace(trim_start_regex, "");
}
function trim_end(string2) {
  return string2.replace(trim_end_regex, "");
}
function console_log(term) {
  console.log(term);
}
function round2(float2) {
  return Math.round(float2);
}

// build/dev/javascript/gleam_stdlib/gleam/float.mjs
function negate(x) {
  return -1 * x;
}
function round(x) {
  let $ = x >= 0;
  if ($) {
    return round2(x);
  } else {
    return 0 - round2(negate(x));
  }
}

// build/dev/javascript/input/input_ffi.mjs
var import_node_fs = __toESM(require("node:fs"), 1);
var import_node_buffer = require("node:buffer");
function input(prompt) {
  try {
    process.stdout.write(prompt);
    const buffer = import_node_buffer.Buffer.alloc(4096);
    const bytesRead = import_node_fs.default.readSync(0, buffer, 0, buffer.length, null);
    let input2 = buffer.toString("utf-8", 0, bytesRead);
    input2 = input2.replace(/[\r\n]+$/, "");
    return new Ok(input2);
  } catch {
    return new Error2(void 0);
  }
}

// build/dev/javascript/real_estate_calculator/real_estate_calculator.mjs
var Commission = class extends CustomType {
  constructor(s_price, c_rate, t_rate) {
    super();
    this.s_price = s_price;
    this.c_rate = c_rate;
    this.t_rate = t_rate;
  }
};
function is_letter(char) {
  let lower = lowercase(char);
  let upper = uppercase(char);
  return lower !== upper;
}
function get_pcode() {
  while (true) {
    let $ = input("");
    if ($ instanceof Ok) {
      let str = $[0];
      let _block;
      let _pipe = trim(str);
      _block = uppercase(_pipe);
      let clean_str = _block;
      let $1 = pop_grapheme(clean_str);
      if ($1 instanceof Ok) {
        let char = $1[0][0];
        let $2 = is_letter(char);
        if ($2) {
          if (char === "R") {
            return 0.056;
          } else if (char === "C") {
            return 0.045;
          } else if (char === "G") {
            return 0.0385;
          } else {
            console_log("INVALID! Refer to the choices only.");
          }
        } else {
          console_log("INVALID INPUT! Letters only.");
        }
      } else {
        console_log("INVALID! Try again.");
      }
    } else {
      console_log("INVALID! Try again.");
    }
  }
}
function get_bcode() {
  while (true) {
    let $ = input("");
    if ($ instanceof Ok) {
      let str = $[0];
      let _block;
      let _pipe = trim(str);
      _block = uppercase(_pipe);
      let clean_str = _block;
      let $1 = pop_grapheme(clean_str);
      if ($1 instanceof Ok) {
        let char = $1[0][0];
        let $2 = is_letter(char);
        if ($2) {
          if (char === "I") {
            return 0.218;
          } else if (char === "A") {
            return 0.235;
          } else if (char === "F") {
            return 0.098;
          } else {
            console_log("INVALID! Refer to the choices only.");
          }
        } else {
          console_log("Invalid Input! Letters only.");
        }
      } else {
        console_log("INVALID! Try again.");
      }
    } else {
      console_log("INVALID! Try again.");
    }
  }
}
function gross_rate(comm) {
  let $ = comm.s_price >= 2e7;
  if ($) {
    return comm.s_price * (comm.c_rate + 0.015);
  } else {
    return comm.s_price * comm.c_rate;
  }
}
function tax(comm) {
  return gross_rate(comm) * comm.t_rate;
}
function net_com(comm) {
  return gross_rate(comm) - tax(comm);
}
function format_2dp(value) {
  let scaled_int = round(value * 100);
  let whole = globalThis.Math.trunc(scaled_int / 100);
  let fraction = scaled_int % 100;
  let fraction_str = pad_start(to_string(fraction), 2, "0");
  return to_string(whole) + "." + fraction_str;
}
function display_results(comm) {
  let gross = gross_rate(comm);
  let net = net_com(comm);
  console_log("\nGross Commission: " + format_2dp(gross));
  return console_log("Net Commission: " + format_2dp(net));
}
function check_negative(val) {
  let $ = val < 0;
  if ($) {
    console_log("INVALID! Non-negative numbers only.");
    return get_price();
  } else {
    return val;
  }
}
function get_price() {
  while (true) {
    let $ = input("Input sale price: ");
    if ($ instanceof Ok) {
      let str = $[0];
      let clean_str = trim(str);
      let $1 = parse_float(clean_str);
      if ($1 instanceof Ok) {
        let val = $1[0];
        return check_negative(val);
      } else {
        let $2 = parse_int(clean_str);
        if ($2 instanceof Ok) {
          let int_val = $2[0];
          return check_negative(identity(int_val));
        } else {
          console_log("INVALID! Numbers only.");
        }
      }
    } else {
      console_log("INVALID! Try again");
    }
  }
}
function run_app() {
  while (true) {
    console_log("Input Property Code");
    console_log("R - Residential || C - Commercial || G - Agricultural");
    let com_rate = get_pcode();
    console_log("Input Broker Code");
    console_log("I - In-house || A - Accredited || F - Referral");
    let tax_rate = get_bcode();
    let srp = get_price();
    let comm_data = new Commission(srp, com_rate, tax_rate);
    display_results(comm_data);
    console_log("\n\nDo you want to restart? Y - Restart || Any letter - Exit");
    let $ = input("Your Choice: ");
    if ($ instanceof Ok) {
      let choice = $[0];
      let $1 = uppercase(choice);
      if (!($1 === "Y")) {
        return console_log("Exiting...");
      }
    } else {
      return console_log("Error reading input. Exiting.");
    }
  }
}
function main() {
  return run_app();
}

// entry.js
main();

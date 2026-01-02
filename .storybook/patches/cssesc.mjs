/*! https://mths.be/cssesc v3.0.0 by @mathias - converted to ESM */

var object = {};
var hasOwnProperty = object.hasOwnProperty;
var merge = function merge(options, defaults) {
  if (!options) {
    return defaults;
  }
  var result = {};
  for (var key in defaults) {
    result[key] = hasOwnProperty.call(options, key)
      ? options[key]
      : defaults[key];
  }
  return result;
};

var regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
var regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
var regexAlwaysEscape = /['"\\]/;
var regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;

var cssesc = function cssesc(string, options) {
  options = merge(options, cssesc.options);
  if (options.quotes != "single" && options.quotes != "double") {
    options.quotes = "single";
  }
  var quote = options.quotes == "double" ? '"' : "'";
  var isIdentifier = options.isIdentifier;

  var firstChar = string.charAt(0);
  var output = "";
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var character = string.charAt(counter++);
    var codePoint = character.charCodeAt();
    var value = void 0;
    if (codePoint < 0x20 || codePoint > 0x7e) {
      if (codePoint >= 0xd800 && codePoint <= 0xdbff && counter < length) {
        var extra = string.charCodeAt(counter++);
        if ((extra & 0xfc00) == 0xdc00) {
          codePoint = ((codePoint & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
        } else {
          counter--;
        }
      }
      value = "\\" + codePoint.toString(16).toUpperCase() + " ";
    } else {
      if (options.escapeEverything) {
        if (regexAnySingleEscape.test(character)) {
          value = "\\" + character;
        } else {
          value = "\\" + codePoint.toString(16).toUpperCase() + " ";
        }
      } else if (/[\t\n\f\r\x0B]/.test(character)) {
        value = "\\" + codePoint.toString(16).toUpperCase() + " ";
      } else if (
        character == "\\" ||
        (!isIdentifier &&
          ((character == '"' && quote == character) ||
            (character == "'" && quote == character))) ||
        (isIdentifier && regexSingleEscape.test(character))
      ) {
        value = "\\" + character;
      } else {
        value = character;
      }
    }
    output += value;
  }

  if (isIdentifier) {
    if (/^-[-\d]/.test(output)) {
      output = "\\-" + output.slice(1);
    } else if (/\d/.test(firstChar)) {
      output = "\\3" + firstChar + " " + output.slice(1);
    }
  }

  output = output.replace(regexExcessiveSpaces, function ($0, $1, $2) {
    if ($1 && $1.length % 2) {
      return $0;
    }
    return ($1 || "") + $2;
  });

  if (!isIdentifier && options.wrap) {
    return quote + output + quote;
  }
  return output;
};

cssesc.options = {
  escapeEverything: false,
  isIdentifier: false,
  quotes: "single",
  wrap: false,
};

cssesc.version = "3.0.0";

export default cssesc;
export { cssesc };

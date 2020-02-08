//@ts-check
const { MacroError } = require("babel-plugin-macros");
const postCSS = require("postcss");
const autoprefixer = require("autoprefixer");
const postcssNested = require("postcss-nested");
const postcssCSSO = require("postcss-csso");
const postCSSJS = require("postcss-js");

//@ts-ignore
const processor = postCSS([autoprefixer()]);
//@ts-ignore
const processJsObj = str => processor.process(str, { parser: postCSSJS });

//@ts-ignore
const nestProcessor = postCSS([postcssNested(), postcssCSSO()]);

/**
 * @param {typeof import("@babel/core").types} t
 * @param {import("@babel/types").Node} node
 */
function getCSS(t, node) {
  /**
   * @type {string}
   */
  let CSS;
  if (t.isTaggedTemplateExpression(node)) {
    const arg = node.quasi.quasis;
    if (arg.length > 1) {
      throw new MacroError("Arguments are not supported in tagged templates");
    }
    const styleString = arg[0].value.raw;
    CSS = processor.process(styleString).css;
  } else if (t.isCallExpression(node)) {
    const arg = node.arguments[0];
    if (t.isObjectExpression(arg)) {
      let obj = AstToLiteral(t, arg);
      CSS = processJsObj(obj).css;
    } else {
      throw new MacroError("Only inline Object expressions are supported");
    }
  } else {
    throw new MacroError("Invalid usage");
  }
  return CSS;
}

/**
 * https://stackoverflow.com/a/7616484/7505660
 * @param {string} str
 * @returns {string}
 */
function toHash(str) {
  let hash = 0,
    i = 0,
    chr;
  for (; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return "css" + hash.toString(36);
}

/**
 * @param {string} CSSString
 */
function processCSS(CSSString) {
  return nestProcessor.process(CSSString).css;
}

/**
 * @param {typeof import("@babel/core").types} t
 * @param {import("@babel/types").ObjectExpression} arg
 */
function AstToLiteral(t, arg) {
  let obj = {};
  arg.properties.forEach(prop => {
    if (t.isObjectProperty(prop)) {
      const key = getKey(t, prop.key);
      const value = getValue(t, prop.value);
      obj[key] = value;
    } else {
      throw new MacroError("Only inline Object expressions are supported");
    }
  });

  return obj;
}

/**
 * @param {typeof import("@babel/core").types} t
 * @param {object} key
 */
function getKey(t, key) {
  if (t.isIdentifier(key)) {
    return key.name;
  } else if (t.isStringLiteral(key)) {
    return key.value;
  }
  throw new MacroError("Invalide type for key " + key.type);
}

/**
 * @param {typeof import("@babel/core").types} t
 * @param {object} key
 */
function getValue(t, key) {
  if (t.isStringLiteral(key) || t.isNumericLiteral(key)) {
    return key.value;
  } else if (t.isObjectExpression(key)) {
    // Nested Object
    return AstToLiteral(t, key);
  } else {
    throw new MacroError("Invalide type for value " + key.type);
  }
}

module.exports = {
  getCSS,
  toHash,
  processCSS
};

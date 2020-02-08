//@ts-check
const { MacroError } = require("babel-plugin-macros");
const postCSS = require("postcss");
const autoprefixer = require("autoprefixer");
const postcssNested = require("postcss-nested");

//@ts-ignore
const processor = postCSS([autoprefixer()]);

//@ts-ignore
const nestProcessor = postCSS([postcssNested()]);

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

module.exports = {
  getCSS,
  toHash,
  processCSS
};

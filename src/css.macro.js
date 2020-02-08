//@ts-check
const { createMacro } = require("babel-plugin-macros");
const { addNamed } = require("@babel/helper-module-imports");

const { getCSS, toHash } = require("./macro-helpers");

module.exports = createMacro(cssMacro);

/**
 * @param {import("babel-plugin-macros").MacroParams} param0
 */
function cssMacro({ references, babel, state }) {
  const t = babel.types;

  const program = state.file.path;

  const CSSRefs = references.css;
  if (CSSRefs) {
    const cssFn = addNamed(program, "css", "./css.runtime");

    CSSRefs.forEach(ref => {
      let CSS = getCSS(t, ref.parent);

      const className = toHash(CSS);

      CSS = "." + className + "{" + CSS + "}";

      const replacement = t.callExpression(t.identifier(cssFn.name), [
        t.stringLiteral(className),
        t.stringLiteral(CSS)
      ]);
      ref.parentPath.replaceWith(replacement);
    });
  }
}

const SHEET_ID = "_css";

/**
 * https://github.com/cristianbote/goober/blob/ffd974336cb3dd3322612e095e316aa85cafe42f/src/core/get-sheet.js
 * @returns {CharacterData}
 */
function getSheet() {
  let sheet = document.querySelector("#" + SHEET_ID);
  if (!sheet) {
    sheet = document.head.appendChild(document.createElement("style"));
    sheet.innerHTML = " ";
    sheet.id = SHEET_ID;
  }
  return sheet.firstChild;
}

/**
 * @param {string} className
 * @param {string} rule
 */
function css(className, rule) {
  const sheet = getSheet();
  if (sheet.data.indexOf(className) < 0) {
    sheet.appendData(rule);
  }
  return className;
}

export { css };

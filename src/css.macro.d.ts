import { CSSProperties } from "react";

interface NestedCSSProperties extends CSSProperties {
  [x: string]: CSSProperties | NestedCSSProperties;
}

declare function css(styleObject: CSSProperties | NestedCSSProperties): string;
declare function css(styleString: TemplateStringsArray): string;

export { css };

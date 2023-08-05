import React from "react";
import {} from "antd";
import BorderDesign from "./BorderDesign";

enum CSSProps {
  FONT_SIZE = "fontSize",
  COLOR = "color",

  FILL = "backgroundColor",
  BORDER = "border",
  PADDING = "padding",
  MARGIN = "margin",
  WIDTH = "width",
  HEIGHT = "height",
}
export default () => {
  return <div>
    <BorderDesign />
  </div>;
};

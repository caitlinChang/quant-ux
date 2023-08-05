import BorderOuter from "./imgs/border-outer.png";
import BorderLeft from "./imgs/border-left.png";
import BorderTop from "./imgs/border-top.png";
import BorderRight from "./imgs/border-right.png";
import BorderBottom from "./imgs/border-bottom.png";

import SolidPng from "./imgs/solid.png";
import DashedPng from "./imgs/dashed.png";
import GroovePng from "./imgs/groove.png";
import NonePng from "./imgs/none.png";

export const BorderAttrlist = [
  {
    label: BorderOuter,
    value: "border",
    style: {
      top: "36px",
      left: "36px",
    },
  },
  {
    label: BorderLeft,
    value: "border-left",
    style: {
      top: "36px",
      left: "0",
    },
  },
  {
    label: BorderTop,
    value: "border-top",
    style: {
      top: "0",
      left: "36px",
    },
  },
  {
    label: BorderRight,
    value: "border-right",
    style: {
      top: "36px",
      right: "0",
    },
  },
  {
    label: BorderBottom,
    value: "border-bottom",
    style: {
      bottom: "-4px",
      left: "36px",
    },
  },
];

export const BorderStyleList = [
  {
    label: NonePng,
    value: "none",
  },
  {
    label: SolidPng,
    value: "solid",
  },
  {
    label: DashedPng,
    value: "dashed",
  },
  {
    label: GroovePng,
    value: "groove",
  },
];

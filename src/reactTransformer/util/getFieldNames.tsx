import { ReactNode } from "react";
import { PropItemConfigType } from "./type";
export type StandardArrayItemType = {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
  icon?: ReactNode;
};

export const getFieldNames = (propsConfig: PropItemConfigType) => {
  return {
    label: "label",
    value: "key",
  };
};

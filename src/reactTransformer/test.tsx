import React from "react";
import { BaseButtonProps } from "./test1";
export type ButtonProps = BaseButtonProps & {
  name?: number | string;
};

// export const Button = (props: ButtonProps) => {
//   return <div>{props.name}</div>;
// };

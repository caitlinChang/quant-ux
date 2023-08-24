import React from "react";
import { Typography } from "antd";

export default (props: { id: string; path: string; value: string }) => {
  return <Typography.Text>{props.value}</Typography.Text>;
};

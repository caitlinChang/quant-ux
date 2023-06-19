import React from "react";
import Icon from "@ant-design/icons";
// @ts-ignore
import ChildBranchSvg from "./childBranch.svg";
// @ts-ignore
import SameLevelBranchSvg from "./sameLevelBranch.svg";

export const ChildBranch = () => {
  return <Icon component={ChildBranchSvg} />;
};

export const SameLevelBranch = () => {
  return <Icon component={SameLevelBranchSvg} />;
};

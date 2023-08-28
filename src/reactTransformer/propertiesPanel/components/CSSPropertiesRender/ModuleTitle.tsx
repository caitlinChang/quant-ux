import React, { useState, ReactNode } from "react";
import { PageHeader, Select, Form, Radio, Tooltip, Typography } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import "./ModuleTitle.less";

export default (props?: {
  children?: ReactNode;
  onToggle?: (v: boolean) => void;
  collapse?: boolean;
  title?: string;
}) => {
  const handleToogleCollapse = () => {
    props?.onToggle?.(!props.collapse);
  };
  return (
    <div
      className={
        props?.collapse
          ? " WIDGET_Deign_Panel_Title_Active "
          : `WIDGET_Deign_Panel_Title`
      }
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography.Text style={{ fontSize: "16px" }}>
          {props.title}
        </Typography.Text>
        <span>
          {props?.collapse ? (
            <PlusOutlined onClick={handleToogleCollapse} />
          ) : (
            <MinusOutlined onClick={handleToogleCollapse} />
          )}
        </span>
      </div>
      <div style={{ paddingTop: "10px" }}>{props.children}</div>
    </div>
  );
};

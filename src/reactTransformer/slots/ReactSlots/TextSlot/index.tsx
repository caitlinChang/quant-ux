import React from "react";
import eventBus from "../../../eventBus";
import { transferPath } from "../../../util/propsValueUtils";
import "./index.less";

export default (props: {
  id: string;
  path: string;
  rootPath?: string;
  rawProps: any;
  value: string;
}) => {
  const handleBlur = (e: any) => {
    const _value = e.target.innerHTML;
    eventBus.emit(`canvasUpdate`, props.rootPath, _value);
  };

  return (
    <span className="slot-wrapper can-edit" onBlur={handleBlur}>
      {props.value}
    </span>
  );
};

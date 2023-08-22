import React from "react";
import eventBus from "../../../eventBus";
import { transferPath } from "../../../util/propsValueUtils";
import "./index.less";

export default (props: {
  id: string;
  path: string;
  rawProps: any;
  value: string;
}) => {
  const handleBlur = (e: any) => {
    const _value = e.target.innerHTML;
    const { key, value, newFormData } = transferPath(
      props.path,
      _value,
      props.rawProps
    );

    // eventBus.emit(`canvasUpdate`, key, value);
    // eventBus.emit(`${props.id}:propsUpdate`, newFormData, `${props.path}[1]`);
  };

  return (
    <span className="slot-wrapper can-edit" onBlur={handleBlur}>
      {props.value}
    </span>
  );
};

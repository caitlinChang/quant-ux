import React, { useState, ReactNode, useEffect } from "react";
import ColorDesign from "./ColorDesign";
import ModuleTitle from "./ModuleTitle";

export default (props?: { value?: string; onChange?: (v: string) => void }) => {
  const [collapse, setCollapse] = useState();

  const onClear = () => {
    props?.onChange?.(undefined);
  };

  const handleToogleCollapse = (v) => {
    setCollapse(v);
    if (v) {
      onClear();
    }
  };

  return (
    <ModuleTitle
      title="背景色"
      onToggle={handleToogleCollapse}
      collapse={collapse}
    >
      <ColorDesign value={props.value} onChange={props.onChange} />
    </ModuleTitle>
  );
};

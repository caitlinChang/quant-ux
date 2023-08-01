import React from "react";
import { SketchPicker, TwitterPicker } from "react-color";
import { Button } from "antd";

export default (props: { value: string; onChange: (v: string) => void }) => {
  const handleChange = (color: any) => {
    console.log("color = ", color);
    props.onChange(color.hex);
  };
  return (
    <>
      <Button block type="dashed" onClick={() => handleChange({ hex: "" })}>
        重置
      </Button>
      <TwitterPicker color={props.value} onChange={handleChange} />
    </>
  );
};

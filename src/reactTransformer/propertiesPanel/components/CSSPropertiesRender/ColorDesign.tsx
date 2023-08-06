import React from 'react';
import { SketchPicker, TwitterPicker } from "react-color";
import { Button, Modal } from "antd";
export default (props?:{value?: string, onChange?: (v: string) => void}) => {
  const [visible, setVisible] = React.useState(false);
  const [color, setColor] = React.useState(props.value);
  const handleColorChange = (color: any) => {
    console.log("color = ", color);
    setColor(color.hex);
  };
  const handleOk = () => {
    props.onChange?.(color);
    setVisible(false);
  };

  console.log("props.value = ", props.value, color);
  return (
    <div>
      <span style={{ display: "flex" }} onClick={() => setVisible(true)}>
        <span
          style={{
            display: "block",
            width: "20px",
            height: "20px",
            backgroundColor: props.value,
            cursor: "pointer",
          }}
        ></span>
        {props.value}
      </span>
      <Modal
        visible={visible}
        title="Color"
        onCancel={() => setVisible(false)}
        onOk={handleOk}
      >
        <TwitterPicker color={props.value} onChange={handleColorChange} />
      </Modal>
    </div>
  );
}
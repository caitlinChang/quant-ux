import React from 'react';
import { SketchPicker, TwitterPicker } from "react-color";
import { Button, Modal } from "antd";
export default (props?:{value?: string, onChange?: (v: string) => void}) => {
  const [visible, setVisible] = React.useState(false);
  const [color, setColor] = React.useState(props.value);
  const handleColorChange = (color: any) => {
    setColor(color.hex);
  };
  const handleOk = () => {
    props.onChange?.(color);
    setVisible(false);
  };

  return (
    <div>
      <span style={{ display: "flex" }} onClick={() => setVisible(true)}>
        <span
          style={{
            display: "block",
            width: "20px",
            height: "20px",
            backgroundColor: props.value || "#000",
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
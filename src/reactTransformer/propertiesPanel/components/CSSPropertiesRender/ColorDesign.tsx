import React from 'react';
import { SketchPicker, TwitterPicker } from "react-color";
import { Button, Modal } from "antd";
export default (props?:{value?: string, onChange?: (v: string) => void}) => {
  const [visible, setVisible] = React.useState(false);
  const [color, setColor] = React.useState(props.value);
  const handleColorChange = (color: any) => {
    setColor(color.hex);
  }
  const handleOk = () => {
    props.onChange?.(color);
    setVisible(false);
  }
  return <div>
    <span onClick={() => setVisible(true)}></span>
    <Modal visible={visible} title="Color" onCancel={() => setVisible(false)} onOk={handleOk}>
      {/* <TwitterPicker color={value} onChange={handleColorChange} /> */}
    </Modal>
  </div>
}
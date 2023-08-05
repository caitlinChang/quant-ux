import { PageHeader,Select, Form, Radio, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ColorDesign from './ColorDesign';
import { BorderAttrlist, BorderStyleList } from "./config";
import "./index.less";

// border: 1px solid #000;
const widthList = () => {
  const list = [];
  for (let i = 0; i < 10; i++) {
    list.push({ label: `${i}px`, value: `${i}px` });
  }
  return list;
};

const BorderSelect = (props?: {
  value?: string;
  onChange?: (v: string) => void;
}) => {
  const handleChange = (v) => {
    console.log("v = ", v);
    props.onChange && props.onChange(v);
  };
  return (
    <div className="icon_button-wrapper">
      {BorderAttrlist.map((item, index) => {
        return (
          <span
            key="index"
            className={
              props?.value === item.value
                ? "icon_button-selected border_icon"
                : "border_icon"
            }
            style={item.style}
            onClick={() => handleChange(item.value)}
          >
            <img src={item.label} alt="" />
          </span>
        );
      })}
    </div>
  );
};

const BorderStyleSelect = (props?: {
  value?: string;
  onChange?: (v: string) => void;
}) => {
  const handleChange = (v) => {
    console.log("v = ", v);
    props?.onChange?.(v);
  };
  return (
    <div className="border_style_icon-wrapper">
      {BorderStyleList.map((item, index) => {
        return (
          <span
            key="index"
            className={
              props?.value === item.value
                ? "icon_button-selected border_style_icon"
                : "border_style_icon"
            }
            onClick={() => handleChange(item.value)}
          >
            <img src={item.label} alt="" />
          </span>
        );
      })}
    </div>
  );
};

const defaultBorderValue = "1px solid #000";

export default (props?: { value?: any; onChange?: (v: any) => void }) => {
  const [collapse, setCollapse] = useState();
  const [borderStyle, setBorderStyle] = useState();
  const form = Form.useForm();
  const handleToogleCollapse = () => {
    if (collapse) {
      setCollapse(false);
    } else {
      setCollapse(true);
    }
  };
  return (
    <div style={{ margin: "0 10px" }} id="BorderDesign">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          // margin: "10px 0",
        }}
      >
        <Typography.Text>边框</Typography.Text>
        <span>
          {collapse ? (
            <PlusOutlined onClick={handleToogleCollapse} />
          ) : (
            <MinusOutlined onClick={handleToogleCollapse} />
          )}
        </span>
      </div>
      {collapse && (
        <div className="design_module">
          <Form
            size="small"
            colon={false}
            labelAlign="right"
            labelCol={{ span: 8 }}
          >
            <div style={{ display: "flex" }}>
              <Form.Item label="" name="border">
                <BorderSelect />
              </Form.Item>
              <div>
                <Form.Item
                  style={{ margin: "8px", padding: 0 }}
                  label="Width"
                  name="width"
                >
                  <Select
                    getPopupContainer={() =>
                      document.getElementById("BorderDesign")
                    }
                    options={widthList()}
                  ></Select>
                </Form.Item>
                <Form.Item
                  style={{ margin: "8px", padding: 0 }}
                  label="Style"
                  name="style"
                >
                  <BorderStyleSelect />
                </Form.Item>
                <Form.Item
                  style={{ margin: "8px", padding: 0 }}
                  label="Color"
                  name="color"
                >
                  <ColorDesign />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};
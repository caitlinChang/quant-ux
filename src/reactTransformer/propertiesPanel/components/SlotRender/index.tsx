import React, { ReactNode, useState, useEffect } from "react";
import { Radio, Input, Button, Tooltip } from "antd";
import { isArray, set } from "lodash";
import { PropItemConfigType } from "../../../util/type";
import {
  CloseCircleFilled,
  MinusOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
export type ValueType = string | [string, any][];
const IconStyle = {
  color: "#e1e1e1",
  cursor: "pointer",
};
export default (props: {
  node: {
    title: ReactNode;
    key: string;
    config: PropItemConfigType;
  };
  value?: ValueType;
  onChange?: (value: ValueType) => void;
  onSelectComponent?: (index: number) => void;
}) => {
  const [type, setType] = useState<"text" | "component">("text");
  const [componentList, setComponentList] = useState([]);
  const [text, setText] = useState("");
  const { node, value } = props;

  useEffect(() => {
    if (isArray(value)) {
      if (isArray(value[0])) {
        setComponentList(value);
      } else {
        setComponentList([value]);
      }
      setType("component");
    } else {
      setText(value);
      setType("text");
    }
  }, [value]);

  const handleChangeProp = (value?: ValueType) => {
    props.onChange?.(value);
  };
  const handleChangeType = (v) => {
    setType(v.target.value);
  };

  const handleChangeComponent = (v, index) => {
    const _componentList = [...componentList];
    _componentList[index] = v;
    setComponentList(_componentList);
    props.onChange?.(_componentList);
  };

  const handleDeleteChild = (index: number) => {
    const _componentList = [...componentList];
    _componentList.splice(index, 1);
    setComponentList(_componentList);
    props.onChange?.(_componentList);
  };

  const handleAddComponent = () => {
    const _componentList = [...componentList];
    _componentList.push([]);
    setComponentList(_componentList);
    props.onChange?.(_componentList);
  };

  const handleChangeText = (e) => {
    if (!e) {
      console.log("编辑文本失败, HTMLEvent 不存在", e);
    }
    const value = e.target.value;
    setText(value);
    props.onChange?.(value);
  };
  return (
    <div>
      <Radio.Group value={type} onChange={handleChangeType}>
        <Radio value="text">输入文本</Radio>
        <Radio value="component">选择组件</Radio>
      </Radio.Group>
      {type === "text" && (
        <Input defaultValue={text} onBlur={(e) => handleChangeText(e)} />
      )}
      {type === "component" && (
        <div>
          <div>
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddComponent}
            />
          </div>
          {componentList.map((c, index) => {
            return (
              <div>
                <span key={index}>{c[0] ? `已选中 ${c[0]}` : "请选择"}</span>
                <Button
                  size="small"
                  icon={<SearchOutlined />}
                  onClick={() => props.onSelectComponent(index)}
                />
                {componentList.length === 1 && (
                  <Button
                    size="small"
                    icon={<CloseCircleFilled />}
                    onClick={() => handleChangeProp()}
                  />
                )}
                {componentList.length >= 1 && (
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => handleDeleteChild(index)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

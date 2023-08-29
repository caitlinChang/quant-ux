import React, { ReactNode, useState, useEffect } from "react";
import { Radio, Input, Button, Tooltip } from "antd";
import { isArray } from "lodash";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { PropItemConfigType, TypeName } from "../../../util/type";
import { ChildrenItemType, ChildrenType } from "../../../util/childrenUtils";

const { Search } = Input;

export type ValueType = string | [string, any][];

function getTypeofChildren(valueItem: string | string[]) {
  if (valueItem.length === 1) {
    return ChildrenItemType.Text;
  } else {
    return ChildrenItemType.Component;
  }
}

export default (props: {
  node: {
    title: ReactNode;
    key: string;
    config: PropItemConfigType;
  };
  value?: ValueType;
  onChange?: (value: ValueType) => void;
  onSelectComponent?: (index: number) => void;
  type?: TypeName;
}) => {
  const [componentList, setComponentList] = useState<ChildrenType>([]);
  const { node, value } = props;
  useEffect(() => {
    if (isArray(value)) {
      setComponentList(value);
    } else if (value) {
      setComponentList([value]);
    } else {
      setComponentList([]);
    }
  }, [value]);

  const handleChangeType = (value: ChildrenItemType, index: number) => {
    const newList = [...componentList];
    newList[index] = value === ChildrenItemType.Text ? [""] : [];
    setComponentList(newList);
  };

  const handleDeleteChild = (index: number) => {
    const _componentList = [...componentList];
    _componentList.splice(index, 1);
    setComponentList(_componentList);
    props.onChange?.(_componentList);
  };

  const handleAddComponent = () => {
    const newList = [...componentList];
    newList.push([""]);
    setComponentList(newList);
  };

  const handleChangeText = (e, index) => {
    if (!e) {
      console.log("编辑文本失败, HTMLEvent 不存在", e);
    }
    const newList = [...componentList];
    const value = e.target.value;
    newList[index] = [value];
    setComponentList(newList);
    props.onChange?.(newList);
  };
  return (
    <div>
      {!(props.type === TypeName.ReactChild && componentList.length >= 1) && (
        <Button size="small" type="dashed" block onClick={handleAddComponent}>
          <PlusOutlined /> 添加
        </Button>
      )}
      {componentList.map((c, index) => {
        return (
          <div
            key={index}
            style={{
              borderTop: "1px solid #f0f0f0",
              borderBottom: "1px solid #f0f0f0",
              padding: "10px 0",
              margin: "10px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <Radio.Group
                size="small"
                value={getTypeofChildren(c)}
                onChange={(e) => handleChangeType(e.target.value, index)}
              >
                <Radio value="text">文本</Radio>
                <Radio value="component">组件</Radio>
              </Radio.Group>
              <Button
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteChild(index)}
              ></Button>
            </div>

            {getTypeofChildren(c) === ChildrenItemType.Text && (
              <Input
                size="small"
                defaultValue={c}
                // allowClear
                placeholder="请输入"
                onBlur={(e) => handleChangeText(e, index)}
              />
            )}
            {getTypeofChildren(c) === ChildrenItemType.Component && (
              <div>
                <Search
                  readOnly
                  value={c[0] || ""}
                  size="small"
                  // allowClear
                  placeholder="请点击选择组件"
                  onSearch={() => props.onSelectComponent(index)}
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

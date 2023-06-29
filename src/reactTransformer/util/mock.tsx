// 根据 Props 生成组件的mock数据， 这里的mock数据不单单是文本类数据，还包括 ReactNode

import React, { ReactNode } from "react";
import { PropItemConfigType, TypeName } from "./type";
import { v4 as uuidv4 } from "uuid";
import { SpecialKey } from "./specialKey";
// import { ControlOutlined } from "@ant-design/icons";

function getRandomBoolean() {
  return Math.random() < 0.5;
}

function getRandomInteger() {
  return Math.floor(Math.random() * 10);
}

// 根据数据类型随机生成 mock 数据
export const getMockDataByType = (keyName, type: TypeName): any => {
  if (keyName === SpecialKey.DISABLED) {
    return false;
  }
  if (keyName === SpecialKey.ICON) {
    return [
      "ControlOutlined",
      {
        style: {
          padding: "5px",
        },
      },
    ];
  }
  switch (type) {
    case "string":
      return uuidv4().substr(0, 5);
    case "number":
      return getRandomInteger();
    // case "boolean":
    //   return getRandomBoolean(); //??? boolean 类型应该需要取默认值，而不是随机mock
    case "ReactNode":
      return "TaskFlow Editor";
    default:
      return undefined;
  }
};

// 根据 props 的类型生成 mock 数据
export const getMockData = (config: PropItemConfigType): any => {
  const {
    type: { name, item },
  } = config;
  const typeName = name;
  if (typeName === "array") {
    // 先默认生成3条数据
    return new Array(3).fill(0).map(() => {
      const itemValue: any = {};
      Object.entries(item).forEach(([key, value]) => {
        if (key === "children") {
          //   itemValue[key] = [];
        } else {
          itemValue[key] = getMockDataByType(key, value as unknown as TypeName);
        }
      });

      return itemValue;
    });
  } else {
    return getMockDataByType(config.name, name);
  }
};

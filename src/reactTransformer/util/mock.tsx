// 根据 Props 生成组件的mock数据， 这里的mock数据不单单是文本类数据，还包括 ReactNode

import React from "react";
import { PropItemConfigType, TypeName } from "./type";
import { v4 as uuidv4 } from "uuid";
import { SpecialKey } from "./specialKey";
import { requestPropsConfig } from "./request";

enum MockType {
  Edit = "Edit", // 用于在 Panel 面板中添加时候的mock, 会只生成一个 key
  View = "View", // 用于初始化展示时候的mock, 会对 require: true 的属性进行mock
}

function getRandomBoolean() {
  return Math.random() < 0.5;
}

function getRandomInteger() {
  return Math.floor(Math.random() * 10);
}

// 根据数据类型随机生成 mock 数据
const getMockDataByType = (
  keyName,
  config: PropItemConfigType,
  mockType?: MockType
): any => {
  const { type } = config;
  const typeName = type.name;
  if (mockType === MockType.Edit) {
    // 用于在 Panel 面板中添加时候的mock, 会只生成一个 key
    switch (typeName) {
      case TypeName.Key:
        return uuidv4().substr(0, 5);
      default:
        return undefined;
    }
  }

  if (keyName === SpecialKey.DISABLED) {
    return false;
  }
  if (keyName === SpecialKey.ICON) {
    return [
      [
        "ControlOutlined",
        {
          style: {
            padding: "5px",
          },
        },
      ],
    ];
  }
  const obj = {};

  switch (typeName) {
    case TypeName.String:
      return "Text";
    case TypeName.Key:
      return uuidv4().substr(0, 5);
    case TypeName.Number:
      return getRandomInteger();
    // case "boolean":
    //   return getRandomBoolean(); //??? boolean 类型应该需要取默认值，而不是随机mock
    case TypeName.ReactNode:
      return [["Typography-Text", { children: [["Edit Me"]] }]];
    case TypeName.ReactChild:
      return [["Typography-Text", { children: [["Edit Me"]] }]];
    case TypeName.Object:
      Object.entries(type.property).forEach(([key, value]) => {
        obj[key] = getMockDataByType(key, value);
      });
      return obj;
    case TypeName.Import:
      return getMockedProps(
        requestPropsConfig(type.importComponentName)?.props
      );
    default:
      return undefined;
  }
};

export const getMockedProps = (propsConfig: {
  [key: string]: PropItemConfigType;
}): any => {
  const data = {};
  Object.entries(propsConfig).forEach(([key, item]) => {
    if (key === "getPopupContainer") {
      data[key] = true;
    }

    if (item.mockData) {
      data[key] = item.mockData;
    }
    if (item.needMock) {
      data[key] = getMockData(propsConfig[key]);
    }
    if (item.defaultValue) {
      data[key] = item.defaultValue;
    }
  });
  return data;
};

export const getArrayItemMockDataByPath = (
  propsConfig: PropItemConfigType
): any => {
  const data = getMockData(propsConfig, MockType.Edit);
  return data[0];
};

// 根据 props 的类型生成 mock 数据
const getMockData = (config: PropItemConfigType, mockType?: MockType): any => {
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
          itemValue[key] = getMockDataByType(key, value, mockType);
        }
      });

      return itemValue;
    });
  } else {
    return getMockDataByType(config.name, config);
  }
};

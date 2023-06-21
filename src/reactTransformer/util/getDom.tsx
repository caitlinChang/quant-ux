import Vue from "vue";
import React from "react";
import ReactDom from "react-dom";
// @ts-ignore
import VueWrapper from "../vueWrapper";
import ContextMenu, { PropsType as ContextMenuProps } from "../contextMenu";
/**
 * 根据 react component 配置信息, 创建一个真实的DOM节点
 * 这里用了一个 VueWrapper 组件, 用来包裹 react 组件，使用
 * Vue 中的方法去创建一个 真实的 DOM 节点
 * @param {*} componentInfo
 * @returns DOM
 */
export const createReactRootDom = (componentInfo) => {
  const container = document.createElement("div");
  const node = new Vue({
    el: container,
    render: (h) =>
      h(VueWrapper, {
        props: {
          componentInfo: componentInfo,
        },
      }),
  }).$mount();
  return node.$el;
};

export const createContextMenu = (
  props: ContextMenuProps,
  container: HTMLElement
) => {
  const element = React.createElement(ContextMenu, props);
  ReactDom.render(element, container);
};

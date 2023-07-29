import Vue from "vue";
import React from "react";
import ReactDom from "react-dom";
// @ts-ignore
import VueWrapper from "../slots/vueWrapper";
import ContextMenu from "../contextMenu";
import { SlotWrapperProps } from "../slots/SlotWrapper";
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

export const createVueDom = (wrapper) => {
  const container = document.createElement("div");
  const node = new Vue({
    el: container,
    render: (h) => h(wrapper),
  }).$mount();
  return node.$el;
};

/**
 * 这个方法是在某 dom 元素上挂一个 react 生成的 dom
 * 注意卸载该 dom 需要用react 提供的卸载 dom 的方法，而不是直接removeChild
 * @param props 
 * @param container 
 */
export const createContextMenu = (props: SlotWrapperProps, container: HTMLElement) => {
  const element = React.createElement(ContextMenu, props);
  ReactDom.render(element, container);
};

export const removeReactDom = (container: HTMLElement) => {
  ReactDom.unmountComponentAtNode(container);
};

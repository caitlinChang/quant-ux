import React, { useEffect } from "react";
import { antdList } from "../util/getWidgets/antd";
import ReactWrapper from "../slots/ReactSlots/ReactWrapper";
export default () => {
  // console.log("ForReact.tsx mounted ---", antdList);
  useEffect(() => {
    setTimeout(() => {
      antdList.forEach((item: any) => {
        const element: any = document.getElementById(
          ["computed-style", item.name].join("-")
        );
        const domName = ["computed-style", item.name].join("-");
        // console.log("domName = ", domName);
        // console.log("get wrapper = ", document.getElementById(domName));
        if (element) {
          const height = element.clientHeight;
          const width = element.clientWidth;
          if (item.name === "Menu") {
            // console.log("antd-menu = ", height, width, item.w, item.h);
            // console.log("element = ", element);
          }
          if (!item.w) {
            item.w = width ? width : 60;
          }
          if (!item.h) {
            item.h = height ? height : 60;
          }
        } else {
          item.w = 60;
          item.h = 60;
        }
      });
      //   document.removeChild(document.getElementById("compute-style"));
    });
  }, []);

  return (
    <div id="compute-style">
      {antdList.map((item: any) => {
        return (
          <div
            className="compute-style-item"
            key={item.name}
            id={`computed-style-${item.name}`}
          >
            <ReactWrapper {...item} />
          </div>
        );
      })}
    </div>
  );
};

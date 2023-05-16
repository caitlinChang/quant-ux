import * as antdComponents from "antd";

const componentMap = {}

const getVueTypeName = (key, prefix) => {
  const name = key.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
  return prefix ? `${prefix}-${name}` : name;
}

const nextComponent = [];

Object.keys(antdComponents).forEach((key) => {
  if(!antdComponents[key]) return;
  const module = antdComponents[key];
  if(nextComponent.includes(key)){
    Object.keys(module).forEach((item) => {
      if(!module[item]) return;
      // 判断 item 首字母是否大写
      if(item[0] === item[0].toUpperCase() && typeof module[item] === 'function'){
        componentMap[getVueTypeName(`${key}${item}`,'antd')] = module[item]
      }
    })
  }else{
    // 双驼峰转中划线
    componentMap[getVueTypeName(key,'antd')] = module;
  }
  
})
export default componentMap;


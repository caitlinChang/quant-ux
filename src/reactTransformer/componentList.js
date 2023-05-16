import { v4 as uuidv4 } from "uuid";
import componentMap from './util/constant';

export const getInitialProps = (key) => {
  const _name = key.replace(/^antd-/g,'');
  const configUrl = `${_name}.json`;
  let fakeProps = {}
  try{
    const config = require(`./props/${configUrl}`);
    if(config && config[0]){
      Object.entries(config[0].props).map((item) => {
        const [propsName,propsInfo] = item
        if(propsInfo.type?.name.indexOf('ReactNode')){
          fakeProps[propsName] = '请编辑';
        }
      })
      return config[0].props;
    }
  }catch(e){
    // console.log('e = ', e)
  }
  return fakeProps;
}

const componentConfigList = Object.keys(componentMap).map((key) => {
  const initialProps = getInitialProps(key);
  return {
    _type: "antd4",
    type: "antd4",
    // w: 200,
    // h: 60,
    // "name":"Typography.Text.1",
    displayName:key,
    cagegory:'Text',
    component: key,
    id: uuidv4(),
    props: initialProps,
  }
})

export default componentConfigList;

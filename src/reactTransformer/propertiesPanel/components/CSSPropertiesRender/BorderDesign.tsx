import { PageHeader,Select, Form, Radio, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ColorDesign from './ColorDesign';
import BorderOuter from './imgs/border-outer.png';
import BorderLeft from './imgs/border-left.png';
import BorderTop from './imgs/border-top.png';
import BorderRight from './imgs/border-right.png';
import BorderBottom from './imgs/border-bottom.png';

import SolidPng from './imgs/solid.png';
import DashedPng from './imgs/dashed.png';
import GroovePng from './imgs/groove.png';
import NonePng from './imgs/none.png';
import './index.less';

const BorderStyleList = [
  {
    label: NonePng,
    value: 'none'
  },
  {
    label: SolidPng,
    value: 'solid'
  },
  {
    label: DashedPng,
    value: 'dashed'
  },
  {
    label: GroovePng,
    value: 'groove'
  },
]

const BorderAttrlist = [
  {
    label: BorderOuter,
    value: 'border'
  },
  {
    label: BorderLeft,
    value: 'border-left'
  },
  {
    label: BorderTop,
    value: 'border-top'
  },
  {
    label: BorderRight,
    value: 'border-right'
  },
  {
    label: BorderBottom,
    value: 'border-bottom'
  }
]

// border: 1px solid #000;
const widthList = () => {
  const list = [];
  for(let i = 0; i < 10; i++){
    list.push({label: `${i}px`, value: `${i}px`})
  }
  return list;
}

const BorderSelect = (props?:{value?: string, onChange?:(v:string) => void}) => {
  const handleChange = (v) => {
    props.onChange && props.onChange(v)
  }
  return <div className="icon_button-wrapper">
    {
      BorderAttrlist.map((item, index) => {
        return  <span key="index" className={props?.value === item.value ? 'icon_button-selected' : 'icon_button'} onChange={() => handleChange(item.value)}>
        <img src={item.label} alt="" />
      </span>
      })
    }
   
  </div>
}

const BorderStyleSelect = (props?:{value?: string, onChange?:(v:string) => void}) => {
  const handleChange = (v) => {
    props.onChange && props.onChange(v)
  }
  return <div className="icon_button-wrapper">
    {
      BorderStyleList.map((item, index) => {
        return  <span key="index" className={props?.value === item.value ? 'icon_button-selected' : 'icon_button'} onChange={() => handleChange(item.value)}>
        <img src={item.label} alt="" />
      </span>
      })
    }
   
  </div>
}

export default () => {
  const [collapse, setCollapse] = useState();
  const [borderStyle, setBorderStyle] = useState();
  const form = Form.useForm();
  const handleToogleCollapse = () => {
    if(collapse){
      setCollapse(false)
    }else{
      setCollapse(true)
    }
  }
  return <div style={{ margin:'0 10px'}} id="BorderDesign">
    <div style={{display:'flex', justifyContent:"space-between"}}>
      <Typography.Text>边框</Typography.Text>
      <span>
        {collapse ? <PlusOutlined onClick={handleToogleCollapse} /> :<MinusOutlined onClick={handleToogleCollapse} />}
      </span>
    </div>
    { collapse && 
    <div>
      <Form size='small'>
        <Form.Item label="" name="border">
          <BorderSelect />
        </Form.Item>
        <Form.Item label="Width" name="width">
          <Select getPopupContainer={() => document.getElementById('BorderDesign')} options={widthList()}></Select>
        </Form.Item>
        <Form.Item label="Style" name="style">
          <BorderStyleSelect></BorderStyleSelect>
        </Form.Item>
        <Form.Item label="Color" name="color">
          <ColorDesign />
        </Form.Item>
      </Form>
    </div> }
  </div>
}
import { PageHeader,Select, Form, Radio, Tooltip } from 'antd';
import React, { useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ColorDesign from './ColorDesign';

// border: 1px solid #000;
export default () => {
  const [collapse, setCollapse] = useState();
  const [borderStyle, setBorderStyle] = useState();
  const handleToogleCollapse = () => {
    if(collapse){
      setCollapse(false)
    }else{
      setCollapse(true)
    }
  }
  return <div>
    <PageHeader title="边框" extra={[ collapse ? <PlusOutlined onClick={handleToogleCollapse} /> :<MinusOutlined onClick={handleToogleCollapse} />]}></PageHeader>
    { collapse && 
    <div>
      <Form>
        <Form.Item label="Border" name="border">
          <Radio.Group>
            <Radio><Tooltip title="All Border">方块</Tooltip></Radio>
            <Radio><Tooltip title="Top Border">Top Border</Tooltip></Radio>
            <Radio><Tooltip title="Right Border">方块</Tooltip></Radio>
            <Radio><Tooltip title="Bottom Border">方块</Tooltip></Radio>
            <Radio><Tooltip title="Left Border">方块</Tooltip></Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Width" name="width">
          <Select options={[{label:'0px', value:0}]}></Select>
        </Form.Item>
        <Form.Item label="Style" name="style">
          <Radio.Group type="button">
            <Radio>solid</Radio>
            <Radio>dashed</Radio>
            <Radio>dotted</Radio>
            <Radio>double</Radio>
            <Radio>groove</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Color" name="color">
          <ColorDesign />
        </Form.Item>
      </Form>
    </div> }
  </div>
}
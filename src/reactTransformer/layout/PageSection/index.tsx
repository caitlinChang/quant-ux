import React from 'react';
import eventBus from '../../eventBus';
import './index.less';

type PropsType = {
    children?: React.ReactNode
}
export default (props: PropsType) => {
    console.log('props = ', props);
    const hasChildren = props?.children !== undefined;
    const handleClick = () => { 
        // eventBus.emit("fillSlot", {
        //     path: 'children',
        //     id: 'PageSection',
        //     formData: {},
        //   });
    }
    return <div className={hasChildren ? "" : "Empty_Layout_Wrapper" } onClick={handleClick}>{ hasChildren ? props?.children : '拖拽或点击选择组件' }</div>
}
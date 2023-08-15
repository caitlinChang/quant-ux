import React from 'react';
import './EmptySlot.less';

export default () => {
    const handleClick = () => { 
        console.log('点击添加组件');
    }
    return <div className="empty_slot" onClick={handleClick}>
        点击添加组件
    </div>
}
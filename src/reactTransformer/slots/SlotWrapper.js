import React from 'react';

export default (child) => {
  return React.createElement('div',{
    className:'slot-wrapper can-edit',
    style: {
      display: 'inline',
    }
  }, child);
}
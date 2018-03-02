import React from 'react';
import './FormElements.css';

const Label = ({ error, className, children, ...props }) => {
  return (
    <label className="label" {...props}>
      {children}
    </label>
  );
};

export default Label;

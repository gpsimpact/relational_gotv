import React from 'react';
import classnames from 'classnames';
import './FormElements.css';
import Label from './Label';
import InputFeedback from './InputFeedback';

const TextInput = ({ type, id, label, error, value, onChange, className, ...props }) => {
  const classes = classnames(
    'input-group',
    {
      'animated shake error': !!error,
    },
    className
  );
  return (
    <div className={classes}>
      <Label htmlFor={id} error={error}>
        {label}
      </Label>
      <input
        id={id}
        className="text-input"
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
      <InputFeedback error={error} />
    </div>
  );
};

export default TextInput;

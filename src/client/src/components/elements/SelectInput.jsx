import React from 'react';
import classnames from 'classnames';
import './FormElements.css';
import Label from './Label';
import InputFeedback from './InputFeedback';
import { FormGroup, Input } from 'reactstrap';

const TextInput = ({ type, id, label, error, value, options, onChange, className, ...props }) => {
  const classes = classnames(
    'input-group',
    {
      'animated shake error': !!error,
    },
    className
  );
  return (
    <div className={classes}>
      <FormGroup>
        <Label htmlFor={id} error={error}>
          {label}
        </Label>
        <Input
          id={id}
          name={id}
          className="select-input"
          type="select"
          value={value}
          onChange={onChange}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Input>
        <InputFeedback error={error} />
      </FormGroup>
    </div>
  );
};

export default TextInput;

import React, { PureComponent } from 'react';
import classnames from 'classnames';
import InputFeedback from './InputFeedback';
import PropTypes from 'prop-types';

class TextArea extends PureComponent {
  render() {
    const { id, label, error, value, onChange, className, ...props } = this.props;
    const classes = classnames(
      'textarea',
      {
        'is-danger': !!error,
      },
      className
    );

    return (
      <div className="field">
        <label className="label">{label}</label>
        <div className="control">
          <textarea
            className={classes}
            type="text"
            id={id}
            value={value}
            onChange={onChange}
            {...props}
          />
        </div>
        <InputFeedback error={error} />
      </div>
    );
  }
}

TextArea.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  touched: PropTypes.bool,
};

export default TextArea;

import React, { PureComponent } from 'react';
import classnames from 'classnames';
import InputFeedback from './InputFeedback';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheck } from '@fortawesome/fontawesome-pro-solid';
import { has } from 'lodash';
import PropTypes from 'prop-types';

class TextInput extends PureComponent {
  render() {
    const {
      type,
      id,
      label,
      error,
      value,
      onChange,
      className,
      touched,
      errorText,
      ...props
    } = this.props;
    const classes = classnames(
      'input',
      {
        'is-danger': !!error,
      },
      className
    );

    return (
      <div className="field">
        <label className="label">{label}</label>
        <div className="control has-icons-right">
          <input
            className={classes}
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            {...props}
          />
          {has(touched, id) ? (
            <span className="icon is-small is-right">
              {error ? (
                <FontAwesomeIcon icon={faExclamationTriangle} />
              ) : (
                <FontAwesomeIcon icon={faCheck} />
              )}
            </span>
          ) : null}
        </div>
        <InputFeedback error={error} errorText={errorText} />
      </div>
    );
  }
}

TextInput.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  errorText: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  touched: PropTypes.object,
};

export default TextInput;

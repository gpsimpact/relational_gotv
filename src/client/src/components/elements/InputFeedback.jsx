import React from 'react';
import PropTypes from 'prop-types';

const InputFeedback = ({ error, errorText }) =>
  error ? <div className="help is-danger">{errorText}</div> : null;

InputFeedback.propTypes = {
  error: PropTypes.bool,
  errorText: PropTypes.string,
};

export default InputFeedback;

import React from 'react';
import PropTypes from 'prop-types';

const InputFeedback = ({ error }) => (error ? <div className="help is-danger">{error}</div> : null);

InputFeedback.propTypes = {
  error: PropTypes.string,
};

export default InputFeedback;

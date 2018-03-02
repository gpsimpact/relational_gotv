import React from 'react';
import PropTypes from 'prop-types';

const FormError = ({ error }) => {
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  return null;
};

FormError.propTypes = {
  error: PropTypes.string,
};

FormError.defaultProps = {
  error: null,
};

export default FormError;

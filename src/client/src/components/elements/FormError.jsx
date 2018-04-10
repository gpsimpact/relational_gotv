import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class FormError extends PureComponent {
  state = {
    open: true,
  };
  render() {
    if (!this.state.open) return null;
    return (
      <div className="notification is-danger">
        <button onClick={() => this.setState({ open: !this.state.open })} className="delete" />
        {this.props.error}
      </div>
    );
  }
}

FormError.propTypes = {
  error: PropTypes.string,
};

export default FormError;

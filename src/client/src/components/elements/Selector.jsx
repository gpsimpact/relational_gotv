import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InputFeedback from './InputFeedback';

class Selector extends PureComponent {
  render() {
    return (
      <div className="field">
        <label className="label">{this.props.label}</label>
        <div className="select">
          <select
            id={this.props.id}
            onChange={this.props.onChange}
            onBlur={this.props.onBlur}
            value={this.props.value}
          >
            {this.props.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <InputFeedback error={this.props.error} />
      </div>
    );
  }
}

Selector.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
};

export default Selector;

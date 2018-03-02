import React from 'react';
import './FormElements.css';

const InputFeedback = ({ error }) => (error ? <div className="input-feedback">{error}</div> : null);

export default InputFeedback;

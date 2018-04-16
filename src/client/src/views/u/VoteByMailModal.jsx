import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class VoteByMailModal extends Component {
  render() {
    const { potentialVoter } = this.props;
    return (
      <div className={classNames('modal', { 'is-active': this.props.open })}>
        <div className="modal-background" onClick={() => this.props.close()} />

        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Vote By Mail</p>
            <button className="delete" aria-label="close" onClick={() => this.props.close()} />
          </header>
          <section className="modal-card-body">
            <div className="content">
              <h4>
                {potentialVoter.first_name} {potentialVoter.last_name} is{' '}
                {potentialVoter.voterFileRecord.vo_ab_requested ? 'NOT' : null} registerd to vote by
                mail!
              </h4>
              <p>
                Add some vote by mail instructions here. Make sure to include date where info is
                current
              </p>
            </div>
          </section>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => this.props.close()}
        />
      </div>
    );
  }
}

VoteByMailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  potentialVoter: PropTypes.object.isRequired,
};

export default VoteByMailModal;

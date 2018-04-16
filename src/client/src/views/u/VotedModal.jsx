import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class VotedModal extends Component {
  render() {
    const { potentialVoter } = this.props;
    return (
      <div className={classNames('modal', { 'is-active': this.props.open })}>
        <div className="modal-background" onClick={() => this.props.close()} />

        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Voted</p>
            <button className="delete" aria-label="close" onClick={() => this.props.close()} />
          </header>
          <section className="modal-card-body">
            <div className="content">
              <h4>
                {potentialVoter.first_name} {potentialVoter.last_name} has{' '}
                {potentialVoter.voterFileRecord.vo_voted ? 'NOT' : null} voted in the General 2018
                election.
              </h4>
              <p>
                Voted status stuff here. Date & method voted or so on. For those who have not yet
                voted, then some other info.
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

VotedModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  potentialVoter: PropTypes.object.isRequired,
};

export default VotedModal;

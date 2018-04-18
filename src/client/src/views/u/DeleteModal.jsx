import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import DeletePotentialVoterButton from './DeletePotentialVoterButton';

class DeleteModal extends Component {
  render() {
    const { potentialVoter } = this.props;
    return (
      <div className={classNames('modal', { 'is-active': this.props.open })}>
        <div className="modal-background" onClick={this.props.close} />

        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Delete Contact</p>
            <button className="delete" aria-label="close" onClick={() => this.props.close()} />
          </header>
          <section className="modal-card-body">
            <div className="content">
              <h4>
                Are you sure you want to delete {potentialVoter.first_name}{' '}
                {potentialVoter.last_name}?
              </h4>
              <p>
                This is permanent. Any points earned by completing tasks associated with this
                contact WILL NOT be removed
              </p>
              <DeletePotentialVoterButton
                pv_id={potentialVoter.id}
                close_modal={this.props.close}
              />
            </div>
          </section>
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={this.props.close} />
      </div>
    );
  }
}

DeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  potentialVoter: PropTypes.object.isRequired,
};

export default DeleteModal;

import React, { Component } from 'react';
import classNames from 'classnames';
// import VoterSearchForm from './VoterSearchForm';
// import VoterSearchResults from './VoterSearchResults';
import PropTypes from 'prop-types';
// import PotentialVotersList from './PotentialVotersList';
import { parse, differenceInCalendarYears } from 'date-fns';
import DisassociateVoterButton from './DisassociateVoterButton';

// state_file_id
// first_name
// middle_name
// last_name
// home_address
// city
// state
// zipcode
// dob
// vo_ab_requested
// vo_ab_requested_date
// vo_voted
// vo_voted_date
// vo_voted_method

class LinkedVoterFileRecordReviewModal extends Component {
  render() {
    const { potentialVoter } = this.props;
    return (
      <div className={classNames('modal', { 'is-active': this.props.open })}>
        <div className="modal-background" onClick={() => this.props.close()} />

        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Associated Voter File Record</p>
            <button className="delete" aria-label="close" onClick={() => this.props.close()} />
          </header>
          <section className="modal-card-body">
            <div className="content">
              {potentialVoter.voterFileRecord.state_file_id ? (
                <div>
                  <h4>
                    {potentialVoter.first_name} {potentialVoter.last_name} is linked to voter file
                    record:
                  </h4>
                  <dl>
                    <dt>
                      <strong>KS Voter File Id</strong>
                    </dt>
                    <dd>{potentialVoter.voterFileRecord.state_file_id}</dd>
                    <dt>
                      <strong>Name</strong>
                    </dt>
                    <dd>
                      {potentialVoter.voterFileRecord.first_name}&nbsp;
                      {potentialVoter.voterFileRecord.middle_name}&nbsp;
                      {potentialVoter.voterFileRecord.last_name}
                    </dd>
                    <dt>
                      <strong>Address</strong>
                    </dt>
                    <dd>{`${potentialVoter.voterFileRecord.home_address} - ${
                      potentialVoter.voterFileRecord.city
                    }, ${potentialVoter.voterFileRecord.state} ${
                      potentialVoter.voterFileRecord.zipcode
                    }`}</dd>

                    <dt>
                      <strong>Age</strong>
                    </dt>
                    {potentialVoter &&
                    potentialVoter.voterFileRecord &&
                    potentialVoter.voterFileRecord.dob ? (
                      <dd>
                        {differenceInCalendarYears(
                          new Date(),
                          parse(potentialVoter.voterFileRecord.dob)
                        )}{' '}
                        years old
                      </dd>
                    ) : (
                      <dd>?</dd>
                    )}
                  </dl>
                </div>
              ) : (
                <div>
                  <h4>
                    {potentialVoter.first_name} {potentialVoter.last_name} is NOT currently linked
                    to voter file record
                  </h4>
                  <p>
                    This contact is not currently matched to a voter file record. Click below to
                    attempt to search for their record to link to this contact.
                  </p>
                  <button
                    className="button is-link submit-button is-fullwidth"
                    color="primary"
                    onClick={() => {
                      this.props.close();
                      this.props.openVoterSearchModal();
                    }}
                  >
                    Search for matching voter records
                  </button>
                </div>
              )}
            </div>
          </section>

          <footer className="modal-card-foot">
            {potentialVoter.voterFileRecord.state_file_id ? (
              <DisassociateVoterButton
                pv_id={potentialVoter && potentialVoter.id}
                close_modal={this.props.close}
              />
            ) : null}
          </footer>
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

LinkedVoterFileRecordReviewModal.propTypes = {
  potentialVoter: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  openVoterSearchModal: PropTypes.func.isRequired,
};

export default LinkedVoterFileRecordReviewModal;

import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import DATA_DATES from '../../data/queries/dataDates';
import { parse, distanceInWordsToNow } from 'date-fns';

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
              <Query query={DATA_DATES}>
                {({ loading, error, data: { dataDates } }) => {
                  if (loading) return <div className="loader" />;
                  if (error) return <p>Error!</p>;
                  return (
                    <div className="notification is-warning">
                      {dataDates.EARLY_VOTE_DATA_DATE ? (
                        <div>
                          Vote By Mail information is complete as of{' '}
                          {distanceInWordsToNow(parse(dataDates.EARLY_VOTE_DATA_DATE))}.{' '}
                        </div>
                      ) : (
                        <div>
                          Vote By Mail data will not be available until 20 days out from the General
                          election. Check back after 10/17/2018
                        </div>
                      )}
                    </div>
                  );
                }}
              </Query>
              <h4>
                {potentialVoter.first_name} {potentialVoter.last_name} is{' '}
                {potentialVoter.voterFileRecord.vo_ab_requested ? null : 'NOT'} registered to vote
                by mail!
              </h4>
              {potentialVoter.voterFileRecord.vo_ab_requested ? (
                <p>
                  {potentialVoter.first_name} {potentialVoter.last_name} should be receiving their
                  ballot via mail approximately 20 days before the November 2018 election. We'll
                  create tasks to help you remind this person how to complete and return their
                  ballot.
                </p>
              ) : (
                <div>
                <p>
                  With advance voting, any registered voter can vote by mail before election day. We
                  reccomend you encourage your contacts to vote by mail for several reasons:
                 
                </p>
                  <ul>
                    <li>Voters can skip the lines on election day!</li>
                    <li>
                      It's easier to track who has already voted before it's too late to do
                      something about it
                    </li>
                  </ul>
                  </div>
              )}
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

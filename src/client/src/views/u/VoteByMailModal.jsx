import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import DATA_DATES from '../../data/queries/dataDates';
import { parse, distanceInWordsToNow } from 'date-fns';

class VoteByMailModal extends Component {
  render() {
    const { potentialVoter, cycle } = this.props;
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
                        <span>
                          Vote By Mail data will not be available until 20 days out from the{' '}
                          {`${cycle}`} election. Check back after{' '}
                          {cycle === 'primary' ? '7/13/2018' : '10/17/2018'}
                        </span>
                      )}
                    </div>
                  );
                }}
              </Query>
              {cycle === 'primary' ? (
                <div>
                  <h4>
                    {potentialVoter.voterFileRecord.first_name}{' '}
                    {potentialVoter.voterFileRecord.last_name} is{' '}
                    {potentialVoter.voterFileRecord.vo_ab_requested_primary ? null : 'NOT'}{' '}
                    registered to vote by mail for the primary election!
                  </h4>
                  {potentialVoter.voterFileRecord.vo_ab_requested_primary ? (
                    <p>
                      {potentialVoter.voterFileRecord.first_name}{' '}
                      {potentialVoter.voterFileRecord.last_name} should be receiving a ballot via
                      mail approximately 20 days before the August 7th 2018 election. We&apos;ll
                      create tasks to help you remind this person how to complete and return their
                      ballot.
                    </p>
                  ) : null}
                </div>
              ) : (
                <div>
                  <h4>
                    {potentialVoter.voterFileRecord.first_name}{' '}
                    {potentialVoter.voterFileRecord.last_name} is{' '}
                    {potentialVoter.voterFileRecord.vo_ab_requested_general ? null : 'NOT'}
                    registered to vote by mail for the general election!
                  </h4>
                  {potentialVoter.voterFileRecord.vo_ab_requested_general ? (
                    <p>
                      {potentialVoter.voterFileRecord.first_name}{' '}
                      {potentialVoter.voterFileRecord.last_name} should be receiving a ballot via
                      mail approximately 20 days before the November 6th 2018 election. We&apos;ll
                      create tasks to help you remind this person how to complete and return their
                      ballot.
                    </p>
                  ) : null}
                </div>
              )}
              {(cycle === 'primary' && !potentialVoter.voterFileRecord.vo_ab_requested_primary) ||
              (cycle === 'general' && !potentialVoter.voterFileRecord.vo_ab_requested_general) ? (
                <div>
                  <p>
                    With advance voting, any registered voter can vote by mail before election day.
                    We reccomend you encourage your contacts to vote by mail for several reasons:
                  </p>
                  <ul>
                    <li>Voters can skip the lines on election day!</li>
                    <li>
                      It&apos;s easier to track who has already voted before it&apos;s too late to
                      do something about it
                    </li>
                  </ul>
                </div>
              ) : null}
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
  cycle: PropTypes.string.isRequired,
};

export default VoteByMailModal;

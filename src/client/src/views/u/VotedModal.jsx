import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import DATA_DATES from '../../data/queries/dataDates';
import { parse, distanceInWordsToNow, format } from 'date-fns';

class VotedModal extends Component {
  render() {
    const { potentialVoter, cycle } = this.props;
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
              <Query query={DATA_DATES}>
                {({ loading, error, data: { dataDates } }) => {
                  if (loading) return <div className="loader" />;
                  if (error) return <p>Error!</p>;
                  return (
                    <div className="notification is-warning">
                      {dataDates.EARLY_VOTE_DATA_DATE ? (
                        <div>
                          Data about who has voted is complete as of{' '}
                          {distanceInWordsToNow(parse(dataDates.EARLY_VOTE_DATA_DATE))}.{' '}
                        </div>
                      ) : (
                        <div>
                          Data about who has voted will not be available until 20 days out from the{' '}
                          {`${cycle}`} election. Check back after{' '}
                          {cycle === 'primary' ? '7/13/2018' : '10/17/2018'}
                        </div>
                      )}
                    </div>
                  );
                }}
              </Query>
              {cycle === 'primary' ? (
                <div>
                  <h4>
                    {potentialVoter.first_name} {potentialVoter.last_name} has{' '}
                    {potentialVoter.voterFileRecord.vo_voted_primary ? null : 'NOT'} voted in the
                    Primary 2018 election!
                  </h4>
                  <div>
                    {potentialVoter.voterFileRecord.vo_voted_primary ? (
                      <p>
                        Hooray! {potentialVoter.voterFileRecord.first_name} voted on{' '}
                        {format(
                          parse(potentialVoter.voterFileRecord.vo_voted_date_primary),
                          'MM/DD/YYYY'
                        )}{' '}
                        via &quot;{potentialVoter.voterFileRecord.vo_voted_method_primary}&quot;
                      </p>
                    ) : (
                      <p>
                        We&apos;ve not yet seen data indicating that {potentialVoter.first_name} has
                        voted. Encourage them to vote early via mail or in-person.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h4>
                    {potentialVoter.first_name} {potentialVoter.last_name} has{' '}
                    {potentialVoter.voterFileRecord.vo_voted_general ? null : 'NOT'} voted in the
                    General 2018 election!
                  </h4>
                  <div>
                    {potentialVoter.voterFileRecord.vo_voted_general ? (
                      <p>
                        Hooray! {potentialVoter.voterFileRecord.first_name} voted on{' '}
                        {format(
                          parse(potentialVoter.voterFileRecord.vo_voted_date_general),
                          'MM/DD/YYYY'
                        )}{' '}
                        via &quot;{potentialVoter.voterFileRecord.vo_voted_method_general}&quot;
                      </p>
                    ) : (
                      <p>
                        We&apos;ve not yet seen data indicating that {potentialVoter.first_name} has
                        voted. Encourage them to vote early via mail or in-person.
                      </p>
                    )}
                  </div>
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

VotedModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  potentialVoter: PropTypes.object.isRequired,
};

export default VotedModal;

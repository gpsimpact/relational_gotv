import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import DATA_DATES from '../../data/queries/dataDates';
import { parse, distanceInWordsToNow } from 'date-fns';

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
                          Data about who has voted will not be available until 20 days out from the
                          General election when early vote information is published. Check back
                          after 10/17/2018
                        </div>
                      )}
                    </div>
                  );
                }}
              </Query>
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

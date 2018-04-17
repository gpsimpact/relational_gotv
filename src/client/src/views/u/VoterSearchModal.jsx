import React, { Component } from 'react';
import classNames from 'classnames';
import VoterSearchForm from './VoterSearchForm';
import VoterSearchResults from './VoterSearchResults';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Query } from 'react-apollo';
import DATA_DATES from '../../data/queries/dataDates';
import { parse, distanceInWordsToNow } from 'date-fns';

class VoterSearchModal extends Component {
  state = {
    first_name: this.props.potentialVoter.first_name,
    last_name: this.props.potentialVoter.last_name,
    city: this.props.potentialVoter.city,
    state: 'KS',
    pv_id: this.props.potentialVoter.id,
    potentialVoter: this.props.potentialVoter,
  };

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.potentialVoter, this.props.potentialVoter)) {
      this.setState({
        potentialVoter: nextProps.potentialVoter,
        first_name: nextProps.potentialVoter.first_name,
        last_name: nextProps.potentialVoter.last_name,
        city: nextProps.potentialVoter.city,
        pv_id: nextProps.potentialVoter.id,
      });
    }
  }

  render() {
    return (
      <div className={classNames('modal', { 'is-active': this.props.open })}>
        <div className="modal-background" onClick={() => this.props.close()} />

        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Match to Voter File Record</p>
            <button className="delete" aria-label="close" onClick={() => this.props.close()} />
          </header>
          <section className="modal-card-body">
            <Query query={DATA_DATES}>
              {({ loading, error, data: { dataDates } }) => {
                if (loading) return <div className="loader" />;
                if (error) return <p>Error!</p>;
                return (
                  <div className="notification is-warning">
                    Voter information is complete as of{' '}
                    {distanceInWordsToNow(parse(dataDates.voterFileDate))} ago. We tend to update
                    data once per month so check back soon if you can not find a match yet.
                  </div>
                );
              }}
            </Query>
            <VoterSearchForm
              first_name={this.state.potentialVoter.first_name}
              last_name={this.state.potentialVoter.last_name}
              city={this.state.potentialVoter.city}
              state={this.state.potentialVoter.state}
              update={values => this.setState(values)}
            />
            <VoterSearchResults
              first_name={this.state.first_name}
              last_name={this.state.last_name}
              city={this.state.city}
              state={this.state.state}
              pv_id={this.state.pv_id}
              close_modal={this.props.close}
            />
          </section>

          <footer className="modal-card-foot">
            <button className="button is-danger" onClick={() => this.props.close()}>
              There is no match
            </button>
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

VoterSearchModal.propTypes = {
  // first_name: PropTypes.string,
  // last_name: PropTypes.string,
  // city: PropTypes.string,
  // state: PropTypes.string,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  // pv_id: PropTypes.string.isRequired,
  potentialVoter: PropTypes.object.isRequired,
};

export default VoterSearchModal;

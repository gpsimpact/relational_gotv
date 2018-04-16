import React, { Component } from 'react';
import classNames from 'classnames';
import VoterSearchForm from './VoterSearchForm';
import VoterSearchResults from './VoterSearchResults';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

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
    // if (nextProps.first_name !== this.props.first_name) {
    //   this.setState({ first_name: nextProps.first_name });
    // }
    // if (nextProps.last_name !== this.props.last_name) {
    //   this.setState({ last_name: nextProps.last_name });
    // }
    // if (nextProps.city !== this.props.city) {
    //   this.setState({ city: nextProps.city });
    // }
    // if (nextProps.state !== this.props.state) {
    //   this.setState({ state: nextProps.state });
    // }
    // if (nextProps.pv_id !== this.props.pv_id) {
    //   this.setState({ pv_id: nextProps.pv_id });
    // }
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

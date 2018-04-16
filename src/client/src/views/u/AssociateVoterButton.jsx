import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import ASSOCIATE_PV_VOTER from '../../data/mutations/associatePvWithVoter';
import MY_POTENTIAL_VOTERS from '../../data/queries/potentialVoters';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';

export class AssociateButton extends Component {
  render() {
    return (
      <Mutation
        mutation={ASSOCIATE_PV_VOTER}
        variables={{ pv_id: this.props.pv_id, voter_id: this.props.voter_id }}
        update={(store, { data: { updatePotentialVoter } }) => {
          const data = store.readQuery({
            query: MY_POTENTIAL_VOTERS,
            variables: { limit: 25, org_id: this.props.match.params.orgSlug },
          });
          // Find item index of mutated list item
          var index = findIndex(data.potentialVoters.items, { id: updatePotentialVoter.id });
          // Replace item at index using native splice
          data.potentialVoters.items.splice(index, 1, updatePotentialVoter);
          // Write our data back to the cache.
          store.writeQuery({
            query: MY_POTENTIAL_VOTERS,
            variables: { limit: 25, org_id: this.props.match.params.orgSlug },
            data,
          });
        }}
      >
        {associateVoter => (
          <button
            className="button is-primary"
            onClick={() => associateVoter().then(() => this.props.close_modal())}
          >
            This is them
          </button>
        )}
      </Mutation>
    );
  }
}

AssociateButton.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  pv_id: PropTypes.string.isRequired,
  voter_id: PropTypes.string.isRequired,
  close_modal: PropTypes.func.isRequired,
};

export default withRouter(AssociateButton);

import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
// import ASSOCIATE_PV_VOTER from '../../data/mutations/associatePvWithVoter';
import MY_POTENTIAL_VOTERS from '../../data/queries/potentialVoters';
import UPDATE_PV from '../../data/mutations/modifyPV';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/fontawesome-pro-solid';

export class DeletePotentialVoterButton extends Component {
  render() {
    return (
      <Mutation
        mutation={UPDATE_PV}
        variables={{ id: this.props.pv_id, data: { deleted: true } }}
        update={(store, { data: { updatePotentialVoter } }) => {
          const data = store.readQuery({
            query: MY_POTENTIAL_VOTERS,
            variables: { limit: 25, org_id: this.props.match.params.orgSlug },
          });

          // remove item from cache
          data.potentialVoters.items = filter(
            data.potentialVoters.items,
            item => item.id !== updatePotentialVoter.id
          );

          store.writeQuery({
            query: MY_POTENTIAL_VOTERS,
            variables: { limit: 25, org_id: this.props.match.params.orgSlug },
            data,
          });
        }}
      >
        {updatePotentialVoter => (
          <button
            className="button is-danger"
            onClick={() => updatePotentialVoter().then(() => this.props.close_modal())}
          >
            <span className="icon">
              <FontAwesomeIcon icon={faExclamation} />
            </span>
            <span>Delete contact</span>
          </button>
        )}
      </Mutation>
    );
  }
}

DeletePotentialVoterButton.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  pv_id: PropTypes.string.isRequired,
  close_modal: PropTypes.func.isRequired,
};

export default withRouter(DeletePotentialVoterButton);

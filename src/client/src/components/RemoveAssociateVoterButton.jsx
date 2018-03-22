import React, { Component } from 'react';
// import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
// import FontAwesomeIcon from '@fortawesome/react-fontawesome';
// import { withRouter } from 'react-router-dom';
// import { faSquare, faCheckSquare } from '@fortawesome/fontawesome-pro-light';
// import MY_POTENTIAL_VOTERS from '../queries/myPotentialVoters';
import POTENTIAL_VOTER_INFO from '../queries/potentialVoterInfo';
import ASSOCIATE_PV_VOTER from '../mutations/associatePvWithVoter';
import { Button } from 'reactstrap';

export class RemoveAssociateVoterButton extends Component {
  render() {
    return (
      <Button
        size="sm"
        color="danger"
        onClick={() => {
          this.props.associateVoter(this.props.pv_id, null);
        }}
      >
        Wrong Voter
      </Button>
    );
  }
}

// const AssociateButtonWithData = graphql(MY_POTENTIAL_VOTERS, {
//   options: props => ({ variables: { pvid: props.pvid, voter_id: props.voter_id } }),
// })(withRouter(AssociateButton));

const RemoveAssociateVoterButtonWithData = graphql(ASSOCIATE_PV_VOTER, {
  props: ({ mutate }) => ({
    associateVoter: (pv_id, voter_id) =>
      mutate({
        variables: { pv_id, voter_id },
        refetchQueries: [
          {
            query: POTENTIAL_VOTER_INFO,
            variables: { id: pv_id },
          },
        ],
      }),
  }),
})(RemoveAssociateVoterButton);

export default RemoveAssociateVoterButtonWithData;

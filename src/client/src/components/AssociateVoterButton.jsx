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

export class AssociateButton extends Component {
  render() {
    return (
      <Button
        onClick={() => {
          this.props.associateVoter(this.props.pv_id, this.props.voter_id);
        }}
      >
        Associate
      </Button>
    );
  }
}

const AssociateButtonWithData = graphql(ASSOCIATE_PV_VOTER, {
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
})(AssociateButton);

export default AssociateButtonWithData;

import React, { PureComponent } from 'react';
import POTENTIAL_VOTER_INFO from '../queries/potentialVoterInfo';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import VoterProfile from './VoterProfile';
import VoterSearch from './VoterSearch';

export class PvIndex extends PureComponent {
  render() {
    const { data: { loading, error, potentialVoterInfo } } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>Error!</p>;
    }
    return (
      <div>
        <Row style={{ paddingTop: 20 }}>
          <Col>
            <h2>
              {potentialVoterInfo.first_name} {potentialVoterInfo.last_name} -{' '}
              {potentialVoterInfo.city}
            </h2>
          </Col>
        </Row>
        <Row>
          <Col>
            {potentialVoterInfo.state_file_id ? (
              <VoterProfile state_file_id={potentialVoterInfo.state_file_id} />
            ) : (
              <VoterSearch potential_voter={potentialVoterInfo} />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const PvIndexWithData = graphql(POTENTIAL_VOTER_INFO, {
  options: props => ({ variables: { id: props.match.params.pvid } }),
})(withRouter(PvIndex));

export default PvIndexWithData;

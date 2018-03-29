import React, { PureComponent } from 'react';
import VOTER_INFO from '../queries/voterInfo';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  CardTitle,
  CardSubtitle,
  Media,
} from 'reactstrap';
import { faBadgeCheck, faClipboardList } from '@fortawesome/fontawesome-pro-solid';
import { faEnvelope } from '@fortawesome/fontawesome-pro-regular';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import RemoveAssociateVoterButton from './RemoveAssociateVoterButton';

export class VoterProfile extends PureComponent {
  render() {
    const { data: { loading, error, voter } } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>Error!</p>;
    }
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {voter.first_name} {voter.middle_name ? `${voter.middle_name.charAt(0)}.` : null}{' '}
            {voter.last_name}
          </CardTitle>
          <CardSubtitle>
            {voter.home_address} {voter.city}, {voter.state} {voter.zipcode}
          </CardSubtitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              <Media>
                <Media left>
                  <FontAwesomeIcon icon={faClipboardList} size="3x" className="text-success" />
                </Media>
                <Media body style={{ paddingLeft: 10 }}>
                  <Media heading>Registered To Vote!</Media>
                  {voter.first_name} is registered and eligible to vote at the address listed above!
                </Media>
              </Media>
            </Col>
            <Col>
              {voter.vo_ab_requested ? (
                <Media>
                  <Media left>
                    <FontAwesomeIcon icon={faEnvelope} size="3x" className="text-success" />
                  </Media>
                  <Media body style={{ paddingLeft: 10 }}>
                    <Media heading>Vote by Mail Requested!</Media>
                    {voter.first_name} will receive a ballot via mail approximately 20 days out from
                    the election.
                  </Media>
                </Media>
              ) : (
                <Media>
                  <Media left>
                    <FontAwesomeIcon icon={faEnvelope} size="3x" className="text-danger" />
                  </Media>
                  <Media body style={{ paddingLeft: 10 }}>
                    <Media heading>Not voting by mail!</Media>
                    {voter.first_name} is not currently taking advantage of vote-by-mail. Help them
                    to request a ballot!
                  </Media>
                </Media>
              )}
            </Col>
            <Col>
              {voter.vo_voted ? (
                <Media>
                  <Media left>
                    <FontAwesomeIcon icon={faBadgeCheck} size="3x" className="text-success" />
                  </Media>
                  <Media body style={{ paddingLeft: 10 }}>
                    <Media heading>Voted!</Media>
                    {voter.first_name} has successfully voter via "{voter.vo_voted_method}" on{' '}
                    {voter.vo_voted_iso8601}
                  </Media>
                </Media>
              ) : (
                <Media>
                  <Media left>
                    <FontAwesomeIcon icon={faBadgeCheck} size="3x" className="text-danger" />
                  </Media>
                  <Media body style={{ paddingLeft: 10 }}>
                    <Media heading>Not yet voted!</Media>
                    {voter.first_name} has not yet voted. Go get em!
                  </Media>
                </Media>
              )}
            </Col>
          </Row>
        </CardBody>
        <CardFooter className="text-right">
          <RemoveAssociateVoterButton
            pv_id={this.props.match.params.pvid}
            voter_id={voter.state_file_id}
          />
        </CardFooter>
      </Card>
    );
  }
}

const VoterProfileWithData = graphql(VOTER_INFO, {
  options: props => ({ variables: { state_file_id: props.state_file_id } }),
})(withRouter(VoterProfile));

export default VoterProfileWithData;

import React, { PureComponent } from 'react';
import POINTS_PROFILE_USER_ORG_LIMITED from '../queries/pointsProfileUserOrgLimited';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { getUserEmail } from '../utils/auth';

export class PointsProfile extends PureComponent {
  render() {
    const { data: { loading, error, points } } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>Error!</p>;
    }
    return (
      <Card>
        <CardHeader>
          <CardTitle>Points</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              <h4>
                {points && points.items && points.items[0].earned ? points.items[0].earned : 0}{' '}
                points earned
              </h4>
              <p>
                {' '}
                You have the potential to earn{' '}
                {points && points.items && points.items[0].potential
                  ? points.items[0].potential
                  : 0}{' '}
                points by completing tasks. Click on a contact to complete tasks.
              </p>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

const PointsProfileWithData = graphql(POINTS_PROFILE_USER_ORG_LIMITED, {
  options: props => ({ variables: { email: getUserEmail(), org_id: props.org_id } }),
})(withRouter(PointsProfile));

export default PointsProfileWithData;

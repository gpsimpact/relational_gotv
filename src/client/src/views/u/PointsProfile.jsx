import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import POINTS_PROFILE_USER_ORG_LIMITED from '../../data/queries/pointsProfileUserOrgLimited';
import { getUserEmail } from '../../utils/auth';
import { has } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';

class PointsProfile extends PureComponent {
  render() {
    return (
      <Query
        query={POINTS_PROFILE_USER_ORG_LIMITED}
        variables={{ email: getUserEmail(), org_id: this.props.match.params.orgSlug }}
      >
        {({ loading, error, data: { points } }) => {
          if (loading) return <div className="loader" />;
          if (error) return <p>Error!</p>;
          if (points.items.length > 0 && has(points.items[0], 'earned')) {
            return (
              <div className="content box">
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
              </div>
            );
          }
          return null;
        }}
      </Query>
    );
  }
}

PointsProfile.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(PointsProfile);

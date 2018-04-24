import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import ORG_DETAILS from '../../data/queries/orgInfo';
import { withRouter } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faPhone, faAt } from '@fortawesome/fontawesome-pro-light';
// import { isLoggedIn, hasOrgAccess } from '../utils/auth';
import ReactRouterPropTypes from 'react-router-prop-types';

class OrgSidebarInfo extends PureComponent {
  render() {
    return (
      <Query query={ORG_DETAILS} variables={{ where: { id: this.props.match.params.orgSlug } }}>
        {({ loading, error, data: { organization } }) => {
          if (loading) return <div className="loader" />;
          if (error) return <p>Error!</p>;
          return (
            <div>
              <div className="content box">
                <h4>For assistance contact:</h4>
                <p>
                  {organization.contact_name} <br />
                  <FontAwesomeIcon icon={faPhone} />{' '}
                  <span style={{ paddingLeft: 20 }}>{organization.contact_phone}</span> <br />
                  <FontAwesomeIcon icon={faAt} />
                  <span style={{ paddingLeft: 20 }}>{organization.contact_email}</span>
                </p>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

OrgSidebarInfo.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(OrgSidebarInfo);

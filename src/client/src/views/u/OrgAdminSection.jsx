import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import ORG_DETAILS from '../../data/queries/orgInfo';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import ReactMarkdown from 'react-markdown';

class OrgAdminSection extends PureComponent {
  render() {
    return (
      <Query query={ORG_DETAILS} variables={{ where: { id: this.props.match.params.orgSlug } }}>
        {({ loading, error, data: { organization } }) => {
          if (loading) return <div className="loader" />;
          if (error) return <p>Error!</p>;
          return (
            <div style={{ paddingTop: 30 }}>
              <div className="content box">
                <h5 className="title">Admin Notes for {organization.name}</h5>
                {organization.admin_notes ? (
                  <ReactMarkdown source={organization.admin_notes} />
                ) : (
                  <p>No notes at this time</p>
                )}
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

OrgAdminSection.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(OrgAdminSection);

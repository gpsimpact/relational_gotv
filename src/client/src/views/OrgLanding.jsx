import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import ORG_DETAILS from '../data/queries/orgInfo';
import { withRouter, Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faPhone, faAt } from '@fortawesome/fontawesome-pro-light';
import { isLoggedIn, hasOrgAccess } from '../utils/auth';
import ReactRouterPropTypes from 'react-router-prop-types';

class OrgLanding extends PureComponent {
  render() {
    return (
      <Query query={ORG_DETAILS} variables={{ where: { slug: this.props.match.params.slug } }}>
        {({ loading, error, data: { organization } }) => {
          if (loading) return <div className="loader" />;
          if (error) return <p>Error!</p>;
          if (!organization) {
            return (
              <div>
                <h2>
                  Sorry, this org does not exist. Try one listed <Link to="/">here</Link>
                </h2>
              </div>
            );
          }
          return (
            <div>
              <section className="hero is-primary is-bold">
                <div className="hero-body">
                  <div className="container">
                    <h1 className="title">{organization.name}</h1>
                  </div>
                </div>
              </section>
              <section className="section">
                <div className="container">
                  <div className="columns">
                    <div className="column">
                      <div className="content">
                        <h2>Welcome!</h2>
                        <p>{organization.cta}</p>
                        <h2>For more information contact:</h2>
                        <p>
                          {organization.contact_name} <br />
                          <FontAwesomeIcon icon={faPhone} />{' '}
                          <span style={{ paddingLeft: 20 }}>{organization.contact_phone}</span>{' '}
                          <br />
                          <FontAwesomeIcon icon={faAt} />
                          <span style={{ paddingLeft: 20 }}>{organization.contact_email}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column">
                      <div className="content">
                        {!isLoggedIn() ? (
                          <Link
                            className="button is-primary is-large"
                            to={`/auth/register?org_id=${organization.id}`}
                          >
                            Register!
                          </Link>
                        ) : (
                          <div>
                            {hasOrgAccess(organization.id) ? (
                              <Link
                                className="button is-primary is-large"
                                to={`/u/${organization.id}`}
                              >
                                Go To Dashboard!
                              </Link>
                            ) : (
                              // option to put button here to request access
                              <div />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          );
        }}
      </Query>
    );
  }
}

OrgLanding.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(OrgLanding);

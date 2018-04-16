import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import ALL_ORGS from '../../data/queries/allOrgs';

class UserAllowedOrgs extends PureComponent {
  render() {
    return (
      <div>
        <section className="hero is-primary is-bold">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Please select an organization</h1>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column">
                <div className="content">
                  <Query
                    query={ALL_ORGS}
                    variables={{
                      limit: 200,
                      where: {
                        id_in: this.props.orgs,
                      },
                    }}
                  >
                    {({ loading, error, data }) => {
                      if (loading) return <div className="loader" />;
                      if (error) return <p>Error!</p>;
                      return (
                        <ul>
                          {data.organizations.items.map(org => (
                            <li key={org.id}>
                              <Link to={`/u/${org.id}`}>{org.name}</Link>
                            </li>
                          ))}
                        </ul>
                      );
                    }}
                  </Query>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

UserAllowedOrgs.propTypes = {
  orgs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withRouter(UserAllowedOrgs);

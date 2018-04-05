import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import ALL_ORGS from '../../data/queries/allOrgs';

class HomePage extends PureComponent {
  render() {
    return (
      <div>
        <section className="hero is-medium is-primary is-bold">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Relational GOTV</h1>
              <h2 className="subtitle">Organize your contacts to make a difference.</h2>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column">
                <div className="content">
                  <h2>Welcome!</h2>
                  <p>
                    This is the main page. This should be promotional text to encourage
                    organizations to join the site and volunteers to join up with their org.
                  </p>
                  <h2>You may register with one of the following participating organizations</h2>
                  <Query query={ALL_ORGS} variables={{ limit: 200 }}>
                    {({ loading, error, data }) => {
                      if (loading) return <div className="loader" />;
                      if (error) return <p>Error!</p>;
                      return (
                        <ul>
                          {data.organizations.items.map(org => (
                            <li key={org.id}>
                              <Link to={`/org/${org.slug}`}>{org.name}</Link>
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

export default HomePage;

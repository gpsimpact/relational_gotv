import React from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import ALL_ORGS from '../queries/allOrgs';

const Home = props => {
  const { data: { organizations, loading, error } } = props;
  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>Error!</p>;
  }
  return (
    <div>
      <section className="hero is-medium is-primary is-bold">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Relational GOTV</h1>
            <h2 className="subtitle">Subtitle of app goes here</h2>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column">
              <p>
                This is the main page. This should be promotional text to encourage organizations to
                join the site and volunteers to join up with their org.
              </p>
              <p> For now visit the example org to get started.</p>
              <h4>You may register with one of the following participating organizations</h4>
              <ul>
                {organizations.items.map(org => (
                  <li key={org.id}>
                    <Link to={`/org/${org.slug}`}>{org.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const HomeWithData = graphql(ALL_ORGS, { variables: { limit: 200 } })(Home);

export default HomeWithData;

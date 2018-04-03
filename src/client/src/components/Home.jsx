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
  console.dir(organizations);
  return (
    <div>
      <h1>Relational GOTV app</h1>
      <p>
        This is the main page. This should be promotional text to encourage organizations to join
        the site and volunteers to join up with their org.
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
  );
};

const HomeWithData = graphql(ALL_ORGS, { variables: { limit: 200 } })(Home);

export default HomeWithData;

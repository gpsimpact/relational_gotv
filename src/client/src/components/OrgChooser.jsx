import React, { PureComponent } from 'react';
import { graphql } from 'react-apollo';
import ALL_ORGS from '../queries/allOrgs';
import { Link } from 'react-router-dom';

class OrgChooser extends PureComponent {
  render() {
    const { data: { organizations, loading, error } } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>Error!</p>;
    }
    console.dir(organizations);
    return (
      <div>
        <h4>You are registered with the following participating organizations. Choose one.</h4>
        <ul>
          {organizations.items.map(org => (
            <li key={org.id}>
              <Link to={`/org/${org.slug}`}>{org.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const configObject = {
  options: props => {
    return {
      variables: {
        where: {
          id_in: props.orgs,
        },
        limit: 200,
      },
    };
  },
};

const OrgChooserWithData = graphql(ALL_ORGS, configObject)(OrgChooser);

export default OrgChooserWithData;

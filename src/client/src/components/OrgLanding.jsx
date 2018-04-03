import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Row, Col, Container } from 'reactstrap';
import RegistrationForm from './RegistrationForm';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faPhone, faAt } from '@fortawesome/fontawesome-pro-light';
import { Link } from 'react-router-dom';

const ORG_DETAILS = gql`
  query GetOrgInfo($slug: String!) {
    organization(where: { slug: $slug }) {
      id
      name
      cta
      slug
      contact_name
      contact_email
      contact_phone
    }
  }
`;

class OrgLanding extends Component {
  render() {
    const { data: { loading, error, organization } } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>Error!</p>;
    }
    if (!organization) {
      return (
        <div>
          <h2>
            Sorry, this org doesn't exist. Try one listed <Link to="/">here</Link>
          </h2>
        </div>
      );
    }
    return (
      <Container>
        <div>
          <Row>
            <Col>
              <h1 className="text-center" style={{ paddingTop: 20 }}>
                Welcome to {organization.name} organizational portal.
              </h1>
            </Col>
          </Row>
          <Row style={{ paddingTop: 20 }}>
            <Col>
              <p className="">Each org will have its's own call to action! Like:</p>
              <p>{organization.cta}</p>
              <h2>For more information contact:</h2>
              <p>
                {organization.contact_name} <br />
                <FontAwesomeIcon icon={faPhone} />{' '}
                <span style={{ paddingLeft: 20 }}>{organization.contact_phone}</span> <br />
                <FontAwesomeIcon icon={faAt} />
                <span style={{ paddingLeft: 20 }}>{organization.contact_email}</span>
              </p>
            </Col>
            <Col>
              <RegistrationForm org_id={organization.id} pushRoute={this.props.history.push} />
            </Col>
          </Row>
        </div>
      </Container>
    );
  }
}

// OrgLanding.propTypes = {
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       slug: PropTypes.string.isRequired,
//     }),
//   }),
// };

const OrgLandingWithData = graphql(ORG_DETAILS, {
  options: props => ({ variables: { slug: props.match.params.slug } }),
})(OrgLanding);

export default OrgLandingWithData;

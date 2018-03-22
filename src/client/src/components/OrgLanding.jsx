import React, { Component } from 'react';
// import { Route } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
// import PropTypes from 'prop-types';
import { Row, Col, Container } from 'reactstrap';
// import { Formik } from 'formik';
// import TextInput from './elements/TextInput';
import RegistrationForm from './RegistrationForm';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faPhone, faAt } from '@fortawesome/fontawesome-pro-light';

const ORG_DETAILS = gql`
  query GetOrgInfo($slug: String!) {
    organizationInfo(slug: $slug) {
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
    const { data: { loading, error, organizationInfo } } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>Error!</p>;
    }
    return (
      <Container>
        <div>
          <Row>
            <Col>
              <h1 className="text-center" style={{ paddingTop: 20 }}>
                Welcome to {organizationInfo.name} organizational portal.
              </h1>
            </Col>
          </Row>
          <Row style={{ paddingTop: 20 }}>
            <Col>
              <p className="">Each org will have its's own call to action! Like:</p>
              <p>{organizationInfo.cta}</p>
              <h2>For more information contact:</h2>
              <p>
                {organizationInfo.contact_name} <br />
                <FontAwesomeIcon icon={faPhone} />{' '}
                <span style={{ paddingLeft: 20 }}>{organizationInfo.contact_phone}</span> <br />
                <FontAwesomeIcon icon={faAt} />
                <span style={{ paddingLeft: 20 }}>{organizationInfo.contact_email}</span>
              </p>
            </Col>
            <Col>
              <RegistrationForm org_id={organizationInfo.id} pushRoute={this.props.history.push} />
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

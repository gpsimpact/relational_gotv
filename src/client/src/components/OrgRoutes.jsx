import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import { gql } from 'apollo-boost';
// import { Query } from 'react-apollo';
// import PropTypes from 'prop-types';
// import { Row, Col, Container, Button } from 'reactstrap';
// import { Formik } from 'formik';
// import TextInput from './elements/TextInput';
import OrgLanding from './OrgLanding';

const OrgRoutes = () => (
  <Switch>
    <Route path="/org/:slug" component={OrgLanding} />
  </Switch>
);

// OrgRoutes.propTypes = {
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       slug: PropTypes.string.isRequired,
//     }),
//   }),
// };

export default OrgRoutes;

import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Card, CardBody, CardTitle, Button, CardHeader, Alert } from 'reactstrap';
import { Formik } from 'formik';
import Yup from 'yup';
import querystring from 'querystring';
import { map } from 'lodash';
import { withRouter } from 'react-router-dom';
import FormError from './elements/FormError';
import TextInput from './elements/TextInput';
// import { setToken } from '../utils/auth';

const RESET_PASS_MUTATION = gql`
  mutation resetPassword($token: String!, $newPassword: String!) {
    resetPassword(data: { token: $token, newPassword: $newPassword })
  }
`;

class ResetPassword extends Component {
  state = {
    alertOpen: false,
  };

  onDismiss = () => {
    this.setState({ alertOpen: false });
  };

  render() {
    return (
      <div style={{ paddingTop: 40 }}>
        <Alert color="success" isOpen={this.state.alertOpen} toggle={this.onDismiss}>
          Success! Please click Login above to continue.
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
          </CardHeader>
          <CardBody>
            <Formik
              initialValues={{
                password: '',
                password_confirm: '',
              }}
              validationSchema={Yup.object().shape({
                password: Yup.string().required('password is required'),
                password_confirm: Yup.string()
                  .oneOf([Yup.ref('password'), null], 'Passwords do not match!')
                  .required('You must confirm your password.'),
              })}
              onSubmit={(values, { props, setSubmitting, setErrors }) => {
                let qs = querystring.parse(this.props.location.search.slice(1));
                this.props
                  .mutate({
                    variables: { token: qs.token, newPassword: values.password },
                  })
                  .then(({ data }) => {
                    setSubmitting(false);
                    this.setState({ alertOpen: true });
                  })
                  .catch(error => {
                    setSubmitting(false);

                    console.log('there was an error sending the query', error);
                  });
              }}
              render={({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} noValidate>
                  {map(errors.form, error => <FormError key={error} error={error} />)}
                  <p>Enter a new password.</p>
                  <TextInput
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="Enter your new password"
                    error={touched.password && errors.password}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <TextInput
                    id="password_confirm"
                    type="password"
                    label="Password Again"
                    placeholder="Confirm your new password"
                    error={touched.password_confirm && errors.password_confirm}
                    value={values.password_confirm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <Button
                    type="submit"
                    color="primary"
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    Send Email
                  </Button>
                </form>
              )}
            />
          </CardBody>
        </Card>
      </div>
    );
  }
}

const ResetPasswordGQL = graphql(RESET_PASS_MUTATION)(withRouter(ResetPassword));

export default ResetPasswordGQL;

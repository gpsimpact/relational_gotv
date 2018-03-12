import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Card, CardBody, CardTitle, Button, CardHeader, Alert } from 'reactstrap';
import { Formik } from 'formik';
import Yup from 'yup';
// import querystring from 'querystring';
import { map } from 'lodash';
import { withRouter } from 'react-router-dom';
import FormError from './elements/FormError';
import TextInput from './elements/TextInput';
// import { setToken } from '../utils/auth';

const FORGOT_PASS_MUTATION = gql`
  mutation sendPasswordResetEmail($email: String!, $base_url: String!) {
    sendPasswordResetEmail(email: $email, base_url: $base_url)
  }
`;

class ForgotPassword extends Component {
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
          Success! Please check your email.
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
          </CardHeader>
          <CardBody>
            <Formik
              initialValues={{
                email: '',
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email('Must be a properly formatted email address')
                  .required('Email is required'),
              })}
              onSubmit={(values, { props, setSubmitting, setErrors }) => {
                this.props
                  .mutate({
                    variables: { email: values.email, base_url: window.location.host },
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
                  <p>
                    Enter your email address. An email with a password reset link will be sent to
                    that email address if that account exists.
                  </p>
                  <TextInput
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    error={errors.email && touched.email}
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

const ForgotPasswordGQL = graphql(FORGOT_PASS_MUTATION)(withRouter(ForgotPassword));

export default ForgotPasswordGQL;

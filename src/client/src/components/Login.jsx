import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Card, CardBody, CardTitle, Button } from 'reactstrap';
import { Formik } from 'formik';
import Yup from 'yup';
import querystring from 'querystring';
import { map } from 'lodash';
import { withRouter } from 'react-router-dom';
import FormError from './elements/FormError';
import TextInput from './elements/TextInput';
import { setToken } from '../utils/auth';

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userProfile {
        first_name
        last_name
        email
        email_verified
      }
      token
    }
  }
`;

class Login extends Component {
  render() {
    return (
      <div>
        <Card>
          <CardBody>
            <CardTitle>Login </CardTitle>

            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email('Must be a properly formatted email address')
                  .required('Email is required'),
                password: Yup.string().required('password is required'),
              })}
              onSubmit={(values, { props, setSubmitting, setErrors }) => {
                this.props
                  .mutate({
                    variables: { email: values.email, password: values.password },
                  })
                  .then(({ data }) => {
                    setSubmitting(false);
                    if (data.login.token) {
                      setToken(data.login.token);
                      // window.localStorage.setItem('token', data.login.token);
                      let qs = querystring.parse(this.props.location.search);
                      if (qs && qs.next) {
                        window.location = qs.next;
                      } else {
                        window.location = '/u/';
                      }
                    } else {
                      const errors = ['Incorrect Email or Password'];
                      setErrors({ email: ' ', password: ' ', form: errors });
                    }
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

                  <TextInput
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    error={errors.password && touched.password}
                  />

                  <Button
                    type="submit"
                    color="primary"
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    Login
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

const LoginGQL = graphql(LOGIN_MUTATION)(withRouter(Login));

export default LoginGQL;

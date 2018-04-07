import { Formik } from 'formik';
import querystring from 'querystring';
import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Yup from 'yup';
import TextInput from '../../components/elements/TextInput';
import LOGIN_MUTATION from '../../data/mutations/login';
import { setToken } from '../../utils/auth';
import ReactRouterPropTypes from 'react-router-prop-types';

class Login extends PureComponent {
  render() {
    return (
      <Mutation mutation={LOGIN_MUTATION}>
        {login => (
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
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
                onSubmit={(values, { setSubmitting, setErrors }) => {
                  login({
                    variables: {
                      email: values.email.toLowerCase().trim(), // force for case insensitivity
                      password: values.password,
                    },
                  })
                    .then(({ data }) => {
                      setSubmitting(false);
                      if (data.login.token) {
                        setToken(data.login.token);
                        let qs = querystring.parse(this.props.location.search.slice(1));
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
                      const errors = ['Incorrect Email or Password'];
                      setErrors({ email: ' ', password: ' ', form: errors });
                      // eslint-disable-next-line no-console
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
                  <form onSubmit={handleSubmit} className="box">
                    <div className="field has-text-centered">
                      <h4 className="is-size-4 has-text-weight-bold">LOGIN</h4>
                    </div>
                    <TextInput
                      id="email"
                      label="Email"
                      type="email"
                      placeholder="Email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      error={errors.email && touched.email}
                      errorText={errors.email}
                      touched={touched}
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
                    <div className="field ">
                      <div className="control">
                        <button
                          className="button is-link submit-button"
                          color="primary"
                          disabled={isSubmitting}
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              />
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

Login.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(Login);

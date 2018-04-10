import { Formik } from 'formik';
// import querystring from 'querystring';
import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Yup from 'yup';
import TextInput from '../../components/elements/TextInput';
import FormError from '../../components/elements/FormError';
import FORGOT_PASS_MUTATION from '../../data/mutations/forgot_password';
// import { setToken } from '../../utils/auth';
import ReactRouterPropTypes from 'react-router-prop-types';
import { map } from 'lodash';

class ForgotPassword extends PureComponent {
  state = {
    alertOpen: false,
  };
  render() {
    return (
      <Mutation mutation={FORGOT_PASS_MUTATION}>
        {sendPasswordResetEmail => (
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
              <Formik
                initialValues={{
                  email: '',
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email('Must be a properly formatted email address')
                    .required('Email is required'),
                })}
                onSubmit={(values, { setSubmitting, setErrors }) => {
                  return sendPasswordResetEmail({
                    variables: {
                      email: values.email.toLowerCase().trim(), // force for case insensitivity
                      base_url: window.location.host,
                    },
                  })
                    .then(({ data }) => {
                      setSubmitting(false);
                      if (data.sendPasswordResetEmail === 'ok') {
                        this.setState({ alertOpen: true });
                      }
                    })
                    .catch(error => {
                      setSubmitting(false);
                      setErrors({ email: ' ', password: ' ', form: error });
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
                    {map(errors.form, error => <FormError key={error} error={error} />)}
                    {this.state.alertOpen ? (
                      <div className="notification is-success">
                        <button
                          onClick={() => this.setState({ alertOpen: !this.state.alertOpen })}
                          className="delete"
                        />
                        Success! Please check your email.
                      </div>
                    ) : null}
                    <div className="field has-text-centered">
                      <h4 className="is-size-4 has-text-weight-bold">Forgot Password?</h4>
                    </div>
                    <TextInput
                      id="email"
                      label="Email"
                      type="email"
                      placeholder="Email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      error={touched.email && errors.email}
                      touched={touched.email}
                    />

                    <div className="field ">
                      <div className="control">
                        <button
                          className="button is-link submit-button"
                          color="primary"
                          disabled={isSubmitting}
                        >
                          Send Password Reset Email
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

ForgotPassword.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(ForgotPassword);

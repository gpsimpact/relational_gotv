import { Formik } from 'formik';
import querystring from 'querystring';
import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Yup from 'yup';
import TextInput from '../../components/elements/TextInput';
import FormError from '../../components/elements/FormError';
import RESET_PASS_MUTATION from '../../data/mutations/resetPassword';
// import { setToken } from '../../utils/auth';
import ReactRouterPropTypes from 'react-router-prop-types';
import { map } from 'lodash';

class ForgotPassword extends PureComponent {
  state = {
    alertOpen: false,
  };
  render() {
    return (
      <Mutation mutation={RESET_PASS_MUTATION}>
        {resetPassword => (
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
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
                onSubmit={(values, { setSubmitting, setErrors }) => {
                  let qs = querystring.parse(this.props.location.search.slice(1));
                  return resetPassword({
                    variables: { token: qs.token, newPassword: values.password },
                  })
                    .then(() => {
                      setSubmitting(false);
                      this.setState({ alertOpen: true });
                    })
                    .catch(error => {
                      setSubmitting(false);
                      setErrors({ email: ' ', password: ' ', form: error });
                      //eslint-disable-next-line no-console
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
                        Success! Please click Login above to continue.
                      </div>
                    ) : null}
                    <div className="field has-text-centered">
                      <h4 className="is-size-4 has-text-weight-bold">Forgot Password?</h4>
                    </div>
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

                    <div className="field ">
                      <div className="control">
                        <button
                          type="submit"
                          className="button is-link submit-button"
                          color="primary"
                          disabled={isSubmitting}
                        >
                          Reset Password
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

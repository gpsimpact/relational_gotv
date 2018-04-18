import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import Yup from 'yup';
import TextInput from '../../components/elements/TextInput';
import FormError from '../../components/elements/FormError';
import CHANGE_PASS_MUTATION from '../../data/mutations/changePassword';
import { Formik } from 'formik';
import { map } from 'lodash';

class Settings extends PureComponent {
  state = {
    alertOpen: false,
  };
  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="column is-half">
            <Mutation mutation={CHANGE_PASS_MUTATION}>
              {changePassword => (
                <Formik
                  initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    password_confirm: '',
                  }}
                  validationSchema={Yup.object().shape({
                    currentPassword: Yup.string().required('First name is required'),
                    newPassword: Yup.string().required('Last name is required'),
                    password_confirm: Yup.string()
                      .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match!')
                      .required('You must confirm your new password.'),
                  })}
                  onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
                    changePassword({
                      variables: {
                        currentPassword: values.currentPassword,
                        newPassword: values.newPassword,
                      },
                    })
                      .then(() => {
                        setSubmitting(false);
                        this.setState({ alertOpen: true });
                        resetForm();
                      })
                      .catch(error => {
                        setSubmitting(false);
                        const displayErrors = [];
                        if (error.message === 'GraphQL error: User can not be authenticated.') {
                          displayErrors.push(
                            'Your current password is not correct. If you forgot your password, you should logout and click "forgot my password" on the login screen.'
                          );
                        }
                        setErrors({ email: ' ', password: ' ', form: displayErrors });
                        // eslint-disable-next-line no-console
                        console.log('there was an error sending the query', error);
                        // console.log('there was an error sending the query', error);
                        // setSubmitting(false);
                        // setErrors({ email: ' ', password: ' ', form: error });
                        // eslint-disable-next-line no-console
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
                    <form onSubmit={handleSubmit} style={{ paddingTop: 20 }}>
                      {map(errors.form, error => <FormError key={error} error={error} />)}
                      {this.state.alertOpen ? (
                        <div className="notification is-success">
                          <button
                            onClick={() => this.setState({ alertOpen: !this.state.alertOpen })}
                            className="delete"
                          />
                          Success! Your password has been changed.
                        </div>
                      ) : null}
                      <div className="field has-text-centered">
                        <h4 className="is-size-4 has-text-weight-bold">Change Password</h4>
                      </div>

                      <TextInput
                        id="currentPassword"
                        type="password"
                        label="Current Password"
                        placeholder="Enter your current password"
                        error={touched.currentPassword && errors.currentPassword}
                        value={values.currentPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <TextInput
                        id="newPassword"
                        type="password"
                        label="New Password"
                        placeholder="Enter a new password"
                        error={touched.newPassword && errors.newPassword}
                        value={values.newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <TextInput
                        id="password_confirm"
                        type="password"
                        label="Password Again"
                        placeholder="Confirm your password"
                        error={touched.password_confirm && errors.password_confirm}
                        value={values.password_confirm}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <div className="Column">
                        <div className="field ">
                          <div className="control">
                            <button
                              type="submit"
                              className="button is-link submit-button is-fullwidth"
                              color="primary"
                              disabled={isSubmitting}
                            >
                              Change Password
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                />
              )}
            </Mutation>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;

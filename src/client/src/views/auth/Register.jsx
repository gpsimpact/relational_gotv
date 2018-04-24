import { Formik } from 'formik';
import querystring from 'querystring';
import React, { PureComponent } from 'react';
import { Mutation, Query } from 'react-apollo';
import { withRouter, Redirect } from 'react-router-dom';
import Yup from 'yup';
import TextInput from '../../components/elements/TextInput';
import FormError from '../../components/elements/FormError';
import Selector from '../../components/elements/Selector';
import REGISTRATION_MUTATION from '../../data/mutations/user_registration';
import ALL_ORGS from '../../data/queries/allOrgs';
import ReactRouterPropTypes from 'react-router-prop-types';
import { map, includes } from 'lodash';
import { isLoggedIn } from '../../utils/auth';

const isValidOrg = (orgs, org_id) => {
  if (!org_id) return false;
  return includes(map(orgs, 'value'), org_id);
};

class Register extends PureComponent {
  render() {
    if (isLoggedIn()) {
      return <Redirect to="/u/" />;
    }

    let qs = querystring.parse(this.props.location.search.slice(1));
    return (
      <Query query={ALL_ORGS}>
        {({ loading, error, data }) => {
          if (loading) return <div className="loader" />;
          if (error) return <p>Error!</p>;
          const org_labels = {};
          const org_options = map(data.organizations.items, org => {
            org_labels[org.id] = org.name;
            return {
              value: org.id,
              label: org.name,
            };
          });

          return (
            <Mutation mutation={REGISTRATION_MUTATION}>
              {registerUser => (
                <div className="columns is-centered">
                  <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                    <Formik
                      initialValues={{
                        first_name: '',
                        last_name: '',
                        email: '',
                        org_id: isValidOrg(org_options, qs.org_id) ? qs.org_id : '',
                        password: '',
                        password_confirm: '',
                      }}
                      validationSchema={Yup.object().shape({
                        org_id: Yup.mixed()
                          .oneOf(
                            map(org_options, 'value'),
                            'Please Selet a valid Organization from the dropdown'
                          )
                          .required('Please Selet a valid Organization from the dropdown'),
                        first_name: Yup.string().required('First name is required'),
                        last_name: Yup.string().required('Last name is required'),
                        email: Yup.string()
                          .email('Must be a properly formatted email address')
                          .required('Email is required'),
                        password: Yup.string().required('password is required'),
                        password_confirm: Yup.string()
                          .oneOf([Yup.ref('password'), null], 'Passwords do not match!')
                          .required('You must confirm your password.'),
                      })}
                      onSubmit={(values, { setSubmitting, setErrors }) => {
                        registerUser({
                          variables: {
                            first_name: values.first_name,
                            last_name: values.last_name,
                            email: values.email.toLowerCase().trim(),
                            password: values.password,
                            org_id: values.org_id,
                          },
                        }).then(
                          () => {
                            setSubmitting(false);
                            this.props.history.push('/auth/login');
                            // pushRoute('/login');
                          },
                          error => {
                            setSubmitting(false);
                            const displayErrors = [];
                            if (
                              error.message ===
                              'GraphQL error: This email address is already associated with an account.'
                            ) {
                              displayErrors.push(
                                'This email address is already associated with an account. Try logging in instead.'
                              );
                            }
                            setErrors({ email: ' ', password: ' ', form: displayErrors });
                            // eslint-disable-next-line no-console
                            console.log('there was an error sending the query', error);
                          }
                        );
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
                          <div className="field has-text-centered">
                            <h4 className="is-size-4 has-text-weight-bold">Register</h4>
                          </div>
                          {!isValidOrg(org_options, qs.org_id) ? (
                            <Selector
                              id="org_id"
                              type="text"
                              label="Organization"
                              error={touched.org_id && errors.org_id}
                              value={values.org_id}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              options={org_options}
                            />
                          ) : (
                            <h5 className="is-size-6" style={{ paddingBottom: 10 }}>
                              You are registering with organization: {org_labels[qs.org_id]}
                            </h5>
                          )}

                          <TextInput
                            id="first_name"
                            type="text"
                            label="First Name"
                            placeholder="Enter your first name"
                            error={touched.first_name && errors.first_name}
                            value={values.first_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <TextInput
                            id="last_name"
                            type="text"
                            label="Last Name"
                            placeholder="Enter your last name"
                            error={touched.last_name && errors.last_name}
                            value={values.last_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <TextInput
                            id="email"
                            type="email"
                            label="Email"
                            placeholder="Enter your email"
                            error={touched.email && errors.email}
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <TextInput
                            id="password"
                            type="password"
                            label="Password"
                            placeholder="Enter your password"
                            error={touched.password && errors.password}
                            value={values.password}
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
                          <div className="field ">
                            <div className="control">
                              <button
                                className="button is-link submit-button"
                                color="primary"
                                disabled={isSubmitting}
                              >
                                Register
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
        }}
      </Query>
    );
  }
}

Register.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withRouter(Register);

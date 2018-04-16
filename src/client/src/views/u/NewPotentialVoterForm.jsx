import { Formik } from 'formik';
import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Yup from 'yup';
import TextInput from '../../components/elements/TextInput';
import FormError from '../../components/elements/FormError';
import MY_POTENTIAL_VOTERS from '../../data/queries/potentialVoters';
import NEW_POTENTIAL_VOTER from '../../data/mutations/newPotentialVoter';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { map } from 'lodash';

class NewPotentialVoterForm extends PureComponent {
  render() {
    return (
      <Mutation
        mutation={NEW_POTENTIAL_VOTER}
        update={(store, { data: { createPotentialVoter } }) => {
          const data = store.readQuery({
            query: MY_POTENTIAL_VOTERS,
            variables: { limit: 25, org_id: this.props.match.params.orgSlug },
          });
          // Push item to top of the list
          data.potentialVoters.items.unshift(createPotentialVoter);
          store.writeQuery({
            query: MY_POTENTIAL_VOTERS,
            variables: { org_id: this.props.match.params.orgSlug, limit: 25 },
            data,
          });
        }}
      >
        {createPotentialVoter => (
          <Formik
            initialValues={{
              first_name: '',
              last_name: '',
              city: '',
            }}
            validationSchema={Yup.object().shape({
              first_name: Yup.string().required('First name is required'),
              last_name: Yup.string().required('Last name is required'),
              city: Yup.string().required('City is required'),
            })}
            onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
              createPotentialVoter({
                variables: {
                  data: {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    city: values.city,
                    org_id: this.props.match.params.orgSlug,
                  },
                },
              })
                .then(() => {
                  setSubmitting(false);
                  resetForm();
                  this.props.toggleOpenStatus();
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
                <div className="field has-text-centered">
                  <h4 className="is-size-4 has-text-weight-bold">Add new Contact</h4>
                </div>

                <TextInput
                  id="first_name"
                  type="text"
                  label="First Name"
                  placeholder="Enter their first name"
                  error={touched.first_name && errors.first_name}
                  value={values.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <TextInput
                  id="last_name"
                  type="text"
                  label="Last Name"
                  placeholder="Enter their last name"
                  error={touched.last_name && errors.last_name}
                  value={values.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <TextInput
                  id="city"
                  type="text"
                  label="City"
                  placeholder="Enter their City"
                  error={touched.city && errors.city}
                  value={values.city}
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
                        Create New Voter
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          />
        )}
      </Mutation>
    );
  }
}

NewPotentialVoterForm.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  toggleOpenStatus: PropTypes.func.isRequired,
};

export default withRouter(NewPotentialVoterForm);

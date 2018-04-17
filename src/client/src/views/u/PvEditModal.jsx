import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import Yup from 'yup';
import TextInput from '../../components/elements/TextInput';
import FormError from '../../components/elements/FormError';
import { Formik } from 'formik';
import { map } from 'lodash';
import UPDATE_PV from '../../data/mutations/modifyPV';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

// import { Query } from 'react-apollo';
// import DATA_DATES from '../../data/queries/dataDates';
// import { parse, distanceInWordsToNow } from 'date-fns';

class PvEditModal extends Component {
  render() {
    const { potentialVoter } = this.props;
    return (
      <div className={classNames('modal', { 'is-active': this.props.open })}>
        <div className="modal-background" onClick={() => this.props.close()} />

        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Edit/Delete</p>
            <button className="delete" aria-label="close" onClick={() => this.props.close()} />
          </header>
          <section className="modal-card-body">
            <div className="content">
              <Mutation mutation={UPDATE_PV}>
                {updatePotentialVoter => (
                  <Formik
                    initialValues={{
                      first_name: potentialVoter.first_name,
                      last_name: potentialVoter.last_name,
                      city: potentialVoter.city,
                    }}
                    validationSchema={Yup.object().shape({
                      first_name: Yup.string().required('First name is required'),
                      last_name: Yup.string().required('Last name is required'),
                      city: Yup.string().required('City is required'),
                    })}
                    onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
                      updatePotentialVoter({
                        variables: {
                          id: potentialVoter.id,
                          data: {
                            first_name: values.first_name,
                            last_name: values.last_name,
                            city: values.city,
                          },
                        },
                      })
                        .then(() => {
                          setSubmitting(false);
                          resetForm();
                          this.props.close();
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
                      <form onSubmit={handleSubmit}>
                        {map(errors.form, error => <FormError key={error} error={error} />)}
                        <div className="field has-text-centered">
                          <h4 className="is-size-4 has-text-weight-bold">Edit Contact</h4>
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
                                Edit Contact
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
          </section>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => this.props.close()}
        />
      </div>
    );
  }
}

PvEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  potentialVoter: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(PvEditModal);

// update = {(store, { data: { updatePotentialVoter } }) => {
//   const data = store.readQuery({
//     query: MY_POTENTIAL_VOTERS,
//     variables: { limit: 25, org_id: this.props.match.params.orgSlug },
//   });
//   // Push item to top of the list
//   data.potentialVoters.items.unshift(createPotentialVoter);
//   store.writeQuery({
//     query: MY_POTENTIAL_VOTERS,
//     variables: { org_id: this.props.match.params.orgSlug, limit: 25 },
//     data,
//   });
// }}

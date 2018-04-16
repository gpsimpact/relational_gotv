import React, { PureComponent } from 'react';
import Yup from 'yup';
import { Formik } from 'formik';
import TextInput from '../../components/elements/TextInput';
import PropTypes from 'prop-types';

export class VoterSearchForm extends PureComponent {
  render() {
    return (
      <div>
        <Formik
          initialValues={{
            first_name: this.props.first_name ? this.props.first_name.trim() : '',
            last_name: this.props.last_name ? this.props.last_name.trim() : '',
            city: this.props.city ? this.props.city.trim() : '',
            state: 'KS',
          }}
          validationSchema={Yup.object().shape({
            first_name: Yup.string().required('First name is required'),
            last_name: Yup.string().required('Last name is required'),
            city: Yup.string().required('City is required'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);

            this.props.update({
              first_name: values.first_name.trim(),
              last_name: values.last_name.trim(),
              city: values.city.trim(),
            });
          }}
          enableReinitialize={true}
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
              <div className="columns">
                <div className="column">
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
                </div>
                <div className="column">
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
                </div>
                <div className="column">
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
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <button
                    type="submit"
                    className="button is-link submit-button is-fullwidth"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          )}
        />
      </div>
    );
  }
}

VoterSearchForm.propTypes = {
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  city: PropTypes.string,
  update: PropTypes.func.isRequired,
};

export default VoterSearchForm;

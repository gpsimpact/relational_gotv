import React, { PureComponent } from 'react';
import { Formik } from 'formik';
import Yup from 'yup';
import PropTypes from 'prop-types';
import TextInput from '../../components/elements/TextInput';
import Selector from '../../components/elements/Selector';
import ReactMarkdown from 'react-markdown';

class SchemaForm extends PureComponent {
  render() {
    // initialize and populate initialValues
    const initialValues = {};
    this.props.schema.fields.forEach(field => {
      initialValues[field.id] = field.initialValue;
    });
    // initialize and populate validationSchema
    const validationSchema = {};
    this.props.schema.fields.forEach(field => {
      let validator;
      // initialize validator with write yup type -- INCOMPLETE
      if (field.validationType) {
        if (field.validationType === 'string') {
          validator = Yup.string();
        } else if (field.validationType === 'number') {
          validator = Yup.number();
        } else if (field.validationType === 'boolean') {
          validator = Yup.boolean();
        } else if (field.validationType === 'date') {
          validator = Yup.date();
        }
        // add tests to validator
        field.validationTests.forEach(test => {
          if (test.method === 'required') {
            validator = validator.required(test.message);
          } else if (test.method === 'min') {
            validator = validator.min(test.value, test.message);
          } else if (test.method === 'email') {
            validator = validator.email(test.message);
          } else if (test.method === 'url') {
            validator = validator.url(test.message);
          } else if (test.method === 'lessThan') {
            validator = validator.lessThan(test.message);
          } else if (test.method === 'moreThan') {
            validator = validator.moreThan(test.message);
          } else if (test.method === 'positive') {
            validator = validator.positive(test.message);
          } else if (test.method === 'negative') {
            validator = validator.negative(test.message);
          } else if (test.method === 'integer') {
            validator = validator.integer(test.message);
          }
        });
        // add validator to schema
        validationSchema[field.id] = validator;
      }
    });
    const baseStyle = { paddingTop: 20 };
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape(validationSchema)}
        onSubmit={values => {
          this.props.submitFn(values);
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
            {this.props.schema.fields.map((field, idx) => {
              if (field.widget === 'textinput') {
                return (
                  <div style={baseStyle}>
                    <TextInput
                      key={idx}
                      id={field.id}
                      type={field.type}
                      label={field.label}
                      placeholder={field.placeholder}
                      error={touched[field.id] && errors[field.id]}
                      value={values[field.id]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                );
              } else if (field.widget === 'p') {
                // DEPRECIATED. DON't USE
                return (
                  <div style={baseStyle}>
                    <p key={idx}>{field.text}</p>
                  </div>
                );
              } else if (field.widget === 'markdown') {
                return (
                  <div style={baseStyle}>
                    <ReactMarkdown key={idx} source={field.content} />
                  </div>
                );
              } else if (field.widget === 'select') {
                return (
                  <div style={baseStyle}>
                    <Selector
                      key={idx}
                      id={field.id}
                      label={field.label}
                      options={field.options}
                      placeholder={field.placeholder}
                      error={touched[field.id] && errors[field.id]}
                      value={values[field.id]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                );
              }
              return null;
            })}
            <div className="Column">
              <div className="field ">
                <div className="control" style={baseStyle}>
                  <button
                    type="submit"
                    className="button is-link submit-button is-fullwidth"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Complete Task
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      />
    );
  }
}

SchemaForm.propTypes = {
  schema: PropTypes.object.isRequired,
  submitFn: PropTypes.func.isRequired,
};

export default SchemaForm;

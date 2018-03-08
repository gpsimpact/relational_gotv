import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { Formik } from 'formik';
import Yup from 'yup';
import TextInput from './elements/TextInput';

const testSchema = {
  formTitle: 'This is form title',
  submitButtonText: 'Wombat!',
  fields: [
    {
      id: 'alpha',
      type: 'text',
      widget: 'textinput',
      validationType: 'string',
      label: 'This is alpha label',
      placeholder: 'Enter alpha',
      validationTests: [
        {
          method: 'required',
          message: 'Alpha is required',
        },
        {
          method: 'min',
          value: 5,
          message: 'must have length greater than 5',
        },
      ],
      initialValue: 'pizza',
    },
    {
      widget: 'p',
      text: 'lorem ipsum dolsom',
    },
  ],
};

class SchemaForm extends PureComponent {
  render() {
    const initialValues = {};
    testSchema.fields.forEach(field => {
      initialValues[field.id] = field.initialValue;
    });

    const validationSchema = {};
    testSchema.fields.forEach(field => {
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

    return (
      <div>
        <h2>{testSchema.formTitle}</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape(validationSchema)}
          onSubmit={(values, { setSubmitting, setErrors /* setValues and other goodies */ }) => {
            console.log(values);
            setSubmitting(false);
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
              {testSchema.fields.map((field, idx) => {
                if (field.widget === 'textinput') {
                  return (
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
                  );
                }
                // else if (field.widget === 'p') {
                //   return <p key={idx}>{field.text}</p>;
                // }
              })}
              <Button type="submit" color="primary" disabled={isSubmitting}>
                {testSchema.submitButtonText}
              </Button>
            </form>
          )}
        />
      </div>
    );
  }
}

export default SchemaForm;

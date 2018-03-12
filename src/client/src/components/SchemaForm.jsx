import React, { PureComponent } from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, CardSubtitle } from 'reactstrap';
import { Formik } from 'formik';
import Yup from 'yup';
import TextInput from './elements/TextInput';

class SchemaForm extends PureComponent {
  render() {
    const initialValues = {};
    this.props.schema.fields.forEach(field => {
      initialValues[field.id] = field.initialValue;
    });

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

    return (
      <Card>
        <CardHeader>
          <CardTitle>{this.props.schema.formTitle}</CardTitle>
          <CardSubtitle>
            Earn {this.props.point_value} points by completing this task as instructed.
          </CardSubtitle>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape(validationSchema)}
            onSubmit={(values, { setSubmitting, setErrors /* setValues and other goodies */ }) => {
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
                  } else if (field.widget === 'p') {
                    return <p key={idx}>{field.text}</p>;
                  }
                  return null;
                })}
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  {this.props.schema.submitButtonText}
                </Button>
              </form>
            )}
          />
        </CardBody>
      </Card>
    );
  }
}

export default SchemaForm;

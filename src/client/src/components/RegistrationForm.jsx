import React from 'react';
import { Formik } from 'formik';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import TextInput from './elements/TextInput';
import { Button } from 'reactstrap';
import Yup from 'yup';

const REGISTRATION_MUTATION = gql`
  mutation registerUser(
    $first_name: String!
    $last_name: String!
    $email: String!
    $password: String!
    $org_id: String!
  ) {
    registerUser(
      user: {
        first_name: $first_name
        last_name: $last_name
        email: $email
        password: $password
        org_id: $org_id
      }
    ) {
      first_name
      last_name
      email
    }
  }
`;

const RegistrationForm = ({ org_id, submit, pushRoute }) => (
  <div>
    <h2 className="text-center">Register to be an Volunteer.</h2>
    <Formik
      initialValues={{
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirm: '',
      }}
      validationSchema={Yup.object().shape({
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
      onSubmit={(values, { setSubmitting, setErrors /* setValues and other goodies */ }) => {
        submit(
          values.first_name,
          values.last_name,
          values.email.toLowerCase().trim(),
          values.password,
          org_id
        ).then(
          () => {
            setSubmitting(false);
            pushRoute('/login');
          },
          errors => {
            console.log(errors);
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
        <form onSubmit={handleSubmit}>
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

          <Button type="submit" color="primary" disabled={isSubmitting}>
            Register!
          </Button>
        </form>
      )}
    />
  </div>
);

const RegistrationFormWithData = graphql(REGISTRATION_MUTATION, {
  props: ({ mutate }) => ({
    submit: (first_name, last_name, email, password, org_id) =>
      mutate({ variables: { first_name, last_name, email, password, org_id } }),
  }),
})(RegistrationForm);

export default RegistrationFormWithData;

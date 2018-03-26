import React from 'react';
import { Formik } from 'formik';
// import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import TextInput from './elements/TextInput';
import { Button, Row, Col, Card, CardHeader, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import Yup from 'yup';
import MY_POTENTIAL_VOTERS from '../queries/myPotentialVoters';
import NEW_POTENTIAL_VOTER from '../mutations/newPotentialVoter';

const NewPvForm = ({ org_id, submit }) => (
  <div>
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
      onSubmit={(values, { setSubmitting, setErrors /* setValues and other goodies */ }) => {
        submit(values.first_name.trim(), values.last_name.trim(), values.city.trim(), org_id).then(
          () => {
            setSubmitting(false);
            // pushRoute('/login');
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
        <Card>
          <CardHeader>
            <CardTitle>Add a new Potential Voter</CardTitle>
            <CardSubtitle>Some helper text?</CardSubtitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col>
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
                </Col>
                <Col>
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
                </Col>
                <Col>
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
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button type="submit" color="primary" disabled={isSubmitting}>
                    Add New!
                  </Button>
                </Col>
              </Row>
            </form>
          </CardBody>
        </Card>
      )}
    />
  </div>
);

const NewPvFormWithData = graphql(NEW_POTENTIAL_VOTER, {
  props: ({ mutate }) => ({
    submit: (first_name, last_name, city, org_id) =>
      mutate({
        variables: { data: { first_name, last_name, city, org_id } },
        refetchQueries: [
          {
            query: MY_POTENTIAL_VOTERS,
            variables: { org_id: org_id },
          },
        ],
      }),
  }),
})(NewPvForm);

export default NewPvFormWithData;

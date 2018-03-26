import React, { PureComponent } from 'react';
import VoterSearchResults from './VoterSearchResults';
import Yup from 'yup';
import { Formik } from 'formik';
import TextInput from './elements/TextInput';
import { Button, Row, Col, Card, CardBody, CardHeader, CardTitle, CardSubtitle } from 'reactstrap';
// import POTENTIAL_VOTER_INFO from '../queries/potentialVoterInfo';
// import { graphql } from 'react-apollo';
// import { withRouter } from 'react-router-dom';
// import { Row, Col } from 'reactstrap';
// import VoterProfile from './VoterProfile';

export class VoterSearch extends PureComponent {
  state = {
    first_name: this.props.potential_voter.first_name.trim(),
    last_name: this.props.potential_voter.last_name.trim(),
    city: this.props.potential_voter.city.trim(),
    state: 'KS',
  };
  render() {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Search for a voter</CardTitle>
            <CardSubtitle>Match your contact to the voter file.</CardSubtitle>
          </CardHeader>
          <CardBody>
            <Formik
              initialValues={{ ...this.state }}
              validationSchema={Yup.object().shape({
                first_name: Yup.string().required('First name is required'),
                last_name: Yup.string().required('Last name is required'),
                city: Yup.string().required('City is required'),
              })}
              onSubmit={(
                values,
                { setSubmitting, setErrors /* setValues and other goodies */ }
              ) => {
                this.setState({
                  first_name: values.first_name.trim(),
                  last_name: values.last_name.trim(),
                  city: values.city.trim(),
                });
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
                        Search voters
                      </Button>
                    </Col>
                  </Row>
                </form>
              )}
            />
          </CardBody>
        </Card>
        <VoterSearchResults
          first_name={this.state.first_name}
          last_name={this.state.last_name}
          city={this.state.city}
          state={this.state.state}
          pv_id={this.props.potential_voter.id}
        />
      </div>
    );
  }
}

export default VoterSearch;

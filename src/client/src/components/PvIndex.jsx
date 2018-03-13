import React, { PureComponent } from 'react';
import POTENTIAL_VOTER_INFO from '../queries/potentialVoterInfo';
import UPDATE_TASK from '../mutations/updateTask';
import { graphql, compose } from 'react-apollo';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import VoterProfile from './VoterProfile';
import VoterSearch from './VoterSearch';
import SchemaForm from './SchemaForm';

export class PvIndex extends PureComponent {
  render() {
    const { data: { loading, error, potentialVoterInfo } } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>Error!</p>;
    }
    return (
      <div>
        <Row style={{ paddingTop: 40 }}>
          <Col>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/u">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Potential Voter</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>
              {potentialVoterInfo.first_name} {potentialVoterInfo.last_name} -{' '}
              {potentialVoterInfo.city}
            </h2>
          </Col>
        </Row>
        <Row style={{ paddingTop: 20 }}>
          <Col>
            {potentialVoterInfo.state_file_id ? (
              <VoterProfile state_file_id={potentialVoterInfo.state_file_id} />
            ) : (
              <VoterSearch potential_voter={potentialVoterInfo} />
            )}
          </Col>
        </Row>
        {potentialVoterInfo.nextTask && potentialVoterInfo.state_file_id ? (
          <Row style={{ paddingTop: 20 }}>
            <Col>
              <SchemaForm
                key={potentialVoterInfo.nextTask.id}
                taskId={potentialVoterInfo.nextTask.id}
                schema={potentialVoterInfo.nextTask.form_schema}
                point_value={potentialVoterInfo.nextTask.point_value}
                submitFn={values =>
                  this.props.submit(
                    potentialVoterInfo.nextTask.id,
                    'COMPLETE',
                    values,
                    potentialVoterInfo.id
                  )
                }
              />
            </Col>
          </Row>
        ) : null}
      </div>
    );
  }
}

const PvIndexWithData = compose(
  graphql(POTENTIAL_VOTER_INFO, {
    options: props => ({ variables: { id: props.match.params.pvid } }),
  }),
  graphql(UPDATE_TASK, {
    // options: props => ({ variables: { id, status, form_data } }),
    props: ({ mutate }) => ({
      submit: (id, status, form_data, pvid) =>
        Promise.resolve(
          mutate({
            variables: { id, status, form_data },
            refetchQueries: [
              {
                query: POTENTIAL_VOTER_INFO,
                variables: { id: pvid },
              },
            ],
          })
        ),
    }),
  })
)(withRouter(PvIndex));

export default PvIndexWithData;

import React, { PureComponent } from 'react';
import POTENTIAL_VOTER_INFO from '../queries/potentialVoterInfo';
import POINTS_PROFILE_USER_ORG_LIMITED from '../queries/pointsProfileUserOrgLimited';
import UPDATE_TASK from '../mutations/updateTask';
import { graphql, compose } from 'react-apollo';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import VoterProfile from './VoterProfile';
import VoterSearch from './VoterSearch';
import SchemaForm from './SchemaForm';
import { getUserEmail } from '../utils/auth';

export class PvIndex extends PureComponent {
  render() {
    const { data: { loading, error, potentialVoter } } = this.props;
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
              {potentialVoter.first_name} {potentialVoter.last_name} - {potentialVoter.city}
            </h2>
          </Col>
        </Row>
        <Row style={{ paddingTop: 20 }}>
          <Col>
            {potentialVoter.state_file_id ? (
              <VoterProfile state_file_id={potentialVoter.state_file_id} />
            ) : (
              <VoterSearch potential_voter={potentialVoter} />
            )}
          </Col>
        </Row>
        {potentialVoter.state_file_id ? (
          <Row style={{ paddingTop: 20 }}>
            <Col>
              {potentialVoter.nextTask ? (
                <SchemaForm
                  key={potentialVoter.nextTask.id}
                  taskId={potentialVoter.nextTask.id}
                  schema={potentialVoter.nextTask.form_schema}
                  point_value={potentialVoter.nextTask.point_value}
                  submitFn={values =>
                    this.props.submit(
                      potentialVoter.nextTask.id,
                      'COMPLETE',
                      values,
                      potentialVoter.id,
                      potentialVoter.org_id
                    )
                  }
                />
              ) : (
                <h2>There are currently no available tasks associated with this voter</h2>
              )}
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
      submit: (id, status, form_data, pvid, org_id) =>
        Promise.resolve(
          mutate({
            variables: { id, status, form_data },
            refetchQueries: [
              {
                query: POTENTIAL_VOTER_INFO,
                variables: { id: pvid },
              },
              {
                query: POINTS_PROFILE_USER_ORG_LIMITED,
                variables: { email: getUserEmail(), org_id },
              },
            ],
          })
        ),
    }),
  })
)(withRouter(PvIndex));

export default PvIndexWithData;

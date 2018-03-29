import React, { Component } from 'react';
// import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Table, Card, CardHeader, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { faSquare, faCheckSquare } from '@fortawesome/fontawesome-pro-light';
import MY_POTENTIAL_VOTERS from '../queries/myPotentialVoters';
import { map } from 'lodash';

const CheckBox = ({ checked }) => {
  return checked ? (
    <FontAwesomeIcon icon={faCheckSquare} size="2x" />
  ) : (
    <FontAwesomeIcon icon={faSquare} size="2x" style={{ color: 'darkgrey' }} />
  );
};

const PvTableRow = ({ data, push }) => (
  <tr onClick={() => push(`/u/pv/${data.id}`)}>
    <td>{data && data.first_name}</td>
    <td>{data && data.last_name}</td>
    <td>{data && data.city}</td>
    <td>{data && data.state_file_id ? <CheckBox checked /> : <CheckBox />}</td>
    <td>{data && data.countAvailableTasks}</td>
    <td>{data ? (data.voPoints || 0) + (data.taskPoints || 0) : 0}</td>
  </tr>
);

export class PvTable extends Component {
  render() {
    const { data: { loading, error, myPotentialVoters } } = this.props;

    if (loading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>Error!</p>;
    }
    // Replace this with an api method..
    // let totalPoints = 0;
    // myPotentialVoters.map(pv => {
    //   totalPoints = totalPoints + pv.voPoints + pv.taskPoints;
    // });
    const points = map(myPotentialVoters, pv => pv.voPoints + pv.taskPoints);
    const totalPoints = points.reduce((a, b) => a + b, 0);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your List</CardTitle>
          <CardSubtitle>Click on a person.</CardSubtitle>
        </CardHeader>
        <CardBody>
          <Table hover size="md">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>City</th>
                <th>Registered</th>
                <th>Available Tasks</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {myPotentialVoters.map(potentialVoter => (
                <PvTableRow
                  data={potentialVoter}
                  key={potentialVoter.id}
                  push={this.props.history.push}
                />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th />
                <th />
                <th />
                <th />
                <th />
                <th>TODO: new API method to calculate total points</th>
              </tr>
            </tfoot>
          </Table>
        </CardBody>
      </Card>
    );
  }
}

const PvTableWithData = graphql(MY_POTENTIAL_VOTERS, {
  options: props => ({ variables: { org_id: props.org_id } }),
})(withRouter(PvTable));

export default PvTableWithData;

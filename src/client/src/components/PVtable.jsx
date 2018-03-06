import React, { Component } from 'react';
// import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Table } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { faSquare, faCheckSquare } from '@fortawesome/fontawesome-pro-light';
import MY_POTENTIAL_VOTERS from '../queries/myPotentialVoters';

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
    <td>{data && data.vo_ab_requested ? <CheckBox checked /> : <CheckBox />}</td>
    <td>{data && data.vo_voted ? <CheckBox checked /> : <CheckBox />}</td>
    <td>
      {data && data.open_tasks} / {data && data.total_tasks}
    </td>
    <td>{data && data.pvPoints ? data.pvPoints : '-'}</td>
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
    return (
      <Table hover size="md">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Registered</th>
            <th>AB Application</th>
            <th>Voted</th>
            <th>Tasks Completed</th>
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
            <th />
            <th />
            <th>543</th>
            <th />
          </tr>
        </tfoot>
      </Table>
    );
  }
}

const PvTableWithData = graphql(MY_POTENTIAL_VOTERS, {
  options: props => ({ variables: { org_id: props.org_id } }),
})(withRouter(PvTable));

export default PvTableWithData;

import React, { PureComponent } from 'react';
import VOTER_SEARCH from '../queries/voterSearch';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { Row, Col, Table } from 'reactstrap';
import { parse, differenceInCalendarYears } from 'date-fns';
import AssociateVoterButton from './AssociateVoterButton';
// import VoterProfile from './VoterProfile';
// import VoterSearch from './VoterSearch';

export class VoterSearchResults extends PureComponent {
  render() {
    const { data: { loading, error, voters } } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>Error!</p>;
    }

    if (voters.length > 0) {
      return (
        <div>
          <Row style={{ paddingTop: 20 }}>
            <Col>
              <Table hover size="md">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Home Address</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Zip</th>
                    <th>Age</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {voters.map(voter => (
                    <tr key={voter.state_file_id}>
                      <td>{voter.first_name}</td>
                      <td>{voter.last_name}</td>
                      <td>{voter.home_address}</td>
                      <td>{voter.city}</td>
                      <td>{voter.state}</td>
                      <td>{voter.zipcode}</td>
                      <td>{differenceInCalendarYears(new Date(), parse(voter.dob))}</td>
                      <td>
                        <AssociateVoterButton
                          pv_id={this.props.pv_id}
                          voter_id={voter.state_file_id}
                        />
                      </td>
                    </tr>
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
                  </tr>
                </tfoot>
              </Table>
            </Col>
          </Row>
        </div>
      );
    }

    // no voter view
    return (
      <div style={{ paddingTop: 20 }}>
        <Row>
          <Col>
            <h3>
              No matching voters found
              <small className="text-muted" style={{ paddingLeft: 10 }}>
                Perhaps they are unregistered.
              </small>
            </h3>
            <p>
              Try searching again. Remember that people may register under a different version of
              their name.
            </p>
            <p>
              If you can not find a likely match it is possible your contact is unregistered to
              vote. Include lots of instructions here about how to register them.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce scelerisque, tortor
              consectetur sodales faucibus, urna metus vestibulum quam, id dignissim felis dui sed
              erat. Proin nunc massa, molestie non condimentum non, molestie vitae augue. Phasellus
              sed ultricies ligula, non egestas lectus. In eget ultricies libero, sit amet tristique
              metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus. Integer aliquam sem vitae viverra dignissim. Proin luctus interdum
              neque, interdum commodo orci mollis ac. In et magna varius, aliquam urna a, sagittis
              enim. Nulla sed cursus mauris, sit amet tristique enim.
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

const VoterSearchResultsWithData = graphql(VOTER_SEARCH, {
  options: props => ({
    variables: {
      first_name: `${props.first_name}%`,
      last_name: props.last_name,
      city: props.city,
      state: props.state,
    },
  }),
})(withRouter(VoterSearchResults));

export default VoterSearchResultsWithData;

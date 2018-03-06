import React, { PureComponent } from 'react';
// import { Redirect } from 'react-router-dom';
import { hasOrgAccess } from '../utils/auth';
import PvTable from './PVtable';
import NewPvForm from './NewPvForm';
import { Row, Col } from 'reactstrap';

class UserHome extends PureComponent {
  render() {
    if (!hasOrgAccess(this.props.match.params.orgSlug)) {
      return <div>You are not authorized to access this organization</div>;
    }
    return (
      <div>
        <Row>
          <Col>
            <PvTable org_id={this.props.match.params.orgSlug} />
          </Col>
        </Row>
        <Row>
          <Col>
            <NewPvForm org_id={this.props.match.params.orgSlug} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default UserHome;

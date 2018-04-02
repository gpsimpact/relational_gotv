import React, { PureComponent } from 'react';
// import { Redirect } from 'react-router-dom';
import { hasOrgAccess } from '../utils/auth';
import PvTable from './PVtable';
import NewPvForm from './NewPvForm';
import PointsProfile from './PointsProfile';
import { Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';

class UserHome extends PureComponent {
  render() {
    if (!hasOrgAccess(this.props.match.params.orgSlug)) {
      return <div>You are not authorized to access this organization</div>;
    }
    return (
      <div>
        <Row style={{ paddingTop: 40 }}>
          <Col>
            <Breadcrumb>
              <BreadcrumbItem active>Home</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Row style={{ paddingTop: 20 }}>
          <Col xs={9}>
            <PvTable org_id={this.props.match.params.orgSlug} />
          </Col>
          <Col xs={3}>
            <PointsProfile org_id={this.props.match.params.orgSlug} />
          </Col>
        </Row>
        <Row style={{ paddingTop: 20 }}>
          <Col>
            <NewPvForm org_id={this.props.match.params.orgSlug} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default UserHome;

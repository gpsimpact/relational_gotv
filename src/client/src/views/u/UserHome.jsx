import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import PointsProfile from './PointsProfile';
import PotentialVotersList from './PotentialVotersList';
import NewPotentialVoterForm from './NewPotentialVoterForm';
import OrgSidebarInfo from './OrgSidebarInfo';
import classNames from 'classnames';
import ReactRouterPropTypes from 'react-router-prop-types';

class UserHome extends PureComponent {
  state = {
    newPvModalOpen: false,
  };
  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-three-quarters" style={{ paddingRight: 30 }}>
              <PotentialVotersList org_id={this.props.match.params.orgSlug} />
              <div className={classNames('modal', { 'is-active': this.state.newPvModalOpen })}>
                <div
                  className="modal-background"
                  onClick={() => this.setState({ newPvModalOpen: !this.state.newPvModalOpen })}
                />
                <div className="modal-content">
                  <NewPotentialVoterForm
                    toggleOpenStatus={() =>
                      this.setState({ newPvModalOpen: !this.state.newPvModalOpen })
                    }
                  />
                </div>
                <button
                  className="modal-close is-large"
                  aria-label="close"
                  onClick={() => this.setState({ newPvModalOpen: !this.state.newPvModalOpen })}
                />
              </div>
            </div>
            <div className="column">
              <button
                type="submit"
                className="button is-link submit-button is-fullwidth"
                color="primary"
                onClick={() => this.setState({ newPvModalOpen: true })}
              >
                Add new contact
              </button>
              <br />
              <PointsProfile />
              <OrgSidebarInfo />
              <br />
              <div className="content box">
                <h4>Instructions</h4>
                <p>
                  <span className="tag is-danger">Red Items require attention. Click them.</span>
                  <br />
                </p>
                <small>
                  <dl>
                    <dt>
                      <abbr title="Has this contact been matched to the voter file?">Voter?</abbr>
                    </dt>
                    <dd>Has this contact been matched to the voter file?</dd>
                    <dt>
                      <abbr title="Has this contact registered to vote by mail?">VBM?</abbr>
                    </dt>
                    <dd>Has this contact registered to vote by mail?</dd>
                    <dt>
                      <abbr title="The count of available tasks for that contact.">TODO:</abbr>
                    </dt>
                    <dd>The count of available tasks for that contact.</dd>
                    <dt>
                      <abbr title="Has this contact cast a ballot in the Nov. 2018 general election?">
                        Voted?
                      </abbr>
                    </dt>
                    <dd>Has this contact cast a ballot in the Nov. 2018 general election?</dd>
                  </dl>
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

UserHome.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(UserHome);

// <div className="columns">
//   <div className="column">
//     <div className="box">
//       <nav className="breadcrumb" aria-label="breadcrumbs">
//         <ul>
//           <li className="is-active">
//             <a aria-current="page">Dashboard</a>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   </div>
// </div>

import React, { PureComponent } from 'react';
import { faExclamation, faEdit, faTrashAlt } from '@fortawesome/fontawesome-pro-solid';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CellMeasurer } from 'react-virtualized';

class PvListRow extends PureComponent {
  render() {
    const { content } = this.props;
    return (
      <CellMeasurer
        cache={this.props.cache}
        columnIndex={0}
        parent={this.props.parent}
        rowIndex={this.props.index}
      >
        {({ measure }) => (
          <div>
            <div className="columns">
              <div className="column">
                {content.voterFileRecord.state_file_id ? (
                  <div className="content">
                    <strong>
                      {content.voterFileRecord.first_name} {content.voterFileRecord.last_name} ({
                        content.voterFileRecord.party
                      })
                    </strong>
                    <br />
                    <small>
                      {content.voterFileRecord.home_address} - {content.voterFileRecord.city},{' '}
                      {content.voterFileRecord.state} {content.voterFileRecord.zipcode}
                    </small>
                    <br />
                    <small>
                      Points: {content.pointsEarned} / {content.pointsPotential}
                    </small>
                  </div>
                ) : (
                  <div className="content">
                    <strong>
                      {content.first_name} {content.last_name}
                    </strong>
                    <br />
                    <small>{content.city}</small>
                    <br />
                    <small>
                      Points: {content.pointsEarned} / {content.pointsPotential}
                    </small>
                  </div>
                )}
              </div>
              <div className="column">
                {content.voterFileRecord && content.voterFileRecord.state_file_id ? (
                  <div className="field is-grouped is-grouped-multiline">
                    <div className="control">
                      <div
                        className="tags has-addons hover-hand"
                        onClick={this.props.openTaskModal}
                      >
                        <span
                          className={classNames('tag', 'is-white', {
                            'tag-button-danger': content.countAvailableTasks > 0,
                            'tag-button-success': content.countAvailableTasks === 0,
                          })}
                        >
                          <abbr title="The count of available tasks for that contact.">TASKS:</abbr>
                        </span>
                        <span
                          className={classNames('tag', {
                            'is-danger': content.countAvailableTasks > 0,
                            'is-success': content.countAvailableTasks === 0,
                          })}
                        >
                          {content.countCompletedTasks}/{content.countAvailableTasks +
                            content.countCompletedTasks}
                        </span>
                      </div>
                    </div>

                    <div className="control">
                      <div
                        className="tags has-addons hover-hand"
                        onClick={this.props.openVoterReviewModal}
                      >
                        <span className="tag is-white tag-button-success">
                          <abbr title="Has this contact been matched to a registered voter in the voter file?">
                            Registered?
                          </abbr>
                        </span>
                        <span className="tag is-success">Yes</span>
                      </div>
                    </div>

                    <div className="control">
                      <div
                        className="tags has-addons hover-hand"
                        onClick={this.props.openVoteByMailModal}
                      >
                        <span
                          className={classNames('tag', 'is-white', {
                            'tag-button-danger':
                              content.voterFileRecord.vo_ab_requested_primary === false,
                            'tag-button-success':
                              content.voterFileRecord.vo_ab_requested_primary === true,
                          })}
                        >
                          <abbr title="Has this contact registered to vote by mail?">VBM?</abbr>
                        </span>
                        <span
                          className={classNames('tag', {
                            'is-danger': content.voterFileRecord.vo_ab_requested_primary === false,
                            'is-success': content.voterFileRecord.vo_ab_requested_primary === true,
                          })}
                        >
                          {content.voterFileRecord.vo_ab_requested_primary ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>

                    <div className="control">
                      <div
                        className="tags has-addons hover-hand"
                        onClick={this.props.openVotedModal}
                      >
                        <span
                          className={classNames('tag', 'is-white', {
                            'tag-button-danger': content.voterFileRecord.vo_voted_primary === false,
                            'tag-button-success': content.voterFileRecord.vo_voted_primary === true,
                          })}
                        >
                          <abbr title="Has this contact cast a ballot in the Nov. 2018 primary election?">
                            Voted?
                          </abbr>
                        </span>
                        <span
                          className={classNames('tag', {
                            'is-danger': content.voterFileRecord.vo_voted_primary === false,
                            'is-success': content.voterFileRecord.vo_voted_primary === true,
                          })}
                        >
                          {content.voterFileRecord.vo_voted_primary ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <a
                    className="button is-small is-danger"
                    onClick={this.props.openVoterSearchModal}
                  >
                    <span className="icon is-small">
                      <FontAwesomeIcon icon={faExclamation} />
                    </span>{' '}
                    <span>Match to voter record</span>
                  </a>
                )}
              </div>
              <div className="column is-one-fifth">
                <div className="field is-grouped">
                  <p className="control">
                    {content.voterFileRecord.state_file_id ? null : (
                      <a
                        className="button is-danger is-outlined"
                        onClick={this.props.openPvEditModal}
                      >
                        <span className="icon is-small">
                          <FontAwesomeIcon icon={faEdit} />
                        </span>
                      </a>
                    )}
                    <a
                      className="button is-danger is-outlined"
                      onClick={this.props.openDeleteModal}
                    >
                      <span className="icon is-small">
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </span>
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <hr />
          </div>
        )}
      </CellMeasurer>
    );
  }
}

PvListRow.propTypes = {
  content: PropTypes.object.isRequired,
  openVoterReviewModal: PropTypes.func.isRequired,
  openVoterSearchModal: PropTypes.func.isRequired,
  openVoteByMailModal: PropTypes.func.isRequired,
  openVotedModal: PropTypes.func.isRequired,
  openTaskModal: PropTypes.func.isRequired,
  openPvEditModal: PropTypes.func.isRequired,
  openDeleteModal: PropTypes.func.isRequired,
};

export default PvListRow;

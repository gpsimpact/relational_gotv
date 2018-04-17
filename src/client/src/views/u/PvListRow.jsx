import React, { PureComponent } from 'react';
import { faExclamation, faEdit } from '@fortawesome/fontawesome-pro-solid';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class PvListRow extends PureComponent {
  render() {
    const { content } = this.props;
    return (
      <div className="pv-controls">
        <nav className="level">
          <div className="level-left">
            <div className="level-item edit-button">
              <a
                className="button is-danger is-outlined"
                onClick={() => this.props.openPvEditModal(content)}
              >
                <span className="icon is-small">
                  <FontAwesomeIcon icon={faEdit} />
                </span>
              </a>
            </div>
            <div className="level-item">
              <div className="content">
                <strong>
                  {content.first_name} {content.last_name}
                </strong>
                <br />
                <small>{content.city}</small>
              </div>
            </div>
          </div>
          <div className="level-right">
            {content.voterFileRecord && content.voterFileRecord.state_file_id ? (
              <div className="level-item">
                <div className="field is-grouped is-grouped-multiline">
                  <div className="control">
                    <div
                      className="tags has-addons"
                      onClick={() => this.props.openVoterReviewModal(content)}
                    >
                      <span className="tag">
                        <abbr title="Has this contact been matched to the voter file?">Voter?</abbr>
                      </span>
                      <span className="tag is-success">Yes</span>
                    </div>
                  </div>

                  <div className="control">
                    <div
                      className="tags has-addons"
                      onClick={() => this.props.openVoteByMailModal(content)}
                    >
                      <span className="tag">
                        <abbr title="Has this contact registered to vote by mail?">VBM?</abbr>
                      </span>
                      <span className="tag is-danger">No</span>
                    </div>
                  </div>

                  <div className="control">
                    <div
                      className="tags has-addons"
                      onClick={() => this.props.openTaskModal(content)}
                    >
                      <span className="tag">
                        <abbr title="The count of available tasks for that contact.">TODO:</abbr>
                      </span>
                      <span
                        className={classNames('tag', {
                          'is-danger': content.countAvailableTasks > 0,
                          'is-success': content.countAvailableTasks === 0,
                        })}
                      >
                        {content.countAvailableTasks}
                      </span>
                    </div>
                  </div>

                  <div className="control">
                    <div
                      className="tags has-addons"
                      onClick={() => this.props.openVotedModal(content)}
                    >
                      <span className="tag">
                        <abbr title="Has this contact cast a ballot in the Nov. 2018 general election?">
                          Voted?
                        </abbr>
                      </span>
                      <span className="tag is-danger">No</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="level-item">
                <a
                  className="button is-small is-danger"
                  onClick={() => this.props.openVoterSearchModal({ ...content })}
                >
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faExclamation} />
                  </span>{' '}
                  <span>Match to voter record</span>
                </a>
              </div>
            )}
          </div>
        </nav>
        <hr />
      </div>
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
};

export default PvListRow;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SchemaForm from './SchemaForm';
import { Mutation } from 'react-apollo';
import UPDATE_TASK from '../../data/mutations/updateTask';
import POINTS_PROFILE_USER_ORG_LIMITED from '../../data/queries/pointsProfileUserOrgLimited';
import { getUserEmail } from '../../utils/auth';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/fontawesome-pro-solid';
import { faSquare, faCheckSquare } from '@fortawesome/fontawesome-pro-light';
import { sortBy } from 'lodash';

class TaskModal extends PureComponent {
  state = {
    selectedTask: null,
  };

  render() {
    const { potentialVoter } = this.props;
    const sortedTasks = sortBy(potentialVoter.tasks, 'status').reverse();
    return (
      <div className={classNames('modal', { 'is-active': this.props.open })}>
        <div className="modal-background" onClick={() => this.props.close()} />

        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Tasks</p>
            <button className="delete" aria-label="close" onClick={() => this.props.close()} />
          </header>
          <section className="modal-card-body">
            <div className="content">
              {potentialVoter.voterFileRecord && potentialVoter.voterFileRecord.state_file_id ? (
                <Mutation
                  mutation={UPDATE_TASK}
                  refetchQueries={[
                    {
                      query: POINTS_PROFILE_USER_ORG_LIMITED,
                      variables: { email: getUserEmail(), org_id: this.props.match.params.orgSlug },
                    },
                  ]}
                >
                  {updateTask => (
                    <div>
                      {this.state.selectedTask !== null ? (
                        <SchemaForm
                          key={this.state.selectedTask.id}
                          taskId={this.state.selectedTask.id}
                          schema={this.state.selectedTask.form_schema}
                          point_value={this.state.selectedTask.point_value}
                          submitFn={values =>
                            updateTask({
                              variables: {
                                id: this.state.selectedTask.id,
                                status: 'COMPLETE',
                                form_data: values,
                              },
                            }).then(() => this.props.close())
                          }
                        />
                      ) : (
                        <div>
                          {sortedTasks.length > 0 ? (
                            <div className="content">
                              <h4>
                                Click a task below to preview or complete. Completed tasks earn
                                points!
                              </h4>
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Points</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sortedTasks.map(task => (
                                    <tr
                                      className={classNames('task_row', {
                                        complete: task.status === 'COMPLETE',
                                      })}
                                      key={task.id}
                                      onClick={() => {
                                        if (task.status !== 'COMPLETE') {
                                          this.setState({ selectedTask: task });
                                        }
                                      }}
                                    >
                                      <td
                                        className={classNames('task_title', {
                                          complete: task.status === 'COMPLETE',
                                        })}
                                      >
                                        {task.description}
                                      </td>
                                      <td>
                                        {task.status === 'COMPLETE' ? (
                                          <FontAwesomeIcon icon={faCheckSquare} size="2x" />
                                        ) : (
                                          <FontAwesomeIcon icon={faSquare} size="2x" />
                                        )}
                                      </td>
                                      <td>{task.point_value}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div>
                              <div className="has-text-centered	">
                                <FontAwesomeIcon icon={faThumbsUp} size="10x" />
                              </div>
                              <h2>
                                You&apos;ve completed all the currently assigned tasks for this
                                voter!
                              </h2>
                              <p>Check back again soon as we are always adding more tasks</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Mutation>
              ) : (
                <div className="content">
                  <h4>Match this person to the voter file. </h4>
                  <p>
                    <strong>
                      Your first task is to make sure this person is registered to vote!
                    </strong>
                  </p>
                  <p>
                    First, check to see if you can match them up with a record in the public voter
                    file provided by your county.
                  </p>
                  <button
                    className="button is-link submit-button is-fullwidth"
                    color="primary"
                    onClick={() => {
                      this.props.close();
                      this.props.openVoterSearchModal();
                    }}
                  >
                    Search for matching voter records
                  </button>
                  <p style={{ paddingTop: 10 }}>
                    If they aren’t there, it might be that they aren’t registered to vote. You
                    should contact them and ask them if they’ve registered recently, or if you might
                    have their name or city wrong. If they aren’t registered, or they don’t know,
                    encourage them to go to ksvotes.org to check their registration or to register
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => this.props.close()}
        />
      </div>
    );
  }
}

TaskModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  potentialVoter: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  openVoterSearchModal: PropTypes.func.isRequired,
};

export default withRouter(TaskModal);

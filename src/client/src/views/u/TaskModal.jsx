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

class TaskModal extends PureComponent {
  render() {
    const { potentialVoter } = this.props;
    return (
      <div className={classNames('modal', { 'is-active': this.props.open })}>
        <div className="modal-background" onClick={() => this.props.close()} />

        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">The next task:</p>
            <button className="delete" aria-label="close" onClick={() => this.props.close()} />
          </header>
          <section className="modal-card-body">
            <div className="content">
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
                    {potentialVoter.nextTask ? (
                      <SchemaForm
                        key={potentialVoter.nextTask.id}
                        taskId={potentialVoter.nextTask.id}
                        schema={potentialVoter.nextTask.form_schema}
                        point_value={potentialVoter.nextTask.point_value}
                        submitFn={values =>
                          updateTask({
                            variables: {
                              id: potentialVoter.nextTask.id,
                              status: 'COMPLETE',
                              form_data: values,
                            },
                          }).then(() => this.props.close())
                        }
                      />
                    ) : (
                      <div>
                        <div className="has-text-centered	">
                          <FontAwesomeIcon icon={faThumbsUp} size="10x" />
                        </div>
                        <h2>
                          You&apos;ve completed all the currently assigned tasks for this voter!
                        </h2>
                        <p>Check back again soon as we are always adding more tasks</p>
                      </div>
                    )}
                  </div>
                )}
              </Mutation>
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
};

export default withRouter(TaskModal);

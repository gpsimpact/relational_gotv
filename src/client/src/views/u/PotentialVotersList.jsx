import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import MY_POTENTIAL_VOTERS from '../../data/queries/potentialVoters';
import { InfiniteLoader, AutoSizer, List, CellMeasurerCache } from 'react-virtualized';
import VoterSearchModal from './VoterSearchModal';
import { uniqBy } from 'lodash';
import PvListRow from './PvListRow';
import ReactRouterPropTypes from 'react-router-prop-types';
import LinkedVoterFileRecordReviewModal from './LinkedVoterFileRecordReviewModal';
import VoteByMailModal from './VoteByMailModal';
import VotedModal from './VotedModal';
import TaskModal from './TaskModal';
import PvEditModal from './PvEditModal';
import DeleteModal from './DeleteModal';
// import { queries, fragments } from '../../data/queries';

class PotentialVotersList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      voterSearchModalOpen: false,
      voterReviewModalOpen: false,
      voteByMailModalOpen: false,
      taskModalOpen: false,
      votedModalOpen: false,
      pvEditModalOpen: false,
      deleteModalOpen: false,
      selectedPotentialVoter: null,
    };

    this._openModal = this._openModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
  }

  _openModal = (modalName, potentialVoter) => {
    this.setState({
      [modalName]: true,
      selectedPotentialVoter: potentialVoter,
    });
  };

  _closeModal = (modalName, potentialVoter) => {
    this.setState({
      [modalName]: false,
      selectedPotentialVoter: potentialVoter,
    });
  };

  cache = new CellMeasurerCache({
    defaultHeight: 50,
    fixedWidth: true,
  });

  render() {
    // const { loading, error, potentialVoters, loadMoreRows } = this.props;
    return (
      <div>
        <Query
          query={MY_POTENTIAL_VOTERS}
          variables={{
            limit: 25,
            org_id: this.props.match.params.orgSlug,
          }}
        >
          {({ data: { potentialVoters }, loading, error, fetchMore }) => {
            // console.log(foo);
            if (loading) {
              return <p>Loading...</p>;
            } else if (error) {
              return <p>Error!</p>;
            }
            if (potentialVoters.items.length === 0) {
              return (
                <div className="content">
                  <h1 className="title">Get started by adding a contact.</h1>
                  <p>
                    Welcome to this non-partisan relational advocacy tool. Thank you for agreeing to
                    reach out to your family, friends, and community to help engage them in voting.
                    There is no more effective get out the vote effort than people getting the
                    people they know to vote.
                  </p>

                  <p>
                    This tool revolves around your contacts. When you add a contact, you will be
                    presented with a list of tasks for that person. Some are pretty critical:
                    registering them to vote, getting them to request an advance ballot, and getting
                    them to vote. Others are engagement tasks along the way to those milestones. As
                    you complete tasks, you will receive points, so you can see how you&apos;re
                    doing.
                  </p>

                  <p>
                    We encourage you to list at least ten people you know, and take the first step:
                    matching them up to the public voter file. If you can&apos;t find a match, we
                    have instructions for checking for errors or getting in touch to see if they are
                    registered to vote, and registering them if they are not.
                  </p>

                  <p>Here is a brief overview of the points you may earn:</p>
                  <ul>
                    <li>For having 10 or more contacts: 10 pts.</li>
                    <li>For matching a contact to a record in the voter file: 1 pt. each</li>
                    <li>
                      For each contact, related to the primary election, then again for the general
                      election:
                    </li>
                    <li>
                      <ul>
                        <li>Contact applies for an advance ballot by mail: 5 pts.</li>
                        <li>
                          Contact votes early (submits ballot by mail or votes in advance in
                          person): 5 pts.
                        </li>
                        <li>
                          Contact votes (any which way, early, or on election day): 10-40 pts.
                          depending on the contact&apos;s record of voting. Those who vote every
                          election garner fewer points than those who vote infrequently. We&apos;re
                          creating a culture of voting here!
                        </li>
                      </ul>
                    </li>
                    <li>Additional, self-reporting tasks will be made available for 1 pt. each.</li>
                  </ul>
                  <p>
                    In the end, you make all the difference. Your enthusiasm, your dedication to
                    creating a culture of voting will convince your circle to get out and become
                    engaged, too. Thank you.
                  </p>
                </div>
              );
            }

            return (
              <div>
                <h1 className="title">You have added {potentialVoters.items.length} contacts:</h1>
                <hr />
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <InfiniteLoader
                      isRowLoaded={({ index }) => !!potentialVoters.items[index]}
                      loadMoreRows={() =>
                        fetchMore({
                          variables: {
                            after: potentialVoters.pageInfo.nextCursor,
                          },
                          updateQuery: (previousResult, { fetchMoreResult }) => {
                            if (!fetchMoreResult) return previousResult;
                            const newItems = fetchMoreResult.potentialVoters.items;
                            fetchMoreResult.potentialVoters.items = [
                              ...previousResult.potentialVoters.items,
                              ...newItems,
                            ];
                            //dedupe by id
                            fetchMoreResult.potentialVoters.items = uniqBy(
                              fetchMoreResult.potentialVoters.items,
                              'id'
                            );
                            return fetchMoreResult;
                          },
                        })
                      }
                      rowCount={potentialVoters.pageInfo.totalCount}
                    >
                      {({ onRowsRendered, registerChild }) => (
                        <div>
                          <List
                            className="infiniteList"
                            height={600}
                            onRowsRendered={onRowsRendered}
                            noRowsRenderer={() => (
                              <h2>
                                Create your first list member by clicking &ldquo;Add New
                                Contact&rdquo; button
                              </h2>
                            )}
                            ref={registerChild}
                            rowCount={potentialVoters.items.length}
                            rowHeight={this.cache.rowHeight}
                            rowRenderer={({ index, style, parent }) => {
                              let content;
                              // console.log(this.props);
                              if (index < potentialVoters.items.length) {
                                content = potentialVoters.items[index];
                              } else {
                                content = (
                                  // <LinearProgress mode="indeterminate" />
                                  <div>Loading.....</div>
                                );
                              }
                              return (
                                <div key={index} style={style}>
                                  <PvListRow
                                    id={content.id}
                                    content={content}
                                    index={index}
                                    cache={this.cache}
                                    parent={parent}
                                    openVoterSearchModal={() =>
                                      this._openModal('voterSearchModalOpen', content)
                                    }
                                    openVoterReviewModal={() =>
                                      this._openModal('voterReviewModalOpen', content)
                                    }
                                    openVoteByMailModal={() =>
                                      this._openModal('voteByMailModalOpen', content)
                                    }
                                    openVotedModal={() =>
                                      this._openModal('votedModalOpen', content)
                                    }
                                    openTaskModal={() => this._openModal('taskModalOpen', content)}
                                    openPvEditModal={() =>
                                      this._openModal('pvEditModalOpen', content)
                                    }
                                    openDeleteModal={() =>
                                      this._openModal('deleteModalOpen', content)
                                    }
                                  />
                                </div>
                              );
                            }}
                            width={width}
                            overscanRowCount={5}
                          />
                        </div>
                      )}
                    </InfiniteLoader>
                  )}
                </AutoSizer>

                {this.state.selectedPotentialVoter ? (
                  <div>
                    <VoterSearchModal
                      open={this.state.voterSearchModalOpen}
                      potentialVoter={this.state.selectedPotentialVoter}
                      close={() => this._closeModal('voterSearchModalOpen')}
                    />
                    <LinkedVoterFileRecordReviewModal
                      open={this.state.voterReviewModalOpen}
                      potentialVoter={this.state.selectedPotentialVoter}
                      close={() => this._closeModal('voterReviewModalOpen')}
                      openVoterSearchModal={() =>
                        this._openModal('voterSearchModalOpen', this.state.selectedPotentialVoter)
                      }
                    />
                    <VoteByMailModal
                      open={this.state.voteByMailModalOpen}
                      potentialVoter={this.state.selectedPotentialVoter}
                      close={() => this._closeModal('voteByMailModalOpen')}
                    />
                    <VotedModal
                      open={this.state.votedModalOpen}
                      potentialVoter={this.state.selectedPotentialVoter}
                      close={() => this._closeModal('votedModalOpen')}
                    />
                    <TaskModal
                      open={this.state.taskModalOpen}
                      potentialVoter={this.state.selectedPotentialVoter}
                      close={() => this._closeModal('taskModalOpen')}
                      openVoterSearchModal={() =>
                        this._openModal('voterSearchModalOpen', this.state.selectedPotentialVoter)
                      }
                    />
                    <PvEditModal
                      open={this.state.pvEditModalOpen}
                      potentialVoter={this.state.selectedPotentialVoter}
                      close={() => this._closeModal('pvEditModalOpen')}
                    />
                    <DeleteModal
                      open={this.state.deleteModalOpen}
                      potentialVoter={this.state.selectedPotentialVoter}
                      close={() => this._closeModal('deleteModalOpen')}
                    />
                  </div>
                ) : null}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

PotentialVotersList.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(PotentialVotersList);

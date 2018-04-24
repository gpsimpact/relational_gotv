import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import MY_POTENTIAL_VOTERS from '../../data/queries/potentialVoters';
import { InfiniteLoader, AutoSizer, List } from 'react-virtualized';
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
                <div className-="content">
                  <h1 className="title">Get started by adding a contact.</h1>
                  <p>
                    Danny will write verbose instructions to be placed here as per{' '}
                    <a href="https://github.com/gpsimpact/relational_gotv/issues/42">
                      github issue #42
                    </a>
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
                            rowHeight={100}
                            rowRenderer={({ index, style }) => {
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

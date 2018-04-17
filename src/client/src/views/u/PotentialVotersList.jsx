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
      selectedPotentialVoter: null,
    };

    this._openVoterSearchModal = this._openVoterSearchModal.bind(this);
    this._closeVoterSearchModal = this._closeVoterSearchModal.bind(this);
    this._closeVoterReviewModal = this._closeVoterReviewModal.bind(this);
    this._openVoterReviewModal = this._openVoterReviewModal.bind(this);
    this._closeVotedModal = this._closeVotedModal.bind(this);
    this._openVotedModal = this._openVotedModal.bind(this);
    this._openTaskModal = this._openTaskModal.bind(this);
    this._closeTaskModal = this._closeTaskModal.bind(this);
    this._openPvEditModal = this._openPvEditModal.bind(this);
    this._closePvEditModal = this._closePvEditModal.bind(this);
  }

  _openVoterSearchModal = potentialVoter => {
    this.setState({
      voterSearchModalOpen: true,
      selectedPotentialVoter: potentialVoter,
    });
  };

  _closeVoterSearchModal = () => {
    this.setState({
      voterSearchModalOpen: false,
      selectedPotentialVoter: null,
    });
  };

  _openVoterReviewModal = potentialVoter => {
    this.setState({
      voterReviewModalOpen: true,
      selectedPotentialVoter: potentialVoter,
    });
  };

  _closeVoterReviewModal = () => {
    this.setState({
      voterReviewModalOpen: false,
      selectedPotentialVoter: null,
    });
  };

  _openVoteByMailModal = potentialVoter => {
    this.setState({
      voteByMailModalOpen: true,
      selectedPotentialVoter: potentialVoter,
    });
  };

  _closeVoteByMailModal = () => {
    this.setState({
      voteByMailModalOpen: false,
      selectedPotentialVoter: null,
    });
  };

  _openVotedModal = potentialVoter => {
    this.setState({
      votedModalOpen: true,
      selectedPotentialVoter: potentialVoter,
    });
  };

  _closeVotedModal = () => {
    this.setState({
      votedModalOpen: false,
      selectedPotentialVoter: null,
    });
  };

  _openTaskModal = potentialVoter => {
    this.setState({
      taskModalOpen: true,
      selectedPotentialVoter: potentialVoter,
    });
  };

  _closeTaskModal = () => {
    this.setState({
      taskModalOpen: false,
      selectedPotentialVoter: null,
    });
  };

  _openPvEditModal = potentialVoter => {
    this.setState({
      pvEditModalOpen: true,
      selectedPotentialVoter: potentialVoter,
    });
  };

  _closePvEditModal = () => {
    this.setState({
      pvEditModalOpen: false,
      selectedPotentialVoter: null,
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
            return (
              <div>
                <h1 className="title">
                  You have added {potentialVoters.pageInfo.totalCount} contacts:
                </h1>
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
                                    openVoterSearchModal={this._openVoterSearchModal}
                                    openVoterReviewModal={this._openVoterReviewModal}
                                    openVoteByMailModal={this._openVoteByMailModal}
                                    openVotedModal={this._openVotedModal}
                                    openTaskModal={this._openTaskModal}
                                    openPvEditModal={this._openPvEditModal}
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
                      close={this._closeVoterSearchModal}
                    />
                    <LinkedVoterFileRecordReviewModal
                      open={this.state.voterReviewModalOpen}
                      potentialVoter={this.state.selectedPotentialVoter}
                      close={this._closeVoterReviewModal}
                    />
                    <VoteByMailModal
                      open={this.state.voteByMailModalOpen}
                      potentialVoter={this.state.selectedPotentialVoter}
                      close={this._closeVoteByMailModal}
                    />
                    <VotedModal
                      open={this.state.votedModalOpen}
                      potentialVoter={this.state.selectedPotentialVoter}
                      close={this._closeVotedModal}
                    />
                    <TaskModal
                      open={this.state.taskModalOpen}
                      potentialVoter={this.state.selectedPotentialVoter}
                      close={this._closeTaskModal}
                    />
                    <PvEditModal
                      open={this.state.pvEditModalOpen}
                      potentialVoter={this.state.selectedPotentialVoter}
                      close={this._closePvEditModal}
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

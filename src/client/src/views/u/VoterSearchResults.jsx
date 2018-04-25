import React, { PureComponent } from 'react';
import VOTER_SEARCH from '../../data/queries/voterSearch';
import { Query } from 'react-apollo';
// import { withRouter } from 'react-router-dom';
// import { Row, Col } from 'reactstrap';
// import { parse, differenceInCalendarYears } from 'date-fns';
// import AssociateVoterButton from './AssociateVoterButton';
// import { faBadgeCheck, faExclamation } from '@fortawesome/fontawesome-pro-solid';
// import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { InfiniteLoader, AutoSizer, List } from 'react-virtualized';
import PropTypes from 'prop-types';
import { uniqBy } from 'lodash';
import NoVoterMatchDialogue from './NoVoterMatchDialogue';
import VoterSearchResultsRow from './VoterSearchResultsRow';

export class VoterSearchResults extends PureComponent {
  render() {
    return (
      <div>
        <Query
          query={VOTER_SEARCH}
          variables={{
            limit: 10,
            first_name: this.props.first_name,
            last_name: this.props.last_name,
            city: this.props.city,
            state: this.props.state,
          }}
        >
          {({ data: { voters }, loading, error, fetchMore }) => {
            if (loading) {
              return <p>Loading...</p>;
            } else if (error) {
              return <p>Error!</p>;
            }
            return (
              <div className="columns">
                <div className="column">
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <InfiniteLoader
                        isRowLoaded={({ index }) => !!voters.items[index]}
                        loadMoreRows={() =>
                          fetchMore({
                            variables: {
                              after: voters.pageInfo.nextCursor,
                            },
                            updateQuery: (previousResult, { fetchMoreResult }) => {
                              if (!fetchMoreResult) return previousResult;
                              const newItems = fetchMoreResult.voters.items;
                              fetchMoreResult.voters.items = [
                                ...previousResult.voters.items,
                                ...newItems,
                              ];
                              //dedupe by id
                              fetchMoreResult.voters.items = uniqBy(
                                fetchMoreResult.voters.items,
                                'state_file_id'
                              );
                              return fetchMoreResult;
                            },
                          })
                        }
                        rowCount={voters.pageInfo.totalCount}
                      >
                        {({ onRowsRendered, registerChild }) => (
                          <div>
                            <List
                              className="infiniteList"
                              height={400}
                              onRowsRendered={onRowsRendered}
                              noRowsRenderer={() => <NoVoterMatchDialogue />}
                              ref={registerChild}
                              rowCount={voters.items.length}
                              rowHeight={100}
                              rowRenderer={({ index, style }) => {
                                let content;
                                if (index < voters.items.length) {
                                  content = voters.items[index];
                                } else {
                                  content = <div>Loading.....</div>;
                                }
                                console.log(content);
                                return (
                                  <div key={index} style={style}>
                                    <VoterSearchResultsRow
                                      pv_id={this.props.pv_id}
                                      close_modal={this.props.close_modal}
                                      content={content}
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
                </div>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

VoterSearchResults.propTypes = {
  close_modal: PropTypes.func.isRequired,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  pv_id: PropTypes.string.isRequired,
};

export default VoterSearchResults;

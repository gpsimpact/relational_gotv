import React, { PureComponent } from 'react';
import VOTER_SEARCH from '../queries/voterSearch';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { parse, differenceInCalendarYears } from 'date-fns';
import AssociateVoterButton from './AssociateVoterButton';
// import { faBadgeCheck, faExclamation } from '@fortawesome/fontawesome-pro-solid';
// import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { InfiniteLoader, AutoSizer, List } from 'react-virtualized';

// import VoterProfile from './VoterProfile';
// import VoterSearch from './VoterSearch';

const configObject = {
  options: props => {
    let after = props.nextCursor;
    return {
      variables: {
        limit: 10,
        after: after,
        first_name: props.first_name,
        last_name: props.last_name,
        city: props.city,
        state: props.state,
      },
    };
  },
  force: true,
  props: ({ ownProps, data }) => {
    const { loading, voters, fetchMore, error } = data;
    /******************************************************************************************************************
     *  This callback function is called to load more rows from GraphQL Server.
     ******************************************************************************************************************/
    const loadMoreRows = () => {
      // console.log('!!!!! Loading more!');
      return fetchMore({
        variables: {
          limit: 10,
          first_name: ownProps.first_name,
          last_name: ownProps.last_name,
          city: ownProps.city,
          state: ownProps.state,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newItems = fetchMoreResult.voters.items;
          fetchMoreResult.voters.items = [...previousResult.voters.items, ...newItems];
          return fetchMoreResult;
        },
      });
    };
    /******************************************************************************************************************
     *  props to be passed to subsequent children.
     ******************************************************************************************************************/
    return {
      loading,
      error,
      voters,
      loadMoreRows,
    };
  },
};

let virtualizingList = [];

export class VoterSearchResults extends PureComponent {
  constructor(props) {
    super(props);
    // const { loadMoreRows, potentialVoters } = this.props;

    this._isRowLoaded = this._isRowLoaded.bind(this);
    this._rowRenderer = this._rowRenderer.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
  }
  /******************************************************************************************************************
   *  Used in InfiniteLoader to track the loaded state of each row.
   ******************************************************************************************************************/
  _isRowLoaded({ index }) {
    return !!virtualizingList[index];
  }
  /******************************************************************************************************************
   *  Used in List to render each row.
   ******************************************************************************************************************/
  _rowRenderer({ key, index, style, push }) {
    let content;
    if (index < virtualizingList.length) {
      content = virtualizingList[index];
      return (
        <div key={key} style={style}>
          <div className="VoterSearchResultContainer">
            <Row>
              <Col>
                <h3>
                  {content.first_name} {content.last_name}
                  <small style={{ paddingLeft: 10 }} className="text-muted">
                    {content.home_address} {content.city}, {content.state} {content.zip} -{' '}
                    {differenceInCalendarYears(new Date(), parse(content.dob))} years old
                  </small>
                  <div className="float-right">
                    <AssociateVoterButton
                      pv_id={this.props.pv_id}
                      voter_id={content.state_file_id}
                    />
                  </div>
                </h3>
              </Col>
            </Row>
          </div>
        </div>
      );
    }
    return (
      // <LinearProgress mode="indeterminate" />
      <div key={key} style={style}>
        Loading.....
      </div>
    );
  }

  /******************************************************************************************************************
   *  When no rows are returned
   ******************************************************************************************************************/
  _noRowsRenderer() {
    return <h2>Create your first list member below.</h2>;
  }
  render() {
    // const { loading, error, voters } = this.props;
    const { loading, error, voters, loadMoreRows } = this.props;
    virtualizingList = voters && voters.items ? voters.items : [];
    if (loading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>Error!</p>;
    }
    if (voters.items.length > 0) {
      return (
        <div>
          <Row style={{ paddingTop: 20 }}>
            <Col>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <InfiniteLoader
                    isRowLoaded={this._isRowLoaded}
                    loadMoreRows={loadMoreRows}
                    rowCount={voters.pageInfo.totalCount}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <div>
                        <List
                          height={400}
                          onRowsRendered={onRowsRendered}
                          noRowsRenderer={this._noRowsRenderer}
                          ref={registerChild}
                          rowCount={voters.items.length}
                          rowHeight={50}
                          rowRenderer={this._rowRenderer}
                          width={width}
                          overscanRowCount={5}
                        />
                      </div>
                    )}
                  </InfiniteLoader>
                )}
              </AutoSizer>
            </Col>
          </Row>
        </div>
      );
    }

    // no voter view
    return (
      <div style={{ paddingTop: 20 }}>
        <Row>
          <Col>
            <h3>
              No matching voters found
              <small className="text-muted" style={{ paddingLeft: 10 }}>
                Perhaps they are unregistered.
              </small>
            </h3>
            <p>
              Try searching again. Remember that people may register under a different version of
              their name.
            </p>
            <p>
              If you can not find a likely match it is possible your contact is unregistered to
              vote. Include lots of instructions here about how to register them.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce scelerisque, tortor
              consectetur sodales faucibus, urna metus vestibulum quam, id dignissim felis dui sed
              erat. Proin nunc massa, molestie non condimentum non, molestie vitae augue. Phasellus
              sed ultricies ligula, non egestas lectus. In eget ultricies libero, sit amet tristique
              metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus. Integer aliquam sem vitae viverra dignissim. Proin luctus interdum
              neque, interdum commodo orci mollis ac. In et magna varius, aliquam urna a, sagittis
              enim. Nulla sed cursus mauris, sit amet tristique enim.
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

const VoterSearchResultsWithData = graphql(VOTER_SEARCH, configObject)(
  withRouter(VoterSearchResults)
);

export default VoterSearchResultsWithData;

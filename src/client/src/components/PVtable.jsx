import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Card, CardHeader, CardBody, CardTitle, CardSubtitle, Row, Col } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { faBadgeCheck, faExclamation } from '@fortawesome/fontawesome-pro-solid';
import { InfiniteLoader, AutoSizer, List } from 'react-virtualized';
import MY_POTENTIAL_VOTERS from '../queries/potentialVoters';
import '../styles/rvtables.css';

const configObject = {
  options: props => {
    let after = props.nextCursor;
    return {
      variables: { limit: 5, after: after, org_id: props.org_id },
    };
  },
  force: true,
  props: ({ ownProps, data }) => {
    const { loading, potentialVoters, fetchMore, error } = data;
    /******************************************************************************************************************
     *  This callback function is called to load more rows from GraphQL Server.
     ******************************************************************************************************************/
    const loadMoreRows = () => {
      // console.log('!!!!! Loading more!');
      return fetchMore({
        variables: {
          limit: 5,
          after: potentialVoters.pageInfo.nextCursor,
          org_id: ownProps.org_id,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newItems = fetchMoreResult.potentialVoters.items;
          fetchMoreResult.potentialVoters.items = [
            ...previousResult.potentialVoters.items,
            ...newItems,
          ];
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
      potentialVoters,
      loadMoreRows,
    };
  },
};

let virtualizingList = [];

export class PvTable extends Component {
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
    // console.log(this.props);
    if (index < virtualizingList.length) {
      content = virtualizingList[index];
    } else {
      content = (
        // <LinearProgress mode="indeterminate" />
        <div>Loading.....</div>
      );
    }
    return (
      <div key={key} style={style}>
        <div className="PvBox" onClick={() => this.props.history.push(`/u/pv/${content.id}`)}>
          <Row>
            <Col xs="1" className="d-flex justify-content-center align-items-center">
              {content.state_file_id ? (
                <FontAwesomeIcon icon={faBadgeCheck} size="5x" />
              ) : (
                <FontAwesomeIcon icon={faExclamation} size="5x" style={{ color: '#c0392b' }} />
              )}
            </Col>
            <Col>
              <Row>
                <Col>
                  <h2>
                    {content.first_name} {content.last_name}
                  </h2>
                </Col>
              </Row>
              <Row>
                <Col>
                  {content.state_file_id ? (
                    <p>
                      You have {content.countAvailableTasks} available tasks for{' '}
                      {content.first_name}!
                    </p>
                  ) : (
                    <p>
                      {content.first_name} is not matched to a voter registration record. Match them
                      or help them register to vote!
                    </p>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
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
    const { loading, error, potentialVoters, loadMoreRows } = this.props;
    virtualizingList = potentialVoters && potentialVoters.items ? potentialVoters.items : [];
    if (loading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>Error!</p>;
    }
    // console.dir(this.props);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your List</CardTitle>
          <CardSubtitle>Click on a person.</CardSubtitle>
        </CardHeader>
        <CardBody>
          <AutoSizer disableHeight>
            {({ width }) => (
              <InfiniteLoader
                isRowLoaded={this._isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={potentialVoters.pageInfo.totalCount}
              >
                {({ onRowsRendered, registerChild }) => (
                  <div>
                    <List
                      height={400}
                      onRowsRendered={onRowsRendered}
                      noRowsRenderer={this._noRowsRenderer}
                      ref={registerChild}
                      rowCount={potentialVoters.items.length}
                      rowHeight={140}
                      rowRenderer={this._rowRenderer}
                      width={width}
                      overscanRowCount={5}
                    />
                  </div>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        </CardBody>
      </Card>
    );
  }
}

const PvTableWithData = graphql(MY_POTENTIAL_VOTERS, configObject)(withRouter(PvTable));

export default PvTableWithData;

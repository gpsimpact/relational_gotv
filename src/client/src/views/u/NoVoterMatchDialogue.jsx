import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import DATA_DATES from '../../data/queries/dataDates';
import { parse, distanceInWordsToNow } from 'date-fns';

class NoVoterMatchDialogue extends PureComponent {
  render() {
    return (
      <Query query={DATA_DATES}>
        {({ loading, error, data: { dataDates } }) => {
          if (loading) return <div className="loader" />;
          if (error) return <p>Error!</p>;
          return (
            <div className="content">
              <h2>Sorry, No voters match this search</h2>
              <p>
                As of {dataDates.voterFileDate} no voters match this search criteria. That may mean:
              </p>
              <ol>
                <li>You may have mispelled something? Review, edit, and try again?</li>
                <li>
                  If you are searching for someone who may have registered in the last{' '}
                  {distanceInWordsToNow(parse(dataDates.voterFileDate))}, they would not be found
                  here, yet. Check back later. We tend to update voter info about once per month.
                </li>
                <li>
                  This person may not be registered to vote. Please refer them to{' '}
                  <a href="https://ksvotes.org">KsVotes.org</a> as an easy way to register.
                  Alternatively you can help them download, print and return the{' '}
                  <a href="https://www.eac.gov/assets/1/6/Federal_Voter_Registration_03-08-2018_ENG.pdf">
                    Federal Voter Registration Form
                  </a>. Instructions are included in the form.
                </li>
              </ol>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default NoVoterMatchDialogue;

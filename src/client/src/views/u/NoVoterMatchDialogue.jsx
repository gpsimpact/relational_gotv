import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import DATA_DATES from '../../data/queries/dataDates';
import { parse, format } from 'date-fns';

class NoVoterMatchDialogue extends PureComponent {
  render() {
    return (
      <Query query={DATA_DATES}>
        {({ loading, error, data: { dataDates } }) => {
          if (loading) return <div className="loader" />;
          if (error) return <p>Error!</p>;
          return (
            <div className="content">
              <h2>Sorry, No voters match this search.</h2>
              <p>
                As of {dataDates.voterFileDate} no voters match this search criteria. That may mean:
              </p>
              <ol>
                <li>
                  Review your search terms. Check spelling, try &quot;Robert&quot; for Bob, or
                  &quot;Sar&quot; for Sarah and Sara, and make sure of their city.
                </li>
                <li>
                  If they are not registered to vote, they will not be listed in the voter file.
                  Please refer them to <a href="https://ksvotes.org">KsVotes.org</a> as an easy way
                  to register. Alternatively you can help them download, print and return the{' '}
                  <a href="https://www.eac.gov/assets/1/6/Federal_Voter_Registration_03-08-2018_ENG.pdf">
                    Federal Voter Registration Form
                  </a>. Instructions are included in the form.
                </li>
                <li>
                  If they have registered to vote recently, they may not be in the latest file,
                  dated {format(parse(dataDates.voterFileDate), 'MM/DD/YYYY')}. Try again at a later
                  date. We update the voter file monthly.
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

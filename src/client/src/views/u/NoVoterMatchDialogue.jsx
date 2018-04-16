import React, { PureComponent } from 'react';

class NoVoterMatchDialogue extends PureComponent {
  render() {
    return (
      <div className="content">
        <h2>Sorry, No voters match this search</h2>
        <p>As of //FILE_DATE// no voters match this search criteria. That may mean:</p>
        <ol>
          <li>You may have mispelled something? Review, edit, and try again?</li>
          <li>
            They may have recently registered after //FILE_DATE// so we don&apos;t have them in the
            system yet. If so, check back later. We tend to update voter info about once per month.
          </li>
          <li>
            This person may not be registered to vote. Please refer them to{' '}
            <a href="https://ksvotes.org">KsVotes.org</a> as an easy way to register. Alternatively
            you can help them download, print and return the{' '}
            <a href="https://www.eac.gov/assets/1/6/Federal_Voter_Registration_03-08-2018_ENG.pdf">
              Federal Voter Registration Form
            </a>. Instructions are included in the form.
          </li>
        </ol>
      </div>
    );
  }
}

export default NoVoterMatchDialogue;

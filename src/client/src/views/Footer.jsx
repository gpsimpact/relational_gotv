import React, { PureComponent } from 'react';

class Footer extends PureComponent {
  render() {
    return (
      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>
              <strong>The Voter to Voter Project</strong> is supported by{' '}
              <a href="https://www.mainstreamcoalition.org/">the MainStream Education Foundation</a>{' '}
              with support from the{' '}
              <a href="https://reachhealth.org/">Reach Healthcare Foundation</a>.
            </p>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;

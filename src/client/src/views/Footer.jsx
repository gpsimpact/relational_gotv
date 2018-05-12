import React, { PureComponent } from 'react';

class Footer extends PureComponent {
  render() {
    return (
      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>
              This Relational Get Out The Vote project was conceived by{' '}
              <a href="https://www.gpsimpact.com/">GPS Impact</a> and the{' '}
              <a href="https://www.mainstreamcoalition.org/">MainStream Education Foundation.</a>{' '}
              Personal. Powerful.
            </p>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;

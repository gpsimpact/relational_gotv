import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Routes } from './routes';

class Auth extends PureComponent {
  render() {
    return (
      <section className="hero is-primary is-fullheight">
        <div className="hero-body">
          <div className="container">{Routes}</div>
        </div>
      </section>
    );
  }
}

export default withRouter(Auth);

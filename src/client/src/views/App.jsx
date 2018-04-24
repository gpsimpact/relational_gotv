import React, { PureComponent } from 'react';
import { Routes } from './routes';
import MainNav from './MainNav';
import Footer from './Footer';
import { isLoggedIn, getUserEmail } from '../utils/auth';
import { withRouter } from 'react-router-dom';

class App extends PureComponent {
  render() {
    return (
      <div>
        <header>
          <MainNav isLoggedIn={isLoggedIn()} email={getUserEmail()} />
        </header>
        <main>{Routes}</main>
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);

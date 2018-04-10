import React, { PureComponent } from 'react';
import { Routes } from './routes';
import MainNav from './MainNav';
// import Main from './Main';
// import NavBar from './NavBar';
import { isLoggedIn, getUserEmail } from '../utils/auth';
import { withRouter } from 'react-router-dom';

// import { Container } from 'reactstrap';

class App extends PureComponent {
  render() {
    return (
      <div>
        <header>
          <MainNav isLoggedIn={isLoggedIn()} email={getUserEmail()} />
        </header>
        <main>{Routes}</main>
        <footer />
      </div>
    );
  }
}

export default withRouter(App);

// <NavBar isLoggedIn={isLoggedIn()} />
//   <section className="section">
//     <div className="container">
//       <Main />
//     </div>
//   </section>

// import { gql } from 'apollo-boost';
// import { Query } from 'react-apollo';

// const GET_STATUS = gql`
//   query {
//     status {
//       message
//     }
//   }
// `;

// const App = () => (
//   <Query query={GET_STATUS}>
//     {({ loading, error, data }) => {
//       if (loading) return <div>Loading...</div>;
//       if (error) return <div>Error :(</div>;

//       return (
//         <div>
//           <h1 className="font-sans text-lg text-grey-darkest text-center">hi</h1>
//           <pre>{JSON.stringify(data, null, '\t')}</pre>
//         </div>
//       );
//     }}
//   </Query>
// );

// export default App;

import React from 'react';
import Main from './Main';
import NavBar from './NavBar';
import { isLoggedIn } from '../utils/auth';

const App = () => (
  <div>
    <NavBar isLoggedIn={isLoggedIn()} />

    <Main />
  </div>
);

export default App;

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

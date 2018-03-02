import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
// import ApolloClient from 'apollo-boost';
// import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.css';

// // Pass your GraphQL endpoint to uri
// const client = new ApolloClient({
//   // There is currently a outstanding pull request which should fix this approach
//   // https://github.com/apollographql/apollo-client/pull/3056 - waiting for fix
//   // if not fixed, fall back to old solution here:
//   // https://github.com/gpsimpact/polaris/blob/master/frontend/src/index.js
//   // request: async operation => {
//   //   const token = await localStorage.getItem('token');
//   //   operation.setContext({
//   //     headers: {
//   //       Authorization: token ? `${token}` : null,
//   //     },
//   //   });
//   // },
// });

const httpLink = createHttpLink({
  uri: '/graphql', //process.env.REACT_APP_APOLLO_ENDPOINT || "http://localhost:5000/graphql"
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      Authorization: token ? `${token}` : null,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const ApolloApp = () => (
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
);

ReactDOM.render(<ApolloApp />, document.getElementById('root'));
registerServiceWorker();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import registerServiceWorker from './registerServiceWorker';

// Pass your GraphQL endpoint to uri
const client = new ApolloClient();

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<ApolloApp />, document.getElementById('root'));
registerServiceWorker();

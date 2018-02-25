import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
// import path from 'path';
// import { Engine } from 'apollo-engine';
import { formatError } from 'apollo-errors';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from '../graphql/schema';
import MakeContext from '../Context';
import buildEmail from '../email';

// APOLLO OPTICS SERVICE - TEMPORARILY DISABLED UNTIL API IS MORE COMPLETE
// const engine = new Engine({
//   engineConfig: {
//     apiKey: '#######################', - Add in new API KEY when ready to activate
//     logging: {
//       level: 'WARN', // Engine Proxy logging level. DEBUG, INFO, WARN or ERROR
//     },
//   },
//   graphqlPort: process.env.PORT || 5000, // GraphQL port
//   endpoint: '/graphql', // GraphQL endpoint suffix - '/graphql' by default
//   dumpTraffic: true, // Debug configuration that logs traffic between Proxy and GraphQL server
// });
// engine.start();

const app = express();

app.use(compression());
// app.use(engine.expressMiddleware());
app.get('/status', (req, res) => res.send('Express status: OK')); // todo
app.get('/email/:topic', (req, res) => {
  const content = buildEmail(req.params.topic, req.query);
  res.send(content.html);
});
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => {
    return {
      schema,
      context: new MakeContext(req),
      formatError,
      // tracing: true, // for apollo optics
      // cacheControl: true, // for apollo optics
    };
  })
);
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// serve static react assets
app.use(express.static('/app/src/client/build'));
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile('/app/src/client/build/index.html');
  // res.sendFile(path.join(__dirname + 'src/client/build/index.html'));
});

export default app;

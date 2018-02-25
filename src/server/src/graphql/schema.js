import glob from 'glob';
import fs from 'fs';
import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';

process.on('warning', e => console.warn(e.stack));

const typeDefs = [];

// loop over types and import the contents
glob.sync('**/*.type.gql', { cwd: '/app/src/server/src/graphql' }).forEach(filename => {
  const filePath = path.join('/app/src/server/src/graphql', filename);
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
  typeDefs.push(fileContent);
});

import resolvers from './resolvers';

// create a schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// add mocks to the schema, preserving the existing resolvers (none for the time beeing)
// import mocks from './mocks';
// addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });

export default schema;

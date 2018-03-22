module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: process.env.DATA_DB_USER,
      database: 'gonano',
      host: process.env.DATA_DB_HOST,
      password: process.env.DATA_DB_PASS,
    },
  },
  test: {
    client: 'pg',
    connection: {
      user: process.env.DATA_DB_USER,
      database: 'gonano',
      host: process.env.DATA_DB_HOST,
      password: process.env.DATA_DB_PASS,
    },
  },
  production: {
    // client: 'pg',
    // // must use this for production as that is how heroku sets it automatically.
    // connection: process.env.DATABASE_URL,
    client: 'pg',
    connection: {
      user: process.env.DATA_DB_USER,
      database: 'gonano',
      host: process.env.DATA_DB_HOST,
      password: process.env.DATA_DB_PASS,
    },
  },
};

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h1>Relational GOTV app</h1>
    <p>
      This is the main page. This should be promotional text to encourage organizations to join the
      site and volunteers to join up with their org.
    </p>
    <p> For now visit the example org to get started.</p>
    <p>
      Example org: <Link to="/org/acme">Acme Org</Link>
    </p>
  </div>
);

export default Home;

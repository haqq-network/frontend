import * as React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

const Staking = React.lazy(() => import('staking/Module'));

export function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/staking">Staking</Link>
        </li>
      </ul>
      <Routes>
        <Route
          path="/"
          element={
            <div className="wrapper">
              <div className="container">
                <div id="welcome">
                  <h1>
                    <span> Hello there, </span>
                    Welcome shell app 👋
                  </h1>
                </div>
              </div>
            </div>
          }
        />

        <Route path="/staking" element={<Staking />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;

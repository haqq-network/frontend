import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Card, Container, Header } from '@haqq/ui-kit';
import '../index.css';

const Staking = React.lazy(() => import('staking/Module'));

export function App() {
  return (
    <React.Suspense fallback={null}>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <Container className="py-10">
              <Card>
                <h1 className="font-medium text-4xl leading-relaxed">
                  Hello there{' '}
                  <span role="img" aria-label="waves">
                    👋
                  </span>
                </h1>
              </Card>
            </Container>
          }
        />

        <Route path="/staking" element={<Staking />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
